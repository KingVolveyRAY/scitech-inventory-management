"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Item, Profile } from "@/types";

export function HistoryFilters({ items, profiles }: { items: Item[]; profiles: Profile[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/history?${params.toString()}`);
  };

  const reset = () => {
    router.push("/admin/history");
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
      <div className="grid gap-3 md:grid-cols-4">
        <Input 
          placeholder="Cari nama peminjam atau barang..." 
          defaultValue={searchParams.get("search") ?? ""} 
          onBlur={(event) => update("search", event.target.value)} 
          className="md:col-span-2"
        />
        
        <Select value={searchParams.get("status") || "all"} onValueChange={(v) => update("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="secondary" onClick={reset}>Reset Filter</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Select value={searchParams.get("itemId") || "all"} onValueChange={(v) => update("itemId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Barang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Barang</SelectItem>
            {items.map((item) => (
              <SelectItem key={item.$id} value={item.$id}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={searchParams.get("borrowerId") || "all"} onValueChange={(v) => update("borrowerId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Peminjam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Peminjam</SelectItem>
            {profiles.map((profile) => (
              <SelectItem key={profile.userId} value={profile.userId}>{profile.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input 
          type="date" 
          defaultValue={searchParams.get("from") ?? ""} 
          onChange={(event) => update("from", event.target.value)} 
        />
        <Input 
          type="date" 
          defaultValue={searchParams.get("to") ?? ""} 
          onChange={(event) => update("to", event.target.value)} 
        />
      </div>
    </div>
  );
}
