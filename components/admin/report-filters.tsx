"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ReportFilters({ onChange }: { onChange: (range: { from: string; to: string }) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-subtle md:grid-cols-2">
      <Input
        type="date"
        value={from}
        onChange={(event) => {
          setFrom(event.target.value);
          onChange({ from: event.target.value, to });
        }}
      />
      <Input
        type="date"
        value={to}
        onChange={(event) => {
          setTo(event.target.value);
          onChange({ from, to: event.target.value });
        }}
      />
    </div>
  );
}
