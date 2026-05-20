"use client";

import type { CumulativeSubcontractor, ExpenseCategoryNode } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { applyOverrides, useExpenseOverrides } from "@/lib/expense-overrides-store";

export function ExpenseCategorySummary({
  projectId,
  categoryTree,
  cumulativeSubs,
}: {
  projectId: string;
  categoryTree: ExpenseCategoryNode[];
  cumulativeSubs: CumulativeSubcontractor[];
}) {
  const { overrides, mounted } = useExpenseOverrides(projectId);
  const tree = mounted ? applyOverrides(categoryTree, overrides) : categoryTree;
  const amount = (id: string) => tree.find((c) => c.id === id)?.amount ?? 0;
  const cumulativePaid = cumulativeSubs.reduce((s, x) => s + x.paidByUs, 0);

  const materials = amount("materials");
  const contractors = amount("subs-other") + cumulativePaid;
  const overheads = amount("overheads");
  const total = materials + contractors + overheads;
  const pct = (v: number) => (total > 0 ? `${Math.round((v / total) * 100)}% מההוצאות` : "—");

  const cells = [
    { label: "חומרים", value: materials, color: "text-blue-700" },
    { label: "קבלני משנה", value: contractors, color: "text-orange-700" },
    { label: "תקורות", value: overheads, color: "text-purple-700" },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="grid grid-cols-3 gap-1">
        {cells.map((cell, idx) => (
          <div
            key={cell.label}
            className={`px-2 sm:px-3 py-1 ${idx < cells.length - 1 ? "border-l border-slate-200" : ""}`}
          >
            <p className="text-[11px] sm:text-xs text-slate-500 whitespace-nowrap">{cell.label}</p>
            <p className={`text-sm sm:text-base font-bold ${cell.color} mt-0.5 whitespace-nowrap`}>
              {formatCurrency(cell.value, true)}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{pct(cell.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
