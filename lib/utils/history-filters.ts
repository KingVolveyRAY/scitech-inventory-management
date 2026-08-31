import type { HistoryFilters } from "@/types";

export function parseHistoryFilters(searchParams: Record<string, string | string[] | undefined>): HistoryFilters {
  const pick = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    status: pick("status") as HistoryFilters["status"],
    borrowerId: pick("borrowerId"),
    itemId: pick("itemId"),
    search: pick("search"),
    from: pick("from"),
    to: pick("to")
  };
}
