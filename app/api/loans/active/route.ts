import { NextResponse } from "next/server";
import { getActiveLoans } from "@/lib/appwrite/queries";

export async function GET() {
  try {
    const loans = await getActiveLoans();
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data aktivitas" }, { status: 500 });
  }
}
