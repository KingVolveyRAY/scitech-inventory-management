"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statuses = ["all", "pending", "approved", "rejected", "returned", "overdue"];

export function LoanStatusTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "all";

  return (
    <Tabs value={current} onValueChange={(value) => router.push(value === "all" ? "/admin/loans" : `/admin/loans?status=${value}`)}>
      <TabsList>
        {statuses.map((status) => (
          <TabsTrigger key={status} value={status}>
            {status}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
