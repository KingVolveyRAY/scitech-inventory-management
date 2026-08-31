"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardChartPoint } from "@/types";

const COLORS = ["#f59e0b", "#4f46e5", "#ef4444", "#16a34a", "#f97316"];

export function StatusPieChart({ data }: { data: DashboardChartPoint[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Distribusi status</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={70} outerRadius={105}>
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
