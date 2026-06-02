"use client";

import { setBudget } from "@/app/actions/budgets";
import { Money } from "@/components/money";
import { t } from "@/lib/strings";
import type { Category } from "@/lib/db/types";

export interface BudgetRow {
  category: Category;
  budget: number;
  spent: number;
}

export function BudgetsClient({
  month,
  rows,
}: {
  month: string;
  rows: BudgetRow[];
}) {
  return (
    <div className="space-y-3">
      {rows.map(({ category, budget, spent }) => {
        const ratio = budget > 0 ? spent / budget : 0;
        const remaining = budget - spent;
        const barColor =
          ratio >= 1 ? "#dc2626" : ratio >= 0.8 ? "#f59e0b" : "#16a34a";

        return (
          <div
            key={category.id}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-medium">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: category.color ?? "#cbd5e1" }}
                />
                {category.name}
              </span>

              <form action={setBudget} className="flex items-center gap-2">
                <input type="hidden" name="category_id" value={category.id} />
                <input type="hidden" name="month" value={month} />
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={budget || ""}
                  placeholder="תקציב"
                  className="w-28 rounded-lg border border-border bg-background px-2 py-1 text-sm"
                />
                <button className="rounded-lg bg-primary px-3 py-1 text-sm text-white">
                  {t.common.save}
                </button>
              </form>
            </div>

            {budget > 0 && (
              <>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(ratio * 100, 100)}%`,
                      background: barColor,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-muted">
                  <span>
                    {t.common.spent}: <Money value={spent} />
                  </span>
                  <span>
                    {remaining >= 0 ? t.common.remaining : "חריגה"}:{" "}
                    <Money
                      value={Math.abs(remaining)}
                      type={remaining >= 0 ? "income" : "expense"}
                    />
                  </span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
