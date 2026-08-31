"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, CartesianGrid } from "recharts";
import type { DashboardChartPoint } from "@/types";

interface TopClientsChartProps {
  title: string;
  data: DashboardChartPoint[];
  color?: string;
  valueLabel?: string;
}

export function TopClientsChart({ 
  title, 
  data, 
  color = "#4f46e5",
  valueLabel = "Jumlah"
}: TopClientsChartProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-slate-900">{title}</h2>
      <div className="h-64">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fontWeight: 600, fill: "#64748b" }}
                interval={0}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fontWeight: 600, fill: "#64748b" }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xl">
                        <p className="text-xs font-bold text-slate-500 mb-1">{payload[0].payload.label}</p>
                        <p className="text-sm font-black text-slate-900">
                          {payload[0].value} <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider ml-1">{valueLabel}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                fill={color}
                radius={[6, 6, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200">
            <p className="text-sm font-medium text-slate-400">Belum ada data tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
