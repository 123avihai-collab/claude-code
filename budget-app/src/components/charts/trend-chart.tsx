"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatMoney, formatMonth } from "@/lib/format";

export interface TrendPoint {
  month: string;
  income: number;
  expense: number;
}

/** הכנסה מול הוצאה לאורך חודשים. */
export function TrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = data.map((d) => ({
    label: formatMonth(d.month),
    הכנסה: d.income,
    הוצאה: d.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} reversed />
        <YAxis
          tickFormatter={(v) => formatMoney(Number(v))}
          width={80}
          tick={{ fontSize: 11 }}
          orientation="right"
        />
        <Tooltip formatter={(v) => formatMoney(Number(v))} />
        <Legend />
        <Bar dataKey="הכנסה" fill="#16a34a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="הוצאה" fill="#dc2626" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
