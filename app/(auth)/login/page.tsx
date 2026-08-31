"use client";

import { LoginForm } from "@/components/forms/login-form";
import { AppLogo } from "@/components/ui/app-logo";
import { AuthCarousel } from "@/components/ui/auth-carousel";
import { useState, useEffect } from "react";
import { getSavedAccounts } from "@/lib/utils/accounts";
import { PageTransition } from "@/components/ui/page-transition";
import { Typewriter } from "@/components/ui/typewriter";

export default function LoginPage() {
  const [isSwitcher, setIsSwitcher] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getSavedAccounts();
    if (saved.length > 0) {
      setIsSwitcher(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <PageTransition>
      <div className="w-full overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-200/60">
        <div className="grid lg:grid-cols-2">
          {/* Left Column: Clean Form */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Branding */}
              <div>
                <AppLogo onlyIcon={false} iconSize="h-8 w-8" />
              </div>

              {/* Title Header with Typewriter Animation */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 min-h-[36px] sm:min-h-[40px] flex items-center">
                  <Typewriter text={isSwitcher ? "Pilih Akun Tersimpan." : "Masuk ke Akun."} />
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                  {isSwitcher 
                    ? "Pilih profil untuk melanjutkan akses sistem" 
                    : "Silakan masukkan email dan kata sandi Anda"}
                </p>
              </div>

              {/* Form */}
              <LoginForm initialShowSwitcher={isSwitcher} onStateChange={setIsSwitcher} />
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
