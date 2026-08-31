import { NextResponse } from "next/server";
import { resetPasswordWithOtp } from "@/lib/actions/otp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await resetPasswordWithOtp(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
