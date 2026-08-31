import { NextResponse } from "next/server";
import { getAllLoans } from "@/lib/appwrite/queries";

export async function GET() {
  try {
    const loans = await getAllLoans();
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pinjaman" }, { status: 500 });
  }
}
