import { Query } from "node-appwrite";
import { appConfig, hasAppwriteConfig, buildPreviewUrl } from "@/lib/appwrite/config";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/server";
import { buildDashboardData, buildReportRows, mockItems, mockLoans, mockProfiles } from "@/lib/utils/mock-data";
import type { HistoryFilters, Item, Loan, Profile, ReportRow } from "@/types";

export async function getCatalogItems() {
  if (!hasAppwriteConfig()) {
    return mockItems;
  }

  const { databases } = createAdminClient();
  const response = await databases.listDocuments(
    appConfig.databaseId, 
    appConfig.collections.items,
    [Query.limit(5000), Query.orderDesc("$createdAt")]
  );

  return response.documents.map((document) => ({
    ...(document as unknown as Item),
    image_url: document.image_id ? buildPreviewUrl(document.image_id) : ""
  })) as Item[];
}

export async function getItemById(itemId: string) {
  if (!hasAppwriteConfig()) {
    const items = await getCatalogItems();
    return items.find((item) => item.$id === itemId) ?? null;
  }

  try {
    const { databases } = createAdminClient();
    const document = await databases.getDocument(appConfig.databaseId, appConfig.collections.items, itemId);
    return {
      ...(document as unknown as Item),
      image_url: document.image_id ? buildPreviewUrl(document.image_id) : ""
    } as Item;
  } catch (error) {
    console.error(`Failed to fetch item ${itemId}:`, error);
    return null;
  }
}

export async function getMyLoans(userId: string) {
  if (!hasAppwriteConfig()) {
    return mockLoans.filter((loan) => loan.borrower_id === userId);
  }

  const { databases } = createAdminClient();
  const [loansResponse, items, profiles] = await Promise.all([
    databases.listDocuments(appConfig.databaseId, appConfig.collections.loans, [
      Query.equal("borrower_id", userId),
      Query.limit(5000),
      Query.orderDesc("$createdAt")
    ]),
    getCatalogItems(),
    getProfiles()
  ]);

  return loansResponse.documents.map((loan) => ({
    ...(loan as unknown as Loan),
    item: items.find((i) => i.$id === loan.item_id),
    borrower: profiles.find((p) => p.userId === loan.borrower_id),
    admin: profiles.find((p) => p.userId === (loan as any).admin_id),
    return_image_url: (loan as any).return_image_id ? buildPreviewUrl((loan as any).return_image_id) : undefined
  })) as Loan[];
}

export async function getProfiles() {
  if (!hasAppwriteConfig()) {
    return mockProfiles;
  }

  const { databases } = createAdminClient();
  const response = await databases.listDocuments(
    appConfig.databaseId, 
    appConfig.collections.profiles,
    [Query.limit(5000)]
  );
  return response.documents as unknown as Profile[];
}

export async function getAdminDashboardData() {
  try {
    if (!hasAppwriteConfig()) {
      return buildDashboardData();
    }

    const loans = await getAllLoans();
    const items = await getCatalogItems();
    const profiles = await getProfiles();

    // 1. Calculate Status Distribution
    const statusCounts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      returned: 0,
      overdue: 0
    };
    loans.forEach((loan) => {
      if (statusCounts[loan.status] !== undefined) {
        statusCounts[loan.status]++;
      }
    });

    const statusDistribution = Object.entries(statusCounts).map(([label, value]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value
    }));

    // 2. Calculate Monthly Trend (Last 6 Months)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        month: d.getMonth(),
        year: d.getFullYear(),
        label: d.toLocaleString("id-ID", { month: "short" }),
        value: 0
      };
    }).reverse();

    loans.forEach((loan) => {
      const loanDate = new Date(loan.borrow_date);
      const m = loanDate.getMonth();
      const y = loanDate.getFullYear();
      const monthData = last6Months.find((lm) => lm.month === m && lm.year === y);
      if (monthData) {
        monthData.value++;
      }
    });

    // 3. Calculate Return Trend (Simplified for now)
    const returnTrend = last6Months.map((m) => ({
      label: m.label,
      value: loans.filter((l) => {
        const d = new Date(l.actual_return_date || l.return_date);
        return d.getMonth() === m.month && d.getFullYear() === m.year && l.status === "returned";
      }).length
    }));

    // 4. Calculate Top Borrowers (Top 5)
    const borrowerCounts: Record<string, { name: string; count: number }> = {};
    loans.forEach((loan) => {
      const name = loan.borrower?.full_name || "Unknown";
      const id = loan.borrower_id;
      if (!borrowerCounts[id]) {
        borrowerCounts[id] = { name, count: 0 };
      }
      borrowerCounts[id].count++;
    });

    const topBorrowers = Object.values(borrowerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((b) => ({ label: b.name, value: b.count }));

    // 5. Calculate Frequent Late Returns (Top 5)
    const lateCounts: Record<string, { name: string; count: number }> = {};
    loans
      .filter((l) => l.status === "overdue" || (l.actual_return_date && new Date(l.actual_return_date) > new Date(l.return_date)))
      .forEach((loan) => {
        const name = loan.borrower?.full_name || "Unknown";
        const id = loan.borrower_id;
        if (!lateCounts[id]) {
          lateCounts[id] = { name, count: 0 };
        }
        lateCounts[id].count++;
      });

    const frequentLateReturns = Object.values(lateCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((b) => ({ label: b.name, value: b.count }));

    return {
      stats: [
        { label: "Total Barang", value: items.length, helper: "Item dalam inventaris", icon: "Boxes" },
        {
          label: "Pinjaman Aktif",
          value: loans.filter((loan) => loan.status === "approved" || loan.status === "overdue").length,
          helper: "Sedang dipinjam",
          icon: "ClipboardList"
        },
        { label: "Pengajuan Pending", value: loans.filter((loan) => loan.status === "pending").length, helper: "Menunggu review", icon: "Clock" },
        { label: "Pengguna", value: profiles.length, helper: "Akun perusahaan", icon: "Users" }
      ],
      recentLoans: loans.slice(0, 5),
      monthlyLoans: last6Months.map(({ label, value }) => ({ label, value })),
      statusDistribution,
      returnTrend,
      topBorrowers,
      frequentLateReturns
    };
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
    return buildDashboardData();
  }
}

