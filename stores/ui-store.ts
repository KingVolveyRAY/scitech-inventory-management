"use client";

import { create } from "zustand";

type UiStore = {
  adminSidebarCollapsed: boolean;
  adminSidebarOpen: boolean;
  setAdminSidebarCollapsed: (collapsed: boolean) => void;
  setAdminSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  adminSidebarCollapsed: false,
  adminSidebarOpen: false,
  setAdminSidebarCollapsed: (adminSidebarCollapsed) => set({ adminSidebarCollapsed }),
  setAdminSidebarOpen: (adminSidebarOpen) => set({ adminSidebarOpen })
}));
