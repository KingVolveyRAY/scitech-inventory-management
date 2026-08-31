import { designSystem } from "@/lib/design-system";

export const appConfig = {
  appName: designSystem.appName,
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
  apiKey: process.env.APPWRITE_API_KEY || "",
  sessionCookieName: process.env.SESSION_COOKIE_NAME || "sims-session",
  databaseId: process.env.APPWRITE_DATABASE_ID || "sims-db",
  collections: {
    profiles: process.env.APPWRITE_PROFILES_COLLECTION_ID || "profiles",
    items: process.env.APPWRITE_ITEMS_COLLECTION_ID || "items",
    loans: process.env.APPWRITE_LOANS_COLLECTION_ID || "loans"
  },
  buckets: {
    itemImages: process.env.APPWRITE_ITEM_IMAGES_BUCKET_ID || "item-images"
  },
  indexes: {
    profileUserId: "profiles_userId_idx",
    profileEmail: "profiles_email_idx",
    profileRole: "profiles_role_idx",
    itemCategory: "items_category_idx",
    itemAvailability: "items_available_idx",
    itemCreatedAt: "items_created_at_idx",
    loanStatus: "loans_status_idx",
    loanBorrower: "loans_borrower_idx",
    loanItem: "loans_item_idx"
  }
} as const;

export function hasAppwriteConfig() {
  const hasConfig = Boolean(appConfig.endpoint && appConfig.projectId);
  if (typeof window !== "undefined" && !hasConfig) {
    console.warn("⚠️ Appwrite Client Configuration is missing environment variables!", {
      endpoint: appConfig.endpoint,
      projectId: appConfig.projectId
    });
  }
  return hasConfig;
}

export function buildPreviewUrl(fileId: string) {
  if (!fileId || fileId === "mock-id" || !appConfig.endpoint || !appConfig.projectId) return "";
  
  const baseUrl = appConfig.endpoint.endsWith("/") ? appConfig.endpoint.slice(0, -1) : appConfig.endpoint;
  
  return `${baseUrl}/storage/buckets/${appConfig.buckets.itemImages}/files/${fileId}/view?project=${appConfig.projectId}`;
}
