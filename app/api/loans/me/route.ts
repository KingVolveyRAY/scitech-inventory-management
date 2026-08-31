import { NextResponse } from "next/server";
import { getMyLoans } from "@/lib/appwrite/queries";
import { getLoggedInUser } from "@/lib/appwrite/session";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loans = await getMyLoans(user.profile.userId);
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pinjaman" }, { status: 500 });
  }
}
