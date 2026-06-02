"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatMoney } from "@/lib/format";

export interface SavingsPoint {
  label: string;
  cumulative: number;
}

/** גרף קו של החיסכון המצטבר לאורך זמן. */
export function SavingsLine({ data }: { data: SavingsPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} reversed interval="preserveStartEnd" />
        <YAxis
          tickFormatter={(v) => formatMoney(Number(v))}
          width={90}
          tick={{ fontSize: 11 }}
          orientation="right"
        />
        <Tooltip formatter={(v) => formatMoney(Number(v))} />
        <ReferenceLine y={0} stroke="#94a3b8" />
        <Line
          type="monotone"
          dataKey="cumulative"
          name="חיסכון מצטבר"
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
