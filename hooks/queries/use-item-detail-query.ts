"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { Item } from "@/types";

export function useItemDetailQuery(itemId: string, initialData: Item | null) {
  return useQuery({
    queryKey: queryKeys.itemDetail(itemId),
    queryFn: async () => initialData,
    initialData
  });
}
