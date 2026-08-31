"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { Item } from "@/types";

export function useItemsQuery(initialData: Item[]) {
  return useQuery({
    queryKey: queryKeys.catalog,
    queryFn: async () => {
      const response = await fetch("/api/admin/items");
      if (!response.ok) throw new Error("Gagal mengambil data katalog");
      const items = await response.json();
      if (!Array.isArray(items)) throw new Error("Format data barang tidak valid");
      return items as Item[];
    },
    initialData,
    refetchOnWindowFocus: false,
  });
}
