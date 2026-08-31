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

async function checkAttributes() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    const collection = await databases.getCollection(
      env.APPWRITE_DATABASE_ID,
      env.APPWRITE_ITEMS_COLLECTION_ID
    );
    console.log(`Attributes for collection "${collection.name}":`);
    collection.attributes.forEach((attr: any) => {
      console.log(`- ${attr.key} (${attr.type}) [status: ${attr.status}]`);
    });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

checkAttributes();
