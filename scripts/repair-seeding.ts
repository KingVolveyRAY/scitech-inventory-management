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

const itemsToSeed = [
  { name: "Rfid (putih)", quantity: 5, category: "Security", description: "Kartu RFID warna putih frekuensi 13.56 MHz.", searchQuery: "RFID card white 13.56mhz" },
  { name: "Rfid (biru)", quantity: 14, category: "Security", description: "Gantungan kunci (key fob) RFID warna biru.", searchQuery: "RFID key fob blue 13.56mhz" },
  { name: "Rfid mesin", quantity: 17, category: "Security", description: "Modul reader RFID RC522 untuk membaca tag/kartu RFID.", searchQuery: "RFID RC522 reader module" },
  { name: "Keypad", quantity: 1, category: "Input", description: "Keypad matriks 4x4 membran untuk input data pin/password.", searchQuery: "membrane keypad 4x4 matrix" },
  { name: "Oled", quantity: 25, category: "Display", description: "Layar OLED Display 0.96 inch dengan interface I2C.", searchQuery: "OLED display 0.96 I2C arduino" },
  { name: "LED Traffic light", quantity: 19, category: "Display/LED", description: "Modul LED indikator lalu lintas (Merah, Kuning, Hijau).", searchQuery: "traffic light LED module arduino" },
  { name: "Motor driver", quantity: 3, category: "Driver", description: "Modul L298N H-Bridge dual motor driver untuk mengontrol motor DC.", searchQuery: "L298N motor driver module" },
  { name: "touch sensor", quantity: 19, category: "Sensor", description: "Sensor sentuh TTP223 capacitive touch sensor module.", searchQuery: "TTP223 touch sensor module" },
  { name: "Infrared", quantity: 25, category: "Sensor", description: "Sensor inframerah untuk deteksi rintangan (obstacle avoidance).", searchQuery: "IR infrared obstacle avoidance sensor" },
  { name: "Ultrasonik", quantity: 33, category: "Sensor", description: "Sensor ultrasonik HC-SR04 untuk pengukuran jarak.", searchQuery: "HC-SR04 ultrasonic sensor" },
  { name: "Dht 22", quantity: 2, category: "Sensor", description: "Sensor suhu dan kelembaban udara dengan akurasi tinggi.", searchQuery: "DHT22 temperature humidity sensor" },
  { name: "Dht 11", quantity: 14, category: "Sensor", description: "Sensor suhu dan kelembaban udara standar.", searchQuery: "DHT11 temperature humidity sensor" },
  { name: "Stepdown", quantity: 2, category: "Power", description: "Modul step-down DC-to-DC LM2596 untuk menurunkan tegangan.", searchQuery: "LM2596 step down converter module" },
  { name: "Relay channel 1", quantity: 4, category: "Relay", description: "Modul relay 1 channel 5V untuk mengendalikan beban arus AC/DC besar.", searchQuery: "1 channel relay module 5v" },
  { name: "Relay channel 4", quantity: 3, category: "Relay", description: "Modul relay 4 channel 5V dengan optocoupler.", searchQuery: "4 channel relay module 5v" },
  { name: "Servo driver", quantity: 4, category: "Driver", description: "PCA9685 16-channel 12-bit PWM servo driver interface I2C.", searchQuery: "PCA9685 servo driver module" },
  { name: "Extension arduino", quantity: 2, category: "Accessory", description: "Arduino UNO Sensor Shield V5.0 expansion board.", searchQuery: "Arduino UNO sensor shield V5" },
  { name: "Konektor baterai 9v kotak", quantity: 14, category: "Power", description: "Kabel konektor clip-on baterai 9V tipe kotak dengan jack DC.", searchQuery: "9v battery connector clip DC jack" },
  { name: "Servo sg90", quantity: 27, category: "Actuator", description: "Micro servo motor SG90 9g untuk kontrol posisi presisi.", searchQuery: "SG90 micro servo motor 9g" },
  { name: "Buzzer module", quantity: 28, category: "Output", description: "Modul active buzzer 5V untuk alarm/suara.", searchQuery: "active buzzer module arduino" },
  { name: "Flame sensor", quantity: 24, category: "Sensor", description: "Sensor pendeteksi api atau radiasi inframerah.", searchQuery: "flame sensor module arduino" },
  { name: "Mq 2", quantity: 25, category: "Sensor", description: "Sensor gas LPG, asap, dan gas mudah terbakar lainnya.", searchQuery: "MQ2 gas sensor module" },
  { name: "Mq 7", quantity: 1, category: "Sensor", description: "Sensor gas Karbon Monoksida (CO).", searchQuery: "MQ7 carbon monoxide sensor module" },
  { name: "Lcd", quantity: 27, category: "Display", description: "Karakter LCD 16x2 dengan backpack modul I2C.", searchQuery: "LCD 16x2 I2C display module" },
  { name: "Sensor suara", quantity: 18, category: "Sensor", description: "Sensor mikrofon suara untuk mendeteksi intensitas suara.", searchQuery: "sound sensor module microphone" },
  { name: "Arduino", quantity: 21, category: "Microcontroller", description: "Arduino Uno R3 development board microcontroller.", searchQuery: "Arduino Uno R3 board" },
  { name: "Esp", quantity: 42, category: "Microcontroller", description: "ESP32 NodeMCU development board dengan WiFi dan Bluetooth.", searchQuery: "ESP32 NodeMCU board" },
  { name: "Buzzer", quantity: 18, category: "Output", description: "Piezo buzzer pasif/aktif tanpa board tambahan.", searchQuery: "piezo buzzer component 5v" },
  
  // New items added by the user
  { name: "Laser modul", quantity: 5, category: "Module", description: "Modul transmitter dioda laser 5V.", searchQuery: "laser transmitter module arduino" },
  { name: "Pir sensor", quantity: 1, category: "Sensor", description: "PIR motion sensor HC-SR501 untuk mendeteksi gerakan.", searchQuery: "PIR motion sensor HC-SR501" },
  { name: "Step down tanpa layar", quantity: 5, category: "Power", description: "Modul step-down DC-to-DC buck converter tanpa display voltase.", searchQuery: "LM2596 step down converter without display" },
  { name: "capasitor", quantity: 5, category: "Component", description: "Kapasitor elektronik (elektrolit / keramik).", searchQuery: "electrolytic capacitor electronic component" },
  { name: "Breadboard small", quantity: 21, category: "Accessory", description: "Breadboard kecil (400 titik sambung) untuk prototyping sirkuit.", searchQuery: "half size breadboard 400 points" },
  { name: "Breadboard large", quantity: 10, category: "Accessory", description: "Breadboard besar (830 titik sambung) dengan jalur distribusi daya.", searchQuery: "full size breadboard 830 points" },
  { name: "Modul lotsel", quantity: 2, category: "Sensor", description: "Modul Load Cell HX711 untuk timbangan digital.", searchQuery: "HX711 load cell sensor module" },
  { name: "Sambungan sensor hujan", quantity: 2, category: "Accessory", description: "Kabel sambungan atau board adaptor sensor hujan.", searchQuery: "rain sensor adapter board wire" },
  { name: "sensor hujan", quantity: 1, category: "Sensor", description: "Sensor pendeteksi tetesan air hujan.", searchQuery: "rain sensor module arduino" }
];

