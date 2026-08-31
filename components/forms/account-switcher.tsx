"use client";

import { SavedAccount, getSavedAccounts, removeSavedAccount } from "@/lib/utils/accounts";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { X, UserPlus, ChevronRight } from "lucide-react";
import { ListStagger, ListStaggerItem } from "@/components/ui/list-stagger";
import { motion, AnimatePresence } from "framer-motion";

type AccountSwitcherProps = {
  onSelectAccount: (email: string) => void;
  onUseAnother: () => void;
};

export function AccountSwitcher({ onSelectAccount, onUseAnother }: AccountSwitcherProps) {
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);

  useEffect(() => {
    setAccounts(getSavedAccounts());
  }, []);

  const handleRemove = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    removeSavedAccount(email);
    setAccounts(getSavedAccounts());
  };

  if (accounts.length === 0) return null;

  return (
    <ListStagger className="space-y-4">
      <AnimatePresence mode="popLayout">
        {accounts.map((account) => (
          <ListStaggerItem key={account.email}>
            <button
              onClick={() => onSelectAccount(account.email)}
              className="group relative flex w-full items-center gap-3 sm:gap-4 rounded-3xl border border-slate-100 bg-white p-3 sm:p-4 text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-md active:scale-[0.99]"
            >
              <div className="relative shrink-0">
                <UserAvatar 
                  name={account.name} 
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl ring-4 ring-slate-50 transition-all group-hover:ring-white" 
                />
              </div>
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="truncate text-[13px] sm:text-[14px] font-black text-slate-900">
                  {account.name}
                </p>
                <p className="truncate text-[11px] sm:text-[12px] font-bold text-slate-400">
                  {account.email}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <div 
                  onClick={(e) => handleRemove(e, account.email)}
                  className="rounded-xl p-2 text-slate-300 opacity-0 transition-all hover:bg-white hover:text-red-500 hover:shadow-sm group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-brand-primary group-hover:text-white">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </button>
          </ListStaggerItem>
        ))}
      </AnimatePresence>

      <ListStaggerItem className="pt-2">
        <button
          onClick={onUseAnother}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-100 py-4 text-[14px] font-black text-slate-500 transition-all hover:border-brand-border hover:bg-brand-surface-alt/40 hover:text-brand-primary active:scale-[0.99]"
        >
          <UserPlus className="h-5 w-5" />
          Gunakan akun lain
        </button>
      </ListStaggerItem>
    </ListStagger>
  );
}
