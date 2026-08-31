"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/actions/users";
import { sendBrevoOtp, verifyBrevoOtp } from "@/lib/actions/otp";
import { registerSchema } from "@/lib/validators/auth";
import type { z } from "zod";
import { saveAccount } from "@/lib/utils/accounts";
import { Eye, EyeOff } from "lucide-react";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { notify } = useToast();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingValues, setPendingValues] = useState<RegisterValues | null>(null);
  const [otpCode, setOtpCode] = useState("");
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

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      department: ""
    }
  });

  // Step 1: Submit form -> Send OTP via Brevo
  const onFormSubmit = (values: RegisterValues) => {
    startTransition(async () => {
      const otpResult = await sendBrevoOtp({
        email: values.email,
        fullName: values.full_name,
        purpose: "register"
      });

      if (!otpResult.success) {
        notify("Gagal Mengirim OTP", otpResult.error || "Gagal mengirimkan kode verifikasi.");
        return;
      }

      setPendingValues(values);
      setStep("otp");
      startCountdown();
      notify("Kode OTP Terkirim", `Kode verifikasi telah dikirimkan ke email ${values.email}.`);
    });
  };

  // Step 2: Verify OTP -> Complete Registration
  const onVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingValues) return;
    if (otpCode.length !== 6) {
      notify("Kode OTP Tidak Lengkap", "Masukkan 6 digit kode OTP dari email Anda.");
      return;
    }

    startTransition(async () => {
      const verifyResult = await verifyBrevoOtp({
        email: pendingValues.email,
        otp: otpCode,
        purpose: "register"
      });

      if (!verifyResult.success) {
        notify("Verifikasi Gagal", verifyResult.error);
        return;
      }

      const regResult = await registerUser(pendingValues);
      if (!regResult.success) {
        notify("Registrasi Gagal", regResult.error);
        return;
      }

      if (regResult.data) {
        saveAccount(regResult.data);
      }

      notify("Registrasi Berhasil", "Akun Anda berhasil diverifikasi dan siap digunakan.");
      router.push("/catalog");
      router.refresh();
    });
  };

  const handleResendOtp = () => {
    if (!canResend || !pendingValues) return;
    startTransition(async () => {
      const result = await sendBrevoOtp({
        email: pendingValues.email,
        fullName: pendingValues.full_name,
        purpose: "register"
      });

      if (!result.success) {
        notify("Gagal Mengirim Ulang", result.error);
        return;
      }

      notify("OTP Dikirim Ulang", `Kode baru telah dikirimkan ke ${pendingValues.email}.`);
      startCountdown();
    });
  };

  if (step === "otp" && pendingValues) {
    return (
      <div className="w-full space-y-4 text-left">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          Kode verifikasi telah dikirim ke <span className="font-semibold text-slate-900">{pendingValues.email}</span>.
        </div>

        <form onSubmit={onVerifyOtpSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Kode OTP (6 Digit)
            </label>
            <Input 
              type="text"
              maxLength={6}
              placeholder="123456" 
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
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
              className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Kirim Ulang OTP
            </button>
          </div>

          <Button 
            type="submit" 
            disabled={isPending || otpCode.length !== 6}
            className="w-full"
          >
            {isPending ? "Memverifikasi..." : "Verifikasi & Masuk"}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ← Kembali ke form pendaftaran
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)} className="w-full space-y-3.5 text-left">
      {/* Nama Lengkap */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Nama Lengkap
        </label>
        <Input 
          placeholder="Nama lengkap" 
          {...form.register("full_name")} 
        />
        {form.formState.errors.full_name ? (
          <p className="text-xs text-rose-500">{form.formState.errors.full_name.message}</p>
        ) : null}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Alamat Email
        </label>
        <Input 
          type="email"
          placeholder="nama@email.com" 
          {...form.register("email")} 
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-rose-500">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      {/* Divisi / Departemen */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Divisi / Unit Kerja
        </label>
        <Input 
          placeholder="Contoh: R&D, Lab Hardware, Operasional" 
          {...form.register("department")} 
        />
        {form.formState.errors.department ? (
          <p className="text-xs text-rose-500">{form.formState.errors.department.message}</p>
        ) : null}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Kata Sandi
        </label>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Minimal 8 karakter" 
            {...form.register("password")} 
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.password ? (
          <p className="text-xs text-rose-500">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Mengirim Kode OTP..." : "Daftar & Kirim OTP"}
        </Button>
      </div>

      {/* Link to login */}
      <div className="pt-3 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Masuk ke sistem
          </Link>
        </p>
      </div>
    </form>
  );
}
