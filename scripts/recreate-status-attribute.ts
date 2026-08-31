import { Client, Databases } from "node-appwrite";
import fs from "fs";
import path from "path";

const env: Record<string, string> = {};
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach(line => {
      const [key, ...value] = line.split("=");
      if (key && value) env[key.trim()] = value.join("=").trim();
    });
  }
} catch (e) {}

const config = {
  endpoint: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: env.APPWRITE_API_KEY,
  databaseId: env.APPWRITE_DATABASE_ID || "sims-db",
  loanColId: env.APPWRITE_LOANS_COLLECTION_ID || "loans"
};

async function main() {
  const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setKey(config.apiKey!);

  const databases = new Databases(client);
  const { databaseId, loanColId } = config;

  console.log("🔄 Menghapus atribut 'status' lama...");
  try {
    await databases.deleteAttribute(databaseId, loanColId, "status");
    console.log("✅ Atribut lama berhasil dihapus.");
  } catch (e: any) {
    console.log("ℹ️ Atribut tidak ditemukan atau sudah dihapus.");
  }

  console.log("⏳ Menunggu Appwrite memproses penghapusan (5 detik)...");
  await new Promise(r => setTimeout(r, 5000));

  console.log("🆕 Membuat atribut 'status' baru dengan opsi 'returning'...");
  try {
    await databases.createEnumAttribute(
      databaseId, 
      loanColId, 
      "status", 
      ["pending", "approved", "rejected", "returned", "overdue", "returning"], 
      false, 
      "pending"
    );
    console.log("✅ Atribut 'status' baru berhasil dibuat!");
  } catch (error: any) {
    console.error("❌ Gagal membuat atribut:", error.message);
  }
}

main();
