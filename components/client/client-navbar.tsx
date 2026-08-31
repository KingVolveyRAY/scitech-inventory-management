"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, Briefcase } from "lucide-react";
import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { logoutUser } from "@/lib/actions/users";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/catalog", label: "Catalog", icon: Home },
  { href: "/my-loans", label: "My Loans", icon: Briefcase }
];

export function ClientNavbar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none",
        isScrolled ? "pt-3 px-4" : "pt-0"
      )}
    >
      <div 
        className={cn(
          "mx-auto flex items-center pointer-events-auto transition-all duration-300 ease-out",
          isScrolled 
            ? "w-fit justify-center gap-3 sm:gap-5 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-lg shadow-slate-900/8 px-3 py-1.5" 
            : "w-full justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3"
        )}
      >
        {/* Left Section: Logo (Only in full top-bar mode) & Nav Links */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          {!isScrolled && (
            <Link href="/catalog" className="shrink-0 transition-opacity hover:opacity-90">
              <AppLogo className="hidden md:flex" iconSize="h-7 w-7" />
              <AppLogo onlyIcon className="md:hidden" iconSize="h-7 w-7" />
            </Link>
          )}
          
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-2",
                    isScrolled 
                      ? "p-2 rounded-full" 
                      : "px-3 py-1.5 rounded-xl text-sm font-semibold",
                    isActive 
                      ? "text-indigo-600 bg-indigo-50 shadow-xs ring-1 ring-indigo-100" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!isScrolled && (
                    <span className="hidden sm:inline text-xs font-semibold">
                      {link.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider in Pill Mode */}
        {isScrolled && <div className="h-4 w-px bg-slate-200 shrink-0" />}

        {/* Right Section: Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isScrolled && (
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[140px]">
                {profile.full_name}
              </p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {profile.department || "Client"}
              </p>
            </div>
          )}
          
          <UserAvatar 
            name={profile.full_name} 
            className={cn(
              "ring-2 ring-slate-100 shadow-xs shrink-0 transition-all",
              isScrolled ? "h-7 w-7 text-xs" : "h-8 w-8 text-xs"
            )}
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => void logoutUser()}
            title="Keluar"
            className={cn(
              "text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors p-0 shrink-0",
              isScrolled ? "h-7 w-7 rounded-full" : "h-8 w-8 rounded-xl"
            )}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
