"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { Item } from "@/types";

export function useAdminItemsQuery(initialData: Item[]) {
  return useQuery({
    queryKey: queryKeys.adminItems,
    queryFn: async () => {
      const response = await fetch("/api/admin/items");
      if (!response.ok) throw new Error("Network response was not ok");
      const items = await response.json();
      if (!Array.isArray(items)) throw new Error("Invalid items response");
      return items;
    },
    initialData,
    refetchOnWindowFocus: false,
  });
}
