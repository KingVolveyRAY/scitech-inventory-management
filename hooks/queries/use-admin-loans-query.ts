"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { Loan } from "@/types";

export function useAdminLoansQuery(initialData: Loan[], status?: string) {
  return useQuery({
    queryKey: [...queryKeys.adminLoans, status || "all"],
    queryFn: async () => {
      if (typeof window === "undefined") return initialData;
      const response = await fetch("/api/admin/loans");
      if (!response.ok) throw new Error("Network response was not ok");
      const loans: Loan[] = await response.json();
      
      if (!status || status === "all") return loans;
      return loans.filter((loan) => loan.status === status);
    },
    initialData,
    staleTime: 1000 * 60, // 1 menit
    refetchOnWindowFocus: false,
  });
}
