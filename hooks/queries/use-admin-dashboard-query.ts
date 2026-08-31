"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { DashboardData } from "@/types";

export function useAdminDashboardQuery(initialData: DashboardData) {
  return useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: async () => initialData,
    initialData
  });
}
