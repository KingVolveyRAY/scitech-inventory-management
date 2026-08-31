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

async function checkData() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    const response = await databases.listDocuments(
      env.APPWRITE_DATABASE_ID,
      env.APPWRITE_ITEMS_COLLECTION_ID
    );
    console.log("Items in database:");
    response.documents.forEach((doc: any) => {
      console.log(`- Name: ${doc.name}`);
      console.log(`  ID: ${doc.$id}`);
      console.log(`  Image ID: ${doc.image_id}`);
      console.log(`  ---`);
    });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

checkData();
