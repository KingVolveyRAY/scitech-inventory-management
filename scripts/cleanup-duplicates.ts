import { Client, Databases, Storage } from "node-appwrite";
import fs from "fs";

// Simple env parser
const envContent = fs.readFileSync(".env.local", "utf8");
const env: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [key, ...value] = line.split("=");
  if (key && value) env[key.trim()] = value.join("=").trim();
});

async function cleanup() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);
  const dbId = env.APPWRITE_DATABASE_ID;

  const collectionsToDelete = [
    "helios-profiles",
    "helios-items",
    "helios-loans"
  ];

  const bucketsToDelete = [
    "helios-images"
  ];

  console.log("🧹 Starting cleanup of duplicate resources...");

  for (const colId of collectionsToDelete) {
    try {
      await databases.deleteCollection(dbId, colId);
      console.log(`✅ Deleted collection: ${colId}`);
    } catch (error: any) {
      if (error.code === 404) {
        console.log(`ℹ️ Collection ${colId} already gone or not found.`);
      } else {
        console.error(`❌ Failed to delete collection ${colId}:`, error.message);
      }
    }
  }

  for (const bucketId of bucketsToDelete) {
    try {
      await storage.deleteBucket(bucketId);
      console.log(`✅ Deleted bucket: ${bucketId}`);
    } catch (error: any) {
      if (error.code === 404) {
        console.log(`ℹ️ Bucket ${bucketId} already gone or not found.`);
      } else {
        console.error(`❌ Failed to delete bucket ${bucketId}:`, error.message);
      }
    }
  }

  console.log("\n✨ Cleanup finished!");
}

cleanup();
