"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const months = [
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
];
const planned = [
  0, 180_000, 380_000, 620_000, 880_000, 1_100_000, 1_320_000, 1_520_000,
  1_700_000, 1_880_000, 2_050_000, 2_200_000,
];
const actual: (number | null)[] = [
  0, 165_000, 410_000, 645_000, 920_000, 1_135_000, 1_290_000, 1_387_200,
  null, null, null, null,
];

export function ProjectCashflowChart() {
  const data = months.map((month, i) => ({
    month,
    תכנון: planned[i],
    בפועל: actual[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" reversed style={{ fontSize: "11px" }} />
        <YAxis
          reversed
          orientation="right"
          style={{ fontSize: "11px" }}
          tickFormatter={(v) => `₪${(v as number) / 1000}K`}
        />
        <Tooltip
          formatter={(v) => (v == null ? "-" : `₪${Number(v).toLocaleString("he-IL")}`)}
          contentStyle={{ direction: "rtl", textAlign: "right", fontSize: "12px" }}
        />
        <Legend wrapperStyle={{ direction: "rtl", fontSize: "12px" }} />
        <Line
          type="monotone"
          dataKey="תכנון"
          stroke="#94a3b8"
          strokeDasharray="6 4"
          dot={false}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="בפועל"
          fill="#2F5597"
          fillOpacity={0.15}
          stroke="#2F5597"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
