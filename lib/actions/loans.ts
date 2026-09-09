"use server";

import { appConfig, hasAppwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient, ID } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { loanDecisionSchema, loanRequestSchema, requestReturnSchema, returnLoanSchema } from "@/lib/validators/loans";
import { mockLoans, mockItems } from "@/lib/utils/mock-data";
import type { ActionResult, LoanStatus, Loan } from "@/types";

export async function uploadReturnImage(formData: FormData): Promise<ActionResult<string>> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "Tidak ada file yang diunggah." };

    if (!hasAppwriteConfig()) {
      return { success: true, data: "mock-id-" + Date.now() };
    }

    const { storage } = createAdminClient();
    
    // Convert File to Buffer for InputFile.fromBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedFile = await storage.createFile(
      appConfig.buckets.itemImages,
      ID.unique(),
      InputFile.fromBuffer(buffer, file.name)
    );

    return { success: true, data: uploadedFile.$id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengunggah gambar." };
  }
}

async function updateLoanStatus(
  loanId: string, 
  status: LoanStatus, 
  admin_note?: string, 
  actual_return_date?: string, 
  admin_image_id?: string,
  extras?: object
) {
  const user = await getLoggedInUser();
  const payload = {
    status,
    admin_id: user?.profile.userId || "",
    admin_note: admin_note || "",
    ...(actual_return_date ? { actual_return_date } : {}),
    ...(admin_image_id ? { admin_image_id } : {}),
    ...extras
  };

  const { databases } = createAdminClient();
  return databases.updateDocument(appConfig.databaseId, appConfig.collections.loans, loanId, payload);
}

export async function createLoanRequest(input: unknown): Promise<ActionResult> {
  try {
    const values = loanRequestSchema.parse(input);
    const user = await getLoggedInUser();

    if (!user) {
      return { success: false, error: "Sesi pengguna tidak ditemukan." };
    }

    if (!hasAppwriteConfig()) {
      const newLoan: Loan = {
        $id: "mock-loan-" + Date.now(),
        ...values,
        borrower_id: user.profile.userId,
        status: "pending",
        created_at: new Date().toISOString(),
        item: mockItems.find(i => i.$id === values.item_id),
        borrower: user.profile
      };
      mockLoans.unshift(newLoan);
      return { success: true, data: newLoan };
    }

    const { databases } = createAdminClient();
    const loan = await databases.createDocument(appConfig.databaseId, appConfig.collections.loans, ID.unique(), {
      ...values,
      borrower_id: user.profile.userId,
      status: "pending",
      created_at: new Date().toISOString()
    });

    return { success: true, data: loan };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal membuat pengajuan pinjaman." };
  }
}

export async function approveLoan(input: unknown): Promise<ActionResult> {
  try {
    const values = loanDecisionSchema.parse(input);

    if (!hasAppwriteConfig()) {
      const loan = mockLoans.find(l => l.$id === values.loanId);
      if (loan) {
        loan.status = "approved";
        if (values.admin_note) loan.admin_note = values.admin_note;
        if (values.admin_image_id) loan.admin_image_id = values.admin_image_id;
        const item = mockItems.find(i => i.$id === loan.item_id);
        if (item) item.quantity_available -= loan.quantity;
      }
      return { success: true, data: values };
    }

    const { databases } = createAdminClient();
    const loan = await databases.getDocument(appConfig.databaseId, appConfig.collections.loans, values.loanId);
    const item = await databases.getDocument(appConfig.databaseId, appConfig.collections.items, loan.item_id);
    const nextAvailable = Number(item.quantity_available) - Number(loan.quantity);

    if (nextAvailable < 0) {
      return { success: false, error: "Stok tersedia tidak mencukupi." };
    }

    await databases.updateDocument(appConfig.databaseId, appConfig.collections.items, item.$id, {
      quantity_available: nextAvailable
    });

    const updatedLoan = await updateLoanStatus(values.loanId, "approved", values.admin_note, undefined, values.admin_image_id);
    return { success: true, data: updatedLoan };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal menyetujui pinjaman." };
  }
}

