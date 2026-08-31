"use server";

import { appConfig, hasAppwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient, ID } from "@/lib/appwrite/server";
import { InputFile } from "node-appwrite/file";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { itemSchema } from "@/lib/validators/items";
import type { ActionResult } from "@/types";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function buildPreviewUrl(fileId: string) {
  if (!appConfig.endpoint || !appConfig.projectId) {
    return "";
  }

  return `${appConfig.endpoint}/storage/buckets/${appConfig.buckets.itemImages}/files/${fileId}/preview?project=${appConfig.projectId}&width=640&quality=80`;
}

export async function createItem(input: unknown): Promise<ActionResult> {
  try {
    const values = itemSchema.parse(input);
    const user = await getLoggedInUser();

    if (!hasAppwriteConfig()) {
      return { success: true, data: { $id: ID.unique(), ...values, admin_id: user?.profile.userId, created_at: new Date().toISOString() } };
    }

    const { databases } = createAdminClient();
    const item = await databases.createDocument(appConfig.databaseId, appConfig.collections.items, ID.unique(), {
      ...values,
      admin_id: user?.profile.userId || "",
      created_at: new Date().toISOString()
    });

    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal menambah barang." };
  }
}

export async function updateItem(itemId: string, input: unknown): Promise<ActionResult> {
  try {
    const values = itemSchema.parse(input);

    if (!hasAppwriteConfig()) {
      return { success: true, data: { $id: itemId, ...values } };
    }

    const { databases } = createAdminClient();
    const item = await databases.updateDocument(appConfig.databaseId, appConfig.collections.items, itemId, values);

    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui barang." };
  }
}

export async function toggleItemAvailability(itemId: string, is_available: boolean): Promise<ActionResult> {
  try {
    if (!hasAppwriteConfig()) {
      return { success: true, data: { itemId, is_available } };
    }

    const { databases } = createAdminClient();
    const item = await databases.updateDocument(appConfig.databaseId, appConfig.collections.items, itemId, { is_available });
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengubah availability." };
  }
}

export async function deleteItem(itemId: string): Promise<ActionResult> {
  try {
    if (!hasAppwriteConfig()) {
      return { success: true, data: { itemId } };
    }

    const { databases } = createAdminClient();
    await databases.deleteDocument(appConfig.databaseId, appConfig.collections.items, itemId);

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal menghapus barang." };
  }
}

export async function uploadItemImage(formData: FormData): Promise<ActionResult<{ fileId: string; previewUrl: string }>> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "Tidak ada file yang dipilih." };
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) return { success: false, error: "Gunakan file JPG, PNG, atau WEBP." };
    if (file.size > MAX_IMAGE_SIZE) return { success: false, error: "Ukuran gambar maksimal 2MB." };

    if (!hasAppwriteConfig()) {
      return { success: true, data: { fileId: ID.unique(), previewUrl: "" } };
    }

    const { storage } = createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);
    const result = await storage.createFile(appConfig.buckets.itemImages, ID.unique(), inputFile);
    const previewUrl = buildPreviewUrl(result.$id);

    return { success: true, data: { fileId: result.$id, previewUrl } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengunggah gambar." };
  }
}
