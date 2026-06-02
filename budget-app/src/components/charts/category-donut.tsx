"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatMoney } from "@/lib/format";

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

export function CategoryDonut({ data }: { data: DonutSlice[] }) {
  if (data.length === 0) {
    return <Empty />;
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => formatMoney(Number(v))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Empty() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-muted">
      אין הוצאות להצגה
    </div>
  );
}
