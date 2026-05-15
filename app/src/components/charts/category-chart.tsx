"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ExpenseCategory } from "@/lib/types";

const colors = ["#1F3864", "#2F5597", "#5B7BC4", "#8FA8DC", "#C5D2EC", "#E8EDF7"];

export function CategoryChart({ data }: { data: ExpenseCategory[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="label"
          cx="50%"
          cy="45%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => `₪${Number(v).toLocaleString("he-IL")}`}
          contentStyle={{ direction: "rtl", textAlign: "right", fontSize: "12px" }}
        />
        <Legend
          wrapperStyle={{ direction: "rtl", fontSize: "11px" }}
          iconSize={8}
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
