import { Client, Databases, Storage } from "node-appwrite";
import fs from "fs";

// Simple env parser
const envContent = fs.readFileSync(".env.local", "utf8");
const env: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [key, ...value] = line.split("=");
  if (key && value) env[key.trim()] = value.join("=").trim();
});

async function test() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);

  try {
    console.log("Testing connection with:");
    console.log("- Endpoint:", env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
    console.log("- Project ID:", env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    
    const dbResponse = await databases.list();
    console.log("\n✅ Success! Found databases:", dbResponse.total);
    for (const db of dbResponse.databases) {
      console.log(`- Database ID: ${db.$id}, Name: ${db.name}`);
      const collections = await databases.listCollections(db.$id);
      console.log(`  Found collections: ${collections.total}`);
      collections.collections.forEach(col => {
        console.log(`    🔸 ID: ${col.$id}, Name: ${col.name}`);
      });
    }

    const storageResponse = await storage.listBuckets();
    console.log("\n✅ Success! Found buckets:", storageResponse.total);
    storageResponse.buckets.forEach(bucket => {
      console.log(`- ID: ${bucket.$id}, Name: ${bucket.name}`);
    });
  } catch (error: any) {
    console.error("\n❌ Failed:");
    console.error("- Code:", error.code);
    console.error("- Type:", error.type);
    console.error("- Message:", error.message);
  }
}

test();
