"use client";

import { RegisterForm } from "@/components/forms/register-form";
import { AppLogo } from "@/components/ui/app-logo";
import { AuthCarousel } from "@/components/ui/auth-carousel";
import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { Typewriter } from "@/components/ui/typewriter";

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
                  <Typewriter text="Daftar Akun Baru." />
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                  Lengkapi data untuk mengakses peminjaman alat dan komponen lab
                </p>
              </div>

              {/* Form */}
              <RegisterForm />
            </div>

            {/* Bottom Note */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Kode OTP verifikasi akan dikirimkan otomatis ke alamat email Anda
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
