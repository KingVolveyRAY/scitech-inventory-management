"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { Loan } from "@/types";

export function useActiveLoansQuery(initialData: Loan[]) {
  return useQuery({
    queryKey: queryKeys.activeLoans,
    queryFn: async () => {
      if (typeof window === "undefined") return initialData;
      const response = await fetch("/api/loans/active");
      if (!response.ok) throw new Error("Gagal mengambil data");
      return response.json();
    },
    initialData,
    staleTime: 1000 * 60, // 1 menit
    refetchOnWindowFocus: false,
  });
}