async function scrapeImageUrlFromBing(query: string): Promise<string | null> {
  let attempt = 0;
  while (attempt < 3) {
    try {
      const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
      });

      if (!res.ok) {
        attempt++;
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }

      const html = await res.text();
      const bingUrlPattern = /https?(?:%3a%2f%2f|:\/\/)(?:th\.bing\.com)(?:%2f|\/)th(?:%2f|\/)id(?:%2f|\/)[a-zA-Z0-9_\-\.%?=&]+/gi;
      const matches = html.match(bingUrlPattern);
      
      if (matches && matches.length > 0) {
        return decodeURIComponent(matches[0]);
      }
      return null;
    } catch (error: any) {
      attempt++;
      console.warn(`      ⚠️ (Attempt ${attempt}/3) Error scraping Bing image for "${query}":`, error.message);
      if (attempt < 3) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

async function fetchWithRetry(url: string, options?: RequestInit, retries = 3, delay = 2000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (err: any) {
      console.warn(`      ⚠️ Network fetch attempt ${i + 1} failed for ${url}:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

async function repair() {
  console.log("🛠️ Starting Seeding Expansion / Recovery...");
  
  const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setKey(config.apiKey!);

  const databases = new Databases(client);
  const storage = new Storage(client);

  // 1. Get list of existing items in DB (handling pagination to list up to 100 documents)
  console.log("🔍 Fetching existing items from database...");
  
  // Custom document fetching to get more than the default 25 limit
  let allExistingDocs: any[] = [];
  try {
    const list = await databases.listDocuments(config.databaseId, config.collections.items);
    allExistingDocs = list.documents;
    
    // If there might be more documents, fetch them by using offset
    if (list.total > allExistingDocs.length) {
      const remainingList = await databases.listDocuments(
        config.databaseId, 
        config.collections.items, 
        undefined, 
        allExistingDocs.length
      );
      allExistingDocs = allExistingDocs.concat(remainingList.documents);
    }
  } catch (error: any) {
    console.error("❌ Failed to list existing documents:", error.message);
    process.exit(1);
  }

  const existingNames = new Set(allExistingDocs.map((doc: any) => doc.name));
  console.log(`ℹ️ Currently found ${existingNames.size} items in database.`);

  const missingItems = itemsToSeed.filter(item => !existingNames.has(item.name));
  if (missingItems.length === 0) {
    console.log("✨ All items (including the new ones) are already present in the database!");
    process.exit(0);
  }

  console.log(`🌱 Found ${missingItems.length} missing items. Proceeding to seed them...`);

  for (let i = 0; i < missingItems.length; i++) {
    const item = missingItems[i];
    console.log(`\n[${i + 1}/${missingItems.length}] Seeding new item: "${item.name}"`);
    let uploadedImageId = "";

    // A. Scrape and Upload Image (with retry wrapper)
    const imageUrl = await scrapeImageUrlFromBing(item.searchQuery);
    if (imageUrl) {
      try {
        console.log(`   🔍 Found image on Bing. Downloading...`);
        const imgRes = await fetchWithRetry(imageUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        
        const fileName = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.jpg`;
        const inputFile = InputFile.fromBuffer(buffer, fileName);
        
        console.log(`   📤 Uploading image to Appwrite...`);
        
        let fileUploadSuccess = false;
        let fileUploadAttempt = 0;
        while (!fileUploadSuccess && fileUploadAttempt < 3) {
          try {
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
            fileUploadSuccess = true;
            console.log(`   ✅ Image uploaded. File ID: ${uploadedImageId}`);
          } catch (uploadError: any) {
            fileUploadAttempt++;
            console.warn(`   ⚠️ (Attempt ${fileUploadAttempt}/3) Failed to upload file to Appwrite storage:`, uploadError.message);
            if (fileUploadAttempt < 3) await new Promise(r => setTimeout(r, 2000));
          }
        }
      } catch (err: any) {
        console.error(`   ⚠️ Failed to get/upload image for "${item.name}":`, err.message);
      }
    } else {
      console.warn(`   ⚠️ No image found on Bing for query "${item.searchQuery}"`);
    }

    // B. Create Document in Database (with retry wrapper)
    let dbSuccess = false;
    let dbAttempt = 0;
    while (!dbSuccess && dbAttempt < 3) {
      try {
        const itemData = {
          name: item.name,
          description: item.description,
          category: item.category,
          quantity_total: item.quantity,
          quantity_available: item.quantity,
          is_available: item.quantity > 0,
          image_id: uploadedImageId || undefined,
          created_at: new Date().toISOString()
        };

        console.log(`   💾 Saving document to database (Attempt ${dbAttempt + 1})...`);
        const documentResult = await databases.createDocument(
          config.databaseId,
          config.collections.items,
          ID.unique(),
          itemData
        );

        dbSuccess = true;
        console.log(`   ✅ Successfully seeded "${item.name}". Document ID: ${documentResult.$id}`);
      } catch (dbError: any) {
        dbAttempt++;
        console.error(`   ❌ Failed to insert document for "${item.name}":`, dbError.message);
        if (dbAttempt < 3) {
          console.log("   🔄 Retrying database write in 2 seconds...");
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }
    
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log("\n✨ Seeding expansion completed successfully!");
}

repair().catch(err => {
  console.error("❌ Seeding expansion failed with error:", err);
});
