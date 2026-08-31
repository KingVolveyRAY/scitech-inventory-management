"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { Profile } from "@/types";

export function useAdminUsersQuery(initialData: Profile[]) {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async () => initialData,
    initialData
  });
}
