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
  process.exit(1);
}

const config = {
  endpoint: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: env.APPWRITE_API_KEY,
  databaseId: env.APPWRITE_DATABASE_ID || "sims-db",
  collections: {
    loans: env.APPWRITE_LOANS_COLLECTION_ID || "loans"
  }
};

async function main() {
  const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setKey(config.apiKey!);

  const databases = new Databases(client);
  const dbId = config.databaseId;
  const loanColId = config.collections.loans;

  console.log(`🚀 Updating schema for collection: ${loanColId}`);

  // 1. Add return_image_id
  try {
    await databases.createStringAttribute(dbId, loanColId, "return_image_id", 255, false);
    console.log(`✅ Attribute "return_image_id" created.`);
  } catch (error: any) {
    if (error.code === 409) console.log(`ℹ️ Attribute "return_image_id" already exists.`);
    else console.error(`❌ Error creating "return_image_id":`, error.message);
  }

  // 2. Add user_note
  try {
    await databases.createStringAttribute(dbId, loanColId, "user_note", 1000, false);
    console.log(`✅ Attribute "user_note" created.`);
  } catch (error: any) {
    if (error.code === 409) console.log(`ℹ️ Attribute "user_note" already exists.`);
    else console.error(`❌ Error creating "user_note":`, error.message);
  }

  // 3. Add admin_id
  try {
    await databases.createStringAttribute(dbId, loanColId, "admin_id", 255, false);
    console.log(`✅ Attribute "admin_id" created.`);
  } catch (error: any) {
    if (error.code === 409) console.log(`ℹ️ Attribute "admin_id" already exists.`);
    else console.error(`❌ Error creating "admin_id":`, error.message);
  }

  // 3. Status enum update is tricky in Appwrite (can't just add a value)
  // We recommend manual update in Console OR delete and recreate if no data
  console.log(`\n⚠️ NOTE: Appwrite does not support adding values to existing Enum attributes via API without recreation.`);
  console.log(`Please go to Appwrite Console -> Database -> ${dbId} -> ${loanColId} -> Attributes`);
  console.log(`Update "status" attribute to include "returning" in the elements list.`);
  
  console.log("\n✨ Update script finished!");
}

main().catch((error) => {
  console.error("❌ Update failed:", error);
  process.exit(1);
});
