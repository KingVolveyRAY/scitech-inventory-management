"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardChartPoint } from "@/types";

export function ReturnsAreaChart({ data }: { data: DashboardChartPoint[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Tren pengembalian</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#c7d2fe" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
