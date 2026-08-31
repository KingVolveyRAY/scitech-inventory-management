import { Client, Databases } from "node-appwrite";
import fs from "fs";
import path from "path";

const env: Record<string, string> = {};
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach(line => {
  const [key, ...value] = line.split("=");
  if (key && value) env[key.trim()] = value.join("=").trim();
});

async function fixAttribute() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const dbId = env.APPWRITE_DATABASE_ID;
  const colId = env.APPWRITE_ITEMS_COLLECTION_ID;

  try {
    console.log("Deleting stuck attribute...");
    try {
      await databases.deleteAttribute(dbId, colId, "quantity_available");
      console.log("Waiting for deletion...");
      await new Promise(r => setTimeout(r, 5000));
    } catch (e) {}

    console.log("Re-creating attribute...");
    await databases.createIntegerAttribute(dbId, colId, "quantity_available", true, 0);
    console.log("✅ Attribute re-created. Please wait 1-2 minutes for it to become 'available'.");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

fixAttribute();
