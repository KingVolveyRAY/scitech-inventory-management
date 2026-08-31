import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter.")
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Nama lengkap minimal 2 karakter.").max(120),
  email: z.string().email("Format email tidak valid (contoh: user@gmail.com)."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  department: z.string().max(120).optional().or(z.literal(""))
});

export const sendOtpSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  fullName: z.string().optional(),
  purpose: z.enum(["register", "forgot_password"])
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  otp: z.string().length(6, "Kode OTP harus 6 digit angka."),
  purpose: z.enum(["register", "forgot_password"])
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  otp: z.string().length(6, "Kode OTP harus 6 digit angka."),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter."),
  confirmPassword: z.string().min(8, "Konfirmasi password tidak cocok.")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok.",
  path: ["confirmPassword"]
});

