"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardChartPoint } from "@/types";

export function LoanBarChart({ data }: { data: DashboardChartPoint[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Peminjaman per bulan</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
