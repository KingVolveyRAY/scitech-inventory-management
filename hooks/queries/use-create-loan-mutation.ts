"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLoanRequest } from "@/lib/actions/loans";
import { queryKeys } from "@/hooks/queries/query-keys";

export function useCreateLoanMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoanRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.myLoans(userId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.catalog }),
        queryClient.invalidateQueries({ queryKey: queryKeys.activeLoans })
      ]);
    }
  });
}
