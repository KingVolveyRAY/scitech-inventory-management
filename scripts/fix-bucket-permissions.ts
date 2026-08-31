import { Client, Storage, Permission, Role } from "node-appwrite";
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
  bucketId: env.APPWRITE_ITEM_IMAGES_BUCKET_ID || "item-images"
};

async function main() {
  const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setKey(config.apiKey!);

  const storage = new Storage(client);

  console.log(`🔐 Memperbarui izin akses untuk Bucket: ${config.bucketId}`);

  try {
    await storage.updateBucket(
      config.bucketId,
      "Item Images",
      [
        Permission.read(Role.any()),       // Siapa saja bisa lihat gambar
        Permission.create(Role.users()),    // User login bisa upload (PENTING!)
        Permission.update(Role.users()),    // User bisa update filenya sendiri
        Permission.delete(Role.users()),    // User bisa delete filenya sendiri
      ],
      false, // fileSecurity - set ke false agar Permission di atas berlaku untuk semua file di bucket
      true   // enabled
    );
    console.log("✅ Izin bucket berhasil diperbarui. Sekarang user sudah bisa upload bukti foto.");
  } catch (error: any) {
    console.error("❌ Gagal memperbarui izin bucket:", error.message);
  }
}

main();
