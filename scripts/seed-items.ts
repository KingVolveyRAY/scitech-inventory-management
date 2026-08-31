import { Client, Databases, Storage, ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import fs from "fs";
import path from "path";

// 1. Load environment variables from .env.local
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
    items: env.APPWRITE_ITEMS_COLLECTION_ID || "items"
  },
  buckets: {
    itemImages: env.APPWRITE_ITEM_IMAGES_BUCKET_ID || "item-images"
  }
};

// 2. Define the exact items list requested by the user
const itemsToSeed = [
  {
    name: "Rfid (putih)",
    quantity: 5,
    category: "Security",
    description: "Kartu RFID warna putih frekuensi 13.56 MHz.",
    searchQuery: "RFID card white 13.56mhz"
  },
  {
    name: "Rfid (biru)",
    quantity: 14,
    category: "Security",
    description: "Gantungan kunci (key fob) RFID warna biru.",
    searchQuery: "RFID key fob blue 13.56mhz"
  },
  {
    name: "Rfid mesin",
    quantity: 17,
    category: "Security",
    description: "Modul reader RFID RC522 untuk membaca tag/kartu RFID.",
    searchQuery: "RFID RC522 reader module"
  },
  {
    name: "Keypad",
    quantity: 1,
    category: "Input",
    description: "Keypad matriks 4x4 membran untuk input data pin/password.",
    searchQuery: "membrane keypad 4x4 matrix"
  },
  {
    name: "Oled",
    quantity: 25,
    category: "Display",
    description: "Layar OLED Display 0.96 inch dengan interface I2C.",
    searchQuery: "OLED display 0.96 I2C arduino"
  },
  {
    name: "LED Traffic light",
    quantity: 19,
    category: "Display/LED",
    description: "Modul LED indikator lalu lintas (Merah, Kuning, Hijau).",
    searchQuery: "traffic light LED module arduino"
  },
  {
    name: "Motor driver",
    quantity: 3,
    category: "Driver",
    description: "Modul L298N H-Bridge dual motor driver untuk mengontrol motor DC.",
    searchQuery: "L298N motor driver module"
  },
  {
    name: "touch sensor",
    quantity: 19,
    category: "Sensor",
    description: "Sensor sentuh TTP223 capacitive touch sensor module.",
    searchQuery: "TTP223 touch sensor module"
  },
  {
    name: "Infrared",
    quantity: 25, // 24 + 1
    category: "Sensor",
    description: "Sensor inframerah untuk deteksi rintangan (obstacle avoidance).",
    searchQuery: "IR infrared obstacle avoidance sensor"
  },
  {
    name: "Ultrasonik",
    quantity: 33, // 31 + 2
    category: "Sensor",
    description: "Sensor ultrasonik HC-SR04 untuk pengukuran jarak.",
    searchQuery: "HC-SR04 ultrasonic sensor"
  },
  {
    name: "Dht 22",
    quantity: 2,
    category: "Sensor",
    description: "Sensor suhu dan kelembaban udara dengan akurasi tinggi.",
    searchQuery: "DHT22 temperature humidity sensor"
  },
  {
    name: "Dht 11",
    quantity: 14, // 13 + 1
    category: "Sensor",
    description: "Sensor suhu dan kelembaban udara standar.",
    searchQuery: "DHT11 temperature humidity sensor"
  },
  {
    name: "Stepdown",
    quantity: 2,
    category: "Power",
    description: "Modul step-down DC-to-DC LM2596 untuk menurunkan tegangan.",
    searchQuery: "LM2596 step down converter module"
  },
  {
    name: "Relay channel 1",
    quantity: 4, // 3 + 1
    category: "Relay",
    description: "Modul relay 1 channel 5V untuk mengendalikan beban arus AC/DC besar.",
    searchQuery: "1 channel relay module 5v"
  },
  {
    name: "Relay channel 4",
    quantity: 3,
    category: "Relay",
    description: "Modul relay 4 channel 5V dengan optocoupler.",
    searchQuery: "4 channel relay module 5v"
  },
  {
    name: "Servo driver",
    quantity: 4,
    category: "Driver",
    description: "PCA9685 16-channel 12-bit PWM servo driver interface I2C.",
    searchQuery: "PCA9685 servo driver module"
  },
  {
    name: "Extension arduino",
    quantity: 2,
    category: "Accessory",
    description: "Arduino UNO Sensor Shield V5.0 expansion board.",
    searchQuery: "Arduino UNO sensor shield V5"
  },
  {
    name: "Konektor baterai 9v kotak",
    quantity: 14,
    category: "Power",
    description: "Kabel konektor clip-on baterai 9V tipe kotak dengan jack DC.",
    searchQuery: "9v battery connector clip DC jack"
  },
  {
    name: "Servo sg90",
    quantity: 27, // 26 + 1
    category: "Actuator",
    description: "Micro servo motor SG90 9g untuk kontrol posisi presisi.",
    searchQuery: "SG90 micro servo motor 9g"
  },
  {
    name: "Buzzer module",
    quantity: 28,
    category: "Output",
    description: "Modul active buzzer 5V untuk alarm/suara.",
    searchQuery: "active buzzer module arduino"
  },
  {
    name: "Flame sensor",
    quantity: 24, // 19 + 5
    category: "Sensor",
    description: "Sensor pendeteksi api atau radiasi inframerah.",
    searchQuery: "flame sensor module arduino"
  },
  {
    name: "Mq 2",
    quantity: 25, // 24 + 1
    category: "Sensor",
    description: "Sensor gas LPG, asap, dan gas mudah terbakar lainnya.",
    searchQuery: "MQ2 gas sensor module"
  },
  {
    name: "Mq 7",
    quantity: 1,
    category: "Sensor",
    description: "Sensor gas Karbon Monoksida (CO).",
    searchQuery: "MQ7 carbon monoxide sensor module"
  },
  {
    name: "Lcd",
    quantity: 27,
    category: "Display",
    description: "Karakter LCD 16x2 dengan backpack modul I2C.",
    searchQuery: "LCD 16x2 I2C display module"
  },
  {
    name: "Sensor suara",
    quantity: 18,
    category: "Sensor",
    description: "Sensor mikrofon suara untuk mendeteksi intensitas suara.",
    searchQuery: "sound sensor module microphone"
  },
  {
    name: "Arduino",
    quantity: 21, // 21 + 2 - 2
    category: "Microcontroller",
    description: "Arduino Uno R3 development board microcontroller.",
    searchQuery: "Arduino Uno R3 board"
  },
  {
    name: "Esp",
    quantity: 42, // 40 + 2
    category: "Microcontroller",
    description: "ESP32 NodeMCU development board dengan WiFi dan Bluetooth.",
    searchQuery: "ESP32 NodeMCU board"
  },
  {
    name: "Buzzer",
    quantity: 18,
    category: "Output",
    description: "Piezo buzzer pasif/aktif tanpa board tambahan.",
    searchQuery: "piezo buzzer component 5v"
  }
];