export async function getAllLoans() {
  if (!hasAppwriteConfig()) {
    return mockLoans;
  }

  const { databases } = createAdminClient();
  const [loansResponse, items, profiles] = await Promise.all([
    databases.listDocuments(appConfig.databaseId, appConfig.collections.loans, [
      Query.limit(5000),
      Query.orderDesc("$createdAt")
    ]),
    getCatalogItems(),
    getProfiles()
  ]);

  return loansResponse.documents.map((loan) => ({
    ...(loan as unknown as Loan),
    item: items.find((i) => i.$id === loan.item_id),
    borrower: profiles.find((p) => p.userId === loan.borrower_id),
    admin: profiles.find((p) => p.userId === (loan as any).admin_id),
    return_image_url: (loan as any).return_image_id ? buildPreviewUrl((loan as any).return_image_id) : undefined
  })) as Loan[];
}

export async function getHistory(filters: HistoryFilters = {}) {
  const loans = await getAllLoans();

  return loans.filter((loan) => {
    if (filters.status && loan.status !== filters.status) return false;
    if (filters.borrowerId && loan.borrower_id !== filters.borrowerId) return false;
    if (filters.itemId && loan.item_id !== filters.itemId) return false;
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const itemName = loan.item?.name?.toLowerCase() || "";
      const borrowerName = loan.borrower?.full_name?.toLowerCase() || "";
      if (!itemName.includes(search) && !borrowerName.includes(search)) return false;
      }

      if (filters.from) {
      const fromDate = new Date(filters.from);
      fromDate.setHours(0, 0, 0, 0);
      const loanDate = new Date(loan.borrow_date);
      if (loanDate < fromDate) return false;
      }

      if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      const loanDate = new Date(loan.borrow_date);
      if (loanDate > toDate) return false;
      }

      return true;
      });
      }
export async function getReports(): Promise<ReportRow[]> {
  if (!hasAppwriteConfig()) {
    return buildReportRows();
  }

  const loans = await getAllLoans();
  return loans.map((loan) => ({
    loanId: loan.$id,
    itemName: loan.item?.name ?? loan.item_id,
    borrowerName: loan.borrower?.full_name ?? loan.borrower_id,
    status: loan.status,
    quantity: loan.quantity,
    borrowDate: loan.borrow_date,
    returnDate: loan.return_date,
    actualReturnDate: loan.actual_return_date
  }));
}

export async function getActiveLoans() {
  const loans = await getAllLoans();
  return loans.filter((loan) => loan.status === "approved" || loan.status === "overdue");
}

export async function getCurrentUserProfile(sessionSecret?: string) {
  if (!hasAppwriteConfig()) {
    return mockProfiles[1];
  }

  if (!sessionSecret || sessionSecret === "mock-session") {
    return null;
  }

  try {
    const { account, databases } = createSessionClient(sessionSecret);
    const user = await account.get();
    const response = await databases.listDocuments(appConfig.databaseId, appConfig.collections.profiles, [
      Query.equal("userId", user.$id),
      Query.limit(1)
    ]);

    return (response.documents[0] as unknown as Profile | undefined) ?? null;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}
