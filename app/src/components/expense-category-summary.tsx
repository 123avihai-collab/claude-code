"use client";

import type { CumulativeSubcontractor, ExpenseCategoryNode } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { applyOverrides, useExpenseOverrides } from "@/lib/expense-overrides-store";

export function ExpenseCategorySummary({
  projectId,
  categoryTree,
  cumulativeSubs,
  revenue,
}: {
  projectId: string;
  categoryTree: ExpenseCategoryNode[];
  cumulativeSubs: CumulativeSubcontractor[];
  revenue: number;
}) {
  const { overrides, mounted } = useExpenseOverrides(projectId);
  const tree = mounted ? applyOverrides(categoryTree, overrides) : categoryTree;
  const amount = (id: string) => tree.find((c) => c.id === id)?.amount ?? 0;
  const cumulativePaid = cumulativeSubs.reduce((s, x) => s + x.paidByUs, 0);

  const cells = [
    { label: "חומרים", value: amount("materials"), color: "text-blue-700" },
    { label: "קבלני משנה", value: amount("subs-other") + cumulativePaid, color: "text-orange-700" },
    { label: "תקורות", value: amount("overheads"), color: "text-purple-700" },
    { label: "הכנסות מהחוזה", value: revenue, color: "text-green-700" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100">
      {cells.map((cell) => (
        <div key={cell.label} className="bg-slate-50 rounded-lg p-2.5 text-center">
          <p className="text-[11px] text-slate-500">{cell.label}</p>
          <p className={`text-sm sm:text-base font-bold mt-0.5 ${cell.color}`}>
            {formatCurrency(cell.value, true)}
          </p>
        </div>
      ))}
    </div>
  );
}
