"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { loginUser } from "@/lib/actions/users";
import { loginSchema } from "@/lib/validators/auth";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { saveAccount, getSavedAccounts } from "@/lib/utils/accounts";
import { AccountSwitcher } from "./account-switcher";
import { Eye, EyeOff } from "lucide-react";

type LoginValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  initialShowSwitcher?: boolean;
  onStateChange?: (showSwitcher: boolean) => void;
};

export function LoginForm({ initialShowSwitcher = false, onStateChange }: LoginFormProps) {
  const router = useRouter();
  const { notify } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showSwitcher, setShowSwitcher] = useState(initialShowSwitcher);
  const [hasSavedAccounts, setHasSavedAccounts] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setShowSwitcher(initialShowSwitcher);
    const saved = getSavedAccounts();
    setHasSavedAccounts(saved.length > 0);
  }, [initialShowSwitcher, showSwitcher]);

  const toggleSwitcher = (val: boolean) => {
    setShowSwitcher(val);
    onStateChange?.(val);
  };

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: LoginValues) => {
    startTransition(async () => {
      const result = await loginUser(values);

      if (!result.success) {
        notify("Login Gagal", result.error || "Periksa kembali email dan kata sandi Anda.");
        return;
      }

      if (result.data) {
        saveAccount(result.data);
      }

      notify("Login Berhasil", "Selamat datang kembali di SIMS.");
      router.push(result.data?.role === "admin" ? "/admin/dashboard" : "/catalog");
      router.refresh();
    });
  };

  if (showSwitcher) {
    return (
      <AccountSwitcher 
        onSelectAccount={(email) => {
          form.setValue("email", email);
          toggleSwitcher(false);
          setTimeout(() => {
            const pwdInput = document.querySelector('input[type="password"]') as HTMLInputElement;
            pwdInput?.focus();
          }, 100);
        }}
        onUseAnother={() => toggleSwitcher(false)}
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5 text-left">
        <label className="text-xs font-semibold text-slate-700">
          Email
        </label>
        <Input 
          type="email"
          placeholder="nama@email.com" 
          {...form.register("email")} 
          autoComplete="username"
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-rose-500 pl-1">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      
      {/* Password Input */}
      <div className="space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            Kata Sandi
          </label>
          <Link 
            href="/forgot-password" 
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            {...form.register("password")} 
            autoComplete="current-password"
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
        {form.formState.errors.password ? (
          <p className="text-xs text-rose-500 pl-1">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5 pt-0.5">
        <Checkbox id="remember" className="h-4.5 w-4.5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600" />
        <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
          Ingat saya di perangkat ini
        </label>
      </div>
      
      {/* Submit Button */}
      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Memproses Masuk...
            </span>
          ) : (
            "Masuk"
          )}
        </Button>
      </div>

      {/* Bottom Option */}
      <div className="pt-3 border-t border-slate-100 text-center space-y-2">
        <p className="text-xs text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Daftar sekarang
          </Link>
        </p>
        
        {hasSavedAccounts && (
          <div>
            <button
              type="button"
              onClick={() => toggleSwitcher(true)}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              ← Beralih ke akun tersimpan
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