export async function rejectLoan(input: unknown): Promise<ActionResult> {
  try {
    const values = loanDecisionSchema.parse(input);

    if (!hasAppwriteConfig()) {
      const loan = mockLoans.find(l => l.$id === values.loanId);
      if (loan) {
        loan.status = "rejected";
        if (values.admin_note) loan.admin_note = values.admin_note;
        if (values.admin_image_id) loan.admin_image_id = values.admin_image_id;
      }
      return { success: true, data: values };
    }

    const updatedLoan = await updateLoanStatus(values.loanId, "rejected", values.admin_note, undefined, values.admin_image_id);
    return { success: true, data: updatedLoan };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal menolak pinjaman." };
  }
}

export async function markLoanReturned(input: unknown): Promise<ActionResult> {
  try {
    const values = returnLoanSchema.parse(input);

    if (!hasAppwriteConfig()) {
      const loan = mockLoans.find(l => l.$id === values.loanId);
      if (loan) {
        loan.status = "returned";
        if (values.admin_note) loan.admin_note = values.admin_note;
        if (values.actual_return_date) loan.actual_return_date = values.actual_return_date;
        const item = mockItems.find(i => i.$id === loan.item_id);
        if (item) item.quantity_available += loan.quantity;
      }
      return { success: true, data: values };
    }

    const { databases } = createAdminClient();
    const loan = await databases.getDocument(appConfig.databaseId, appConfig.collections.loans, values.loanId);
    const item = await databases.getDocument(appConfig.databaseId, appConfig.collections.items, loan.item_id);

    await databases.updateDocument(appConfig.databaseId, appConfig.collections.items, item.$id, {
      quantity_available: Number(item.quantity_available) + Number(loan.quantity)
    });

    const updatedLoan = await updateLoanStatus(values.loanId, "returned", values.admin_note, values.actual_return_date);
    return { success: true, data: updatedLoan };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengonfirmasi pengembalian." };
  }
}

export async function requestReturn(input: unknown): Promise<ActionResult> {
  try {
    const values = requestReturnSchema.parse(input);

    if (!hasAppwriteConfig()) {
      const loan = mockLoans.find(l => l.$id === values.loanId);
      if (loan) {
        loan.status = "returning";
        if (values.user_note) loan.user_note = values.user_note;
        if (values.return_image_id) loan.return_image_id = values.return_image_id;
      }
      return { success: true, data: values };
    }

    const updatedLoan = await updateLoanStatus(values.loanId, "returning", undefined, undefined, undefined, {
      return_image_id: values.return_image_id,
      user_note: values.user_note
    });

    return { success: true, data: updatedLoan };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengajukan pengembalian." };
  }
}

export async function deleteLoan(loanId: string): Promise<ActionResult> {
  try {
    if (!hasAppwriteConfig()) {
      const index = mockLoans.findIndex(l => l.$id === loanId);
      if (index !== -1) mockLoans.splice(index, 1);
      return { success: true };
    }

    const { databases } = createAdminClient();
    await databases.deleteDocument(appConfig.databaseId, appConfig.collections.loans, loanId);

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal menghapus data pinjaman." };
  }
}

export async function deleteAllLoans(): Promise<ActionResult> {
  try {
    if (!hasAppwriteConfig()) {
      mockLoans.splice(0, mockLoans.length);
      return { success: true };
    }

    const { databases } = createAdminClient();
    
    let deletedCount = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await databases.listDocuments(
        appConfig.databaseId, 
        appConfig.collections.loans,
        [Query.limit(100)]
      );
      
      if (response.documents.length === 0) {
        hasMore = false;
        break;
      }

      await Promise.all(
        response.documents.map((loan) => 
          databases.deleteDocument(appConfig.databaseId, appConfig.collections.loans, loan.$id)
        )
      );

      deletedCount += response.documents.length;
      if (response.documents.length < 100) {
        hasMore = false;
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal menghapus semua data pinjaman." };
  }
}
