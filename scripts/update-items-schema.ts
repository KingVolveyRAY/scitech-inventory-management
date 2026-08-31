import { Client, Databases } from "node-appwrite";
import fs from "fs";
import path from "path";

// --- Manual Env Loading ---
const env: Record<string, string> = {};
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach(line => {
      const [key, ...value] = line.split("=");
      if (key && value) {
        env[key.trim()] = value.join("=").trim();
      }
    });
  }
} catch (e) {
  console.error("❌ Could not load .env.local");
}

const config = {
  endpoint: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: env.APPWRITE_API_KEY,
  databaseId: env.APPWRITE_DATABASE_ID || "sims-db",
  collections: {
    items: env.APPWRITE_ITEMS_COLLECTION_ID || "items"
  }
};

async function main() {
  if (!config.apiKey) {
    console.error("❌ APPWRITE_API_KEY is missing. Cannot update schema.");
    return;
  }

  const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setKey(config.apiKey!);

  const databases = new Databases(client);
  const dbId = config.databaseId;
  const itemColId = config.collections.items;

  console.log(`🚀 Updating schema for collection: ${itemColId}`);

  // Add admin_id to Items
  try {
    await databases.createStringAttribute(dbId, itemColId, "admin_id", 255, false);
    console.log(`✅ Attribute "admin_id" created in Items.`);
  } catch (error: any) {
    if (error.code === 409) console.log(`ℹ️ Attribute "admin_id" already exists in Items.`);
    else console.error(`❌ Error creating "admin_id" in Items:`, error.message);
  }

  console.log("\n✨ Item schema update finished!");
}

main().catch((error) => {
  console.error("❌ Update failed:", error);
});
