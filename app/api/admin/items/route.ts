import { NextResponse } from "next/server";
import { getCatalogItems } from "@/lib/appwrite/queries";

export async function GET() {
  try {
    const items = await getCatalogItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
