import { monthStart } from "@/lib/format";
import { getCategories, getBudgets, getCategorySpend } from "@/lib/db/queries";
import { MonthPicker } from "@/components/month-picker";
import { BudgetsClient, type BudgetRow } from "./_components/budgets-client";
import { t } from "@/lib/strings";

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? monthStart();

  const [categories, budgets, spend] = await Promise.all([
    getCategories(),
    getBudgets(month),
    getCategorySpend(month),
  ]);

  const budgetByCat = new Map(budgets.map((b) => [b.category_id, Number(b.amount)]));
  const spendByCat = new Map(spend.map((s) => [s.category_id, s.spent]));

  const rows: BudgetRow[] = categories
    .filter((c) => c.type === "expense" && !c.is_archived)
    .map((category) => ({
      category,
      budget: budgetByCat.get(category.id) ?? 0,
      spent: spendByCat.get(category.id) ?? 0,
    }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.nav.budgets}</h1>
        <MonthPicker month={month} />
      </header>

      <p className="text-sm text-muted">
        הגדר תקציב חודשי לכל קטגוריה. הזן 0 כדי לבטל תקציב.
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-muted">{t.common.empty}</p>
      ) : (
        <BudgetsClient month={month} rows={rows} />
      )}
    </div>
  );
}
