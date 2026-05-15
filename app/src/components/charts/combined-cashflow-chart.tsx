"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyCashflowByProject, months, projects } from "@/lib/mock-data";

export function CombinedCashflowChart() {
  const data = months.map((m, idx) => {
    const row: Record<string, number | string> = { month: m };
    projects.forEach((p) => {
      row[p.name] = monthlyCashflowByProject[p.id]?.[idx] ?? 0;
    });
    return row;
  });

  const colorByAccent: Record<string, string> = {
    blue: "#1F3864",
    purple: "#7C3AED",
    emerald: "#10B981",
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" reversed style={{ fontSize: "12px" }} />
        <YAxis
          reversed
          orientation="right"
          style={{ fontSize: "12px" }}
          tickFormatter={(v) => `₪${(v as number) / 1000}K`}
        />
        <Tooltip
          formatter={(v) => `₪${Number(v).toLocaleString("he-IL")}`}
          contentStyle={{ direction: "rtl", textAlign: "right", fontSize: "12px" }}
        />
        <Legend wrapperStyle={{ direction: "rtl", fontSize: "12px" }} />
        {projects.map((p) => (
          <Bar
            key={p.id}
            dataKey={p.name}
            stackId="cashflow"
            fill={colorByAccent[p.accentColor]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
