import { Client, Databases, Storage, Permission, Role } from "node-appwrite";
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
    profiles: env.APPWRITE_PROFILES_COLLECTION_ID || "profiles",
    items: env.APPWRITE_ITEMS_COLLECTION_ID || "items",
    loans: env.APPWRITE_LOANS_COLLECTION_ID || "loans"
  },
  buckets: {
    itemImages: env.APPWRITE_ITEM_IMAGES_BUCKET_ID || "item-images"
  }
};

async function main() {
  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

  const databases = new Databases(client);
  const storage = new Storage(client);
  const dbId = config.databaseId;

  console.log(`🚀 Preparing Appwrite resources for Project: ${config.projectId}`);

  // 1. Create Database
  try {
    await databases.create(dbId, dbId);
    console.log(`✅ Database "${dbId}" created.`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`ℹ️ Database "${dbId}" already exists. Continuing...`);
    } else {
      console.log(`⚠️ Database "${dbId}" notice: ${error.message}. Attempting to continue...`);
    }
  }

  // 2. Define Collections Schema
  const collections = [
    {
      id: config.collections.profiles,
      name: "Profiles",
      permissions: [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.team("admin")),
      ],
      attributes: [
        { key: "userId", type: "string", size: 255, required: true },
        { key: "full_name", type: "string", size: 255, required: true },
        { key: "email", type: "string", size: 255, required: true },
        { key: "role", type: "enum", elements: ["admin", "client"], required: false, default: "client" },
        { key: "department", type: "string", size: 255, required: false },
        { key: "avatar_url", type: "string", size: 500, required: false },
        { key: "created_at", type: "datetime", required: false },
      ],
      indexes: [
        { key: "userId_idx", type: "unique", attributes: ["userId"] },
        { key: "email_idx", type: "key", attributes: ["email"] },
        { key: "role_idx", type: "key", attributes: ["role"] },
      ]
    },
    {
      id: config.collections.items,
      name: "Items",
      permissions: [
        Permission.read(Role.any()),
        Permission.create(Role.team("admin")),
        Permission.update(Role.team("admin")),
        Permission.delete(Role.team("admin")),
      ],
      attributes: [
        { key: "name", type: "string", size: 255, required: true },
        { key: "description", type: "string", size: 2000, required: false },
        { key: "category", type: "string", size: 100, required: true },
        { key: "quantity_total", type: "integer", required: true, min: 0 },
        { key: "quantity_available", type: "integer", required: true, min: 0 },
        { key: "is_available", type: "boolean", required: false, default: true },
        { key: "image_id", type: "string", size: 255, required: false },
        { key: "created_at", type: "datetime", required: false },
      ],
      indexes: [
        { key: "category_idx", type: "key", attributes: ["category"] },
        { key: "available_idx", type: "key", attributes: ["is_available"] },
      ]
    },
    {
      id: config.collections.loans,
      name: "Loans",
      permissions: [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.team("admin")),
      ],
      attributes: [
        { key: "item_id", type: "string", size: 255, required: true },
        { key: "borrower_id", type: "string", size: 255, required: true },
        { key: "quantity", type: "integer", required: true, min: 1 },
        { key: "purpose", type: "string", size: 500, required: true },
        { key: "borrow_date", type: "datetime", required: true },
        { key: "return_date", type: "datetime", required: true },
        { key: "actual_return_date", type: "datetime", required: false },
        { key: "status", type: "enum", elements: ["pending", "approved", "rejected", "returned", "overdue", "returning"], required: false, default: "pending" },
        { key: "admin_note", type: "string", size: 1000, required: false },
        { key: "admin_image_id", type: "string", size: 255, required: false },
        { key: "return_image_id", type: "string", size: 255, required: false },
        { key: "user_note", type: "string", size: 1000, required: false },
        { key: "created_at", type: "datetime", required: false },
      ],
      indexes: [
        { key: "status_idx", type: "key", attributes: ["status"] },
        { key: "borrower_idx", type: "key", attributes: ["borrower_id"] },
        { key: "item_idx", type: "key", attributes: ["item_id"] },
      ]
    }
  ];

  // 3. Create Collections and Attributes
  for (const col of collections) {
    try {
      await databases.createCollection(dbId, col.id, col.name, col.permissions);
      console.log(`✅ Collection "${col.name}" created.`);
    } catch (error: any) {
      if (error.code === 409) console.log(`ℹ️ Collection "${col.name}" already exists.`);
      else throw error;
    }

    // Add Attributes
    for (const attr of col.attributes) {
      try {
        if (attr.type === "string") {
          await databases.createStringAttribute(dbId, col.id, attr.key, attr.size!, attr.required, attr.default as string);
        } else if (attr.type === "integer") {
          await databases.createIntegerAttribute(dbId, col.id, attr.key, attr.required, attr.min, undefined, attr.default as number);
        } else if (attr.type === "boolean") {
          await databases.createBooleanAttribute(dbId, col.id, attr.key, attr.required, attr.default as boolean);
        } else if (attr.type === "enum") {
          await databases.createEnumAttribute(dbId, col.id, attr.key, attr.elements!, attr.required, attr.default as string);
        } else if (attr.type === "datetime") {
          await databases.createDatetimeAttribute(dbId, col.id, attr.key, attr.required);
        }
        console.log(`   🔸 Attribute "${attr.key}" created in "${col.name}".`);
      } catch (error: any) {
        if (error.code === 409) { /* skip */ }
        else console.error(`   ❌ Error creating attribute "${attr.key}":`, error.message);
      }
    }

    // Wait for attributes to be processed before creating indexes
    await new Promise(r => setTimeout(r, 3000));

    for (const idx of col.indexes) {
      try {
        await databases.createIndex(dbId, col.id, idx.key, idx.type as any, idx.attributes);
        console.log(`   🔹 Index "${idx.key}" created in "${col.name}".`);
      } catch (error: any) {
        if (error.code === 409) { /* skip */ }
        else console.error(`   ❌ Error creating index "${idx.key}":`, error.message);
      }
    }
  }

  // 4. Create Bucket
  try {
    await storage.createBucket(
      config.buckets.itemImages,
      "Item Images",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.team("admin")),
        Permission.delete(Role.team("admin")),
      ],
      false,
      true
    );
    console.log(`✅ Bucket "${config.buckets.itemImages}" created.`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`ℹ️ Bucket "${config.buckets.itemImages}" already exists. Updating permissions...`);
      try {
        await storage.updateBucket(
          config.buckets.itemImages,
          "Item Images",
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.team("admin")),
            Permission.delete(Role.team("admin")),
          ],
          false,
          true
        );
        console.log(`✅ Bucket "${config.buckets.itemImages}" permissions updated.`);
      } catch (e: any) {
        console.error(`❌ Failed to update bucket permissions:`, e.message);
      }
    } else {
      console.log(`⚠️ Bucket "${config.buckets.itemImages}" notice: ${error.message}. Attempting to continue...`);
    }
  }

  console.log("\n✨ Appwrite setup completed successfully!");
}

main().catch((error) => {
  console.error("❌ Setup failed:", error);
  process.exit(1);
});
