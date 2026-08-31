"use client";

import { useNotifications } from "@/hooks/use-notifications";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useNotifications();
  return <>{children}</>;
}
