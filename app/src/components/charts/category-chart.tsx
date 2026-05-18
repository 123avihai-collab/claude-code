"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ExpenseCategory } from "@/lib/types";

// צבעים שונים ובולטים לכל קטגוריה — לזיהוי מהיר
const colors = [
  "#2563EB",  // כחול - חומרים
  "#EA580C",  // כתום - קבלני משנה
  "#9333EA",  // סגול - שכר
  "#F59E0B",  // ענבר - רכב
  "#64748B",  // אפור - אחר
  "#EF4444",  // אדום - חירום/חריגים
  "#10B981",  // ירוק - הכנסות/החזרים
];

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
