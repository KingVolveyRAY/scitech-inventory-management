"use server";

import { sendOtpSchema, verifyOtpSchema, resetPasswordSchema } from "@/lib/validators/auth";
import { appConfig, hasAppwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient, ID } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import type { ActionResult } from "@/types";

// In-Memory store for OTPs (with TTL 5 minutes)
// Key: `${purpose}:${email.toLowerCase()}`
type OtpRecord = {
  code: string;
  expiresAt: number;
  attempts: number;
};

const globalOtpStore = globalThis as unknown as {
  __sims_otp_store?: Map<string, OtpRecord>;
};

if (!globalOtpStore.__sims_otp_store) {
  globalOtpStore.__sims_otp_store = new Map<string, OtpRecord>();
}

const otpStore = globalOtpStore.__sims_otp_store;

/**
 * Generate 6-digit OTP and send via Brevo Transactional Email API
 */
export async function sendBrevoOtp(input: unknown): Promise<ActionResult<{ expiresAt: number; isSimulated?: boolean }>> {
  try {
    const values = sendOtpSchema.parse(input);
    const email = values.email.toLowerCase().trim();
    const storeKey = `${values.purpose}:${email}`;

    // Rate limiting: check existing recent OTP
    const existing = otpStore.get(storeKey);
    const now = Date.now();
    if (existing && existing.expiresAt - now > 4 * 60 * 1000) {
      // Less than 60 seconds since last OTP was sent (5 min - 4 min = 1 min)
      return {
        success: false,
        error: "Mohon tunggu 60 detik sebelum meminta kode OTP baru."
      };
    }

    // Generate 6 digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes TTL

    otpStore.set(storeKey, {
      code,
      expiresAt,
      attempts: 0
    });

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "aliffer334@gmail.com";
    const senderName = process.env.BREVO_SENDER_NAME || "SIMS Scitech";

    const purposeTitle = values.purpose === "register" ? "Pendaftaran Akun Baru" : "Pemulihan / Reset Password";

    if (brevoApiKey && brevoApiKey !== "mock-key") {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail
          },
          to: [
            {
              email: email,
              name: values.fullName || "Pengguna SIMS"
            }
          ],
          subject: `[SIMS] Kode Verifikasi ${purposeTitle}: ${code}`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
                .container { max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 36px 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .header { text-align: center; margin-bottom: 24px; }
                .brand { font-size: 20px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; }
                .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
                .title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 20px 0 8px 0; text-align: center; }
                .desc { font-size: 14px; color: #64748b; line-height: 1.5; text-align: center; margin-bottom: 24px; }
                .otp-card { background: #f1f5f9; border-radius: 16px; padding: 18px 24px; text-align: center; margin: 20px 0; border: 1px solid #e2e8f0; }
                .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: monospace; }
                .warning { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; line-height: 1.4; }
                .footer { text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #cbd5e1; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="brand">SIMS SCITECH</div>
                  <div class="sub">Sistem Inventori Manajemen Scitech</div>
                </div>
                <div class="title">${purposeTitle}</div>
                <div class="desc">Gunakan kode verifikasi berikut untuk melanjutkan proses di aplikasi SIMS:</div>
                <div class="otp-card">
                  <div class="otp-code">${code}</div>
                </div>
                <div class="warning">
                  ⚠️ Kode OTP ini berlaku selama <b>5 menit</b>.<br/>
                  Jangan berikan kode ini kepada siapapun termasuk pihak yang mengaku sebagai staf SIMS.
                </div>
                <div class="footer">
                  Email ini dikirim otomatis oleh sistem SIMS via Brevo Engine.
                </div>
              </div>
            </body>
            </html>
          `
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Brevo API Error:", errData);
        return {
          success: false,
          error: (errData as { message?: string }).message || "Gagal mengirim email OTP via Brevo."
        };
      }
    } else {
      // Local development without Brevo key
      console.log(`\n========================================`);
      console.log(`[SIMS Brevo OTP Simulated]`);
      console.log(`To: ${email} (${values.fullName || "User"})`);
      console.log(`Purpose: ${values.purpose}`);
      console.log(`OTP Code: >>> ${code} <<<`);
      console.log(`Expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
      console.log(`========================================\n`);
    }

    return {
      success: true,
      data: {
        expiresAt,
        isSimulated: !brevoApiKey || brevoApiKey === "mock-key"
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengirimkan kode OTP."
    };
  }
}

/**
 * Verify OTP without destroying it immediately (or mark as validated)
 */
export async function verifyBrevoOtp(input: unknown): Promise<ActionResult> {
  try {
    const values = verifyOtpSchema.parse(input);
    const email = values.email.toLowerCase().trim();
    const storeKey = `${values.purpose}:${email}`;

    const record = otpStore.get(storeKey);
    if (!record) {
      return { success: false, error: "Kode OTP belum diminta atau sudah kedaluwarsa." };
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(storeKey);
      return { success: false, error: "Kode OTP telah kedaluwarsa. Silakan minta kode baru." };
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      otpStore.delete(storeKey);
      return { success: false, error: "Terlalu banyak percobaan gagal. Silakan minta kode baru." };
    }

    if (record.code !== values.otp.trim()) {
      return { success: false, error: "Kode OTP tidak sesuai. Silakan periksa kembali email Anda." };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verifikasi OTP gagal."
    };
  }
}

/**
 * Reset password using validated OTP
 */
export async function resetPasswordWithOtp(input: unknown): Promise<ActionResult> {
  try {
    const values = resetPasswordSchema.parse(input);
    const email = values.email.toLowerCase().trim();
    const storeKey = `forgot_password:${email}`;

    const record = otpStore.get(storeKey);
    if (!record || record.code !== values.otp.trim() || Date.now() > record.expiresAt) {
      return { success: false, error: "Sesi verifikasi OTP tidak valid atau kedaluwarsa." };
    }

    if (hasAppwriteConfig()) {
      const { users, databases } = createAdminClient();
      // Find user by email in Appwrite
      const userList = await users.list([Query.equal("email", email)]);
      if (userList.users.length === 0) {
        return { success: false, error: "Akun dengan email tersebut tidak ditemukan." };
      }

      const targetUser = userList.users[0];
      await users.updatePassword(targetUser.$id, values.newPassword);
    }

    // Clear OTP after successful reset
    otpStore.delete(storeKey);

    return { success: true, data: { message: "Password berhasil diperbarui." } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mereset password."
    };
  }
}
