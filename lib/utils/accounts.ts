import { Profile } from "@/types";

const SAVED_ACCOUNTS_KEY = "sims_saved_accounts";

export type SavedAccount = {
  email: string;
  name: string;
  avatar_url?: string;
  lastLogin: string;
};

export function getSavedAccounts(): SavedAccount[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(SAVED_ACCOUNTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveAccount(profile: Profile) {
  if (typeof window === "undefined") return;
  const accounts = getSavedAccounts();
  const existingIndex = accounts.findIndex((a) => a.email === profile.email);

  const updatedAccount: SavedAccount = {
    email: profile.email,
    name: profile.full_name,
    avatar_url: profile.avatar_url,
    lastLogin: new Date().toISOString()
  };

  if (existingIndex > -1) {
    accounts[existingIndex] = updatedAccount;
  } else {
    accounts.unshift(updatedAccount);
  }

  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts.slice(0, 5))); // Keep last 5
}

export function removeSavedAccount(email: string) {
  if (typeof window === "undefined") return;
  const accounts = getSavedAccounts();
  const filtered = accounts.filter((a) => a.email !== email);
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(filtered));
}