async function scrapeImageUrlFromBing(query: string): Promise<string | null> {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) return null;

    const html = await res.text();
    const bingUrlPattern = /https?(?:%3a%2f%2f|:\/\/)(?:th\.bing\.com)(?:%2f|\/)th(?:%2f|\/)id(?:%2f|\/)[a-zA-Z0-9_\-\.%?=&]+/gi;
    const matches = html.match(bingUrlPattern);
    
    if (matches && matches.length > 0) {
      return decodeURIComponent(matches[0]);
    }
    return null;
  } catch (error: any) {
    console.error(`      ⚠️ Error scraping Bing image for "${query}":`, error.message);
    return null;
  }
}

async function seed() {
  if (!config.endpoint || !config.projectId || !config.apiKey) {
    console.error("❌ Missing required Appwrite environment variables in .env.local");
    process.exit(1);
  }

  console.log("🚀 Initializing Appwrite Clients...");
  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

  const databases = new Databases(client);
  const storage = new Storage(client);

  // A. Clean up existing items from the database
  console.log("\n🧹 Cleaning up existing items from the database...");
  try {
    const list = await databases.listDocuments(config.databaseId, config.collections.items);
    for (const doc of list.documents) {
      await databases.deleteDocument(config.databaseId, config.collections.items, doc.$id);
      console.log(`   🗑️ Deleted database document: ${doc.name} (${doc.$id})`);
    }
    console.log("✅ Database items cleaned up.");
  } catch (error: any) {
    console.error("⚠️ Database clean up notice:", error.message);
  }

  // B. Clean up existing files in the bucket
  console.log("\n🧹 Cleaning up existing files from the storage bucket...");
  try {
    const filesList = await storage.listFiles(config.buckets.itemImages);
    for (const file of filesList.files) {
      await storage.deleteFile(config.buckets.itemImages, file.$id);
      console.log(`   🗑️ Deleted storage file: ${file.name} (${file.$id})`);
    }
    console.log("✅ Storage bucket files cleaned up.");
  } catch (error: any) {
    console.error("⚠️ Storage clean up notice:", error.message);
  }

  console.log("\n🌱 Starting seeding process for 28 items...");

  for (let i = 0; i < itemsToSeed.length; i++) {
    const item = itemsToSeed[i];
    console.log(`\n[${i + 1}/${itemsToSeed.length}] Processing item: "${item.name}"`);
    let uploadedImageId = "";

    // 1. Scrape & Download Image from Bing
    const imageUrl = await scrapeImageUrlFromBing(item.searchQuery);
    if (imageUrl) {
      try {
        console.log(`   🔍 Found image on Bing. Downloading...`);
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          
          // Prepare InputFile from buffer
          const fileName = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.jpg`;
          const inputFile = InputFile.fromBuffer(buffer, fileName);
          
          console.log(`   📤 Uploading image to Appwrite storage...`);
          const uploadResult = await storage.createFile(
            config.buckets.itemImages,
            ID.unique(),
            inputFile,
            [
              Permission.read(Role.any()),
              Permission.update(Role.team("admin")),
              Permission.delete(Role.team("admin")),
            ]
          );
          
          uploadedImageId = uploadResult.$id;
          console.log(`   ✅ Image uploaded. File ID: ${uploadedImageId}`);
        } else {
          console.warn(`   ⚠️ Failed to download image from "${imageUrl}", status: ${imgRes.status}`);
        }
      } catch (uploadError: any) {
        console.error(`   ⚠️ Failed to download/upload image:`, uploadError.message);
      }
    } else {
      console.warn(`   ⚠️ No image found on Bing for query "${item.searchQuery}"`);
    }

    // 2. Insert Document in Database
    try {
      const itemData = {
        name: item.name,
        description: item.description,
        category: item.category,
        quantity_total: item.quantity,
        quantity_available: item.quantity, // Initially set available equal to total
        is_available: item.quantity > 0,
        image_id: uploadedImageId || undefined,
        created_at: new Date().toISOString()
      };

      console.log(`   💾 Saving document to collection "${config.collections.items}"...`);
      const documentResult = await databases.createDocument(
        config.databaseId,
        config.collections.items,
        ID.unique(),
        itemData
      );

      console.log(`   ✅ Successfully seeded "${item.name}". Document ID: ${documentResult.$id}`);
    } catch (dbError: any) {
      console.error(`   ❌ Failed to insert database document for "${item.name}":`, dbError.message);
    }
    
    // Slight pause to avoid spamming the Bing Search endpoint
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n✨ Database and Storage seeding completed successfully!");
}

seed().catch(err => {
  console.error("❌ Seeding failed with unexpected error:", err);
});
