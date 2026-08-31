"use client";

import { useState, useTransition } from "react";
import { AppLogo } from "@/components/ui/app-logo";
import { AuthCarousel } from "@/components/ui/auth-carousel";
import { PageTransition } from "@/components/ui/page-transition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { sendBrevoOtp, verifyBrevoOtp, resetPasswordWithOtp } from "@/lib/actions/otp";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "request" | "verify" | "reset" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const startCountdown = () => {
    setCanResend(false);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      notify("Email tidak valid", "Mohon masukkan alamat email yang benar.");
      return;
    }

    startTransition(async () => {
      const result = await sendBrevoOtp({
        email,
        purpose: "forgot_password"
      });

      if (!result.success) {
        notify("Gagal mengirim OTP", result.error);
        return;
      }

      notify("Kode OTP Terkirim", `Kode verifikasi telah dikirimkan ke email ${email}.`);
      setStep("verify");
      startCountdown();
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      notify("OTP tidak lengkap", "Masukkan 6 digit kode OTP yang diterima di email.");
      return;
    }

    startTransition(async () => {
      const result = await verifyBrevoOtp({
        email,
        otp,
        purpose: "forgot_password"
      });

      if (!result.success) {
        notify("Verifikasi Gagal", result.error);
        return;
      }

      notify("OTP Terverifikasi", "Silakan masukkan kata sandi baru.");
      setStep("reset");
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      notify("Password terlalu pendek", "Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("Password tidak cocok", "Konfirmasi password baru tidak sesuai.");
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordWithOtp({
        email,
        otp,
        newPassword,
        confirmPassword
      });

      if (!result.success) {
        notify("Gagal Mengubah Password", result.error);
        return;
      }

      notify("Password Diperbarui", "Kata sandi akun berhasil diubah.");
      setStep("success");
    });
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    startTransition(async () => {
      const result = await sendBrevoOtp({
        email,
        purpose: "forgot_password"
      });

      if (!result.success) {
        notify("Gagal Mengirim Ulang", result.error);
        return;
      }

      notify("OTP Dikirim Ulang", `Kode baru telah dikirimkan ke ${email}.`);
      startCountdown();
    });
  };

  return (
    <PageTransition>
      <div className="w-full overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-200/60">
        <div className="grid lg:grid-cols-2">
          {/* Left Column: Form */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Branding */}
              <div>
                <AppLogo onlyIcon={false} iconSize="h-8 w-8" />
              </div>

              {/* Title Header with Typewriter Animation */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 min-h-[36px] sm:min-h-[40px] flex items-center">
                  <Typewriter text="Reset Kata Sandi." />
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                  {step === "request" && "Masukkan email terdaftar untuk menerima kode verifikasi OTP"}
                  {step === "verify" && `Masukkan kode 6 digit yang dikirim ke ${email}`}
                  {step === "reset" && "Buat kata sandi baru untuk akun Anda"}
                  {step === "success" && "Kata sandi berhasil diperbarui"}
                </p>
              </div>

              {/* Step 1: Input Email */}
              {step === "request" && (
                <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Alamat Email Terdaftar
                    </label>
                    <Input 
                      type="email"
                      placeholder="nama@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending ? "Mengirim OTP..." : "Kirim Kode OTP"}
                  </Button>

                  <div className="pt-2 text-center">
                    <Link href="/login" className="text-xs text-slate-500 hover:text-slate-700">
                      ← Kembali ke login
                    </Link>
                  </div>
                </form>
              )}

              {/* Step 2: Input OTP */}
              {step === "verify" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Kode Verifikasi (6 Digit)
                    </label>
                    <Input 
                      type="text"
                      maxLength={6}
                      placeholder="123456" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      required
                      autoFocus
                      className="text-center font-mono text-xl font-bold tracking-[6px]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {timer > 0 ? `Kirim ulang dalam ${timer}s` : "Tidak menerima kode?"}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || isPending}
                      className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
                    >
                      Kirim Ulang OTP
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isPending || otp.length !== 6}
                    className="w-full"
                  >
                    {isPending ? "Memvalidasi..." : "Verifikasi OTP"}
                  </Button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setStep("request")}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      ← Ganti alamat email
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Input Password Baru */}
              {step === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Ketik ulang kata sandi baru" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending ? "Menyimpan..." : "Simpan Password Baru"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Kata sandi berhasil diperbarui</p>
                    <p className="text-xs text-slate-500 mt-1">Silakan gunakan kata sandi baru Anda untuk masuk.</p>
                  </div>
                  <Button 
                    onClick={() => router.push("/login")}
                    className="w-full"
                  >
                    Masuk ke Akun
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom Note */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Sistem Peminjaman & Inventori Internal Scitech
              </p>
            </div>
          </div>

          {/* Right Column: Material Design 3 Onboarding Carousel */}
          <AuthCarousel />
        </div>
      </div>
    </PageTransition>
  );
}
