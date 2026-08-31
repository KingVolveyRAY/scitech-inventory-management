"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Boxes, ClipboardList, FileText, LayoutDashboard, LogOut, Menu, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useUiStore } from "@/stores/ui-store";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils/cn";
import { logoutUser } from "@/lib/actions/users";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/loans", label: "Loans", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/history", label: "History", icon: FileText },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 }
];

function SidebarContent({ profile, onClose }: { profile: Profile; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-10">
        <div className="flex items-center justify-between px-2">
          <AppLogo />
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full lg:hidden">
              <X className="h-5 w-5 text-slate-500" />
            </Button>
          )}
        </div>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                  isActive 
                    ? "text-brand-primary bg-indigo-50 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 h-6 w-1 rounded-r-full bg-brand-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          <div className="my-6 h-px bg-slate-100 mx-4" />
          
          <button
            onClick={() => void logoutUser()}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-red-500/80 transition-all hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50/50 p-4 backdrop-blur-sm">
        <UserAvatar name={profile.full_name} className="h-10 w-10 ring-2 ring-white shadow-sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{profile.full_name}</p>
          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {profile.department || "Administrator"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ profile }: { profile: Profile }) {
  const { adminSidebarOpen, setAdminSidebarOpen } = useUiStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 border-r border-slate-100 bg-white/70 backdrop-blur-xl p-6 lg:block">
        <SidebarContent profile={profile} />
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl p-4 lg:hidden">
        <AppLogo />
        <Button variant="ghost" size="sm" onClick={() => setAdminSidebarOpen(true)} className="rounded-full h-10 w-10 p-0 hover:bg-indigo-50">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {adminSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setAdminSidebarOpen(false)} 
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative h-full w-[280px] bg-white p-6 shadow-2xl"
            >
              <SidebarContent profile={profile} onClose={() => setAdminSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
