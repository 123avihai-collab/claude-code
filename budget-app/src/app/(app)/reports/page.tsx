import { monthStart } from "@/lib/format";
import {
  getCategories,
  getCategorySpend,
  getMonthlySeries,
  getMonthTotals,
} from "@/lib/db/queries";
import { MonthPicker } from "@/components/month-picker";
import { TrendChart } from "@/components/charts/trend-chart";
import { CategoryDonut } from "@/components/charts/category-donut";
import { Money } from "@/components/money";
import { t } from "@/lib/strings";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? monthStart();

  const [categories, spend, series, totals] = await Promise.all([
    getCategories(),
    getCategorySpend(month),
    getMonthlySeries(month, 12),
    getMonthTotals(month),
  ]);

  const catById = new Map(categories.map((c) => [c.id, c]));
  const breakdown = spend
    .map((s) => ({ cat: catById.get(s.category_id), spent: s.spent }))
    .filter((b) => b.cat)
    .sort((a, b) => b.spent - a.spent);

  const donut = breakdown.map((b) => ({
    name: b.cat!.name,
    value: b.spent,
    color: b.cat!.color ?? "#6b7280",
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.nav.reports}</h1>
        <MonthPicker month={month} />
      </header>

      <Card title="הכנסות מול הוצאות — 12 חודשים">
        <TrendChart data={series} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="התפלגות הוצאות לחודש הנבחר">
          <CategoryDonut data={donut} />
        </Card>

        <Card title="פירוט לפי קטגוריה">
          {breakdown.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">{t.common.empty}</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {breakdown.map((b) => {
                  const pct =
                    totals.expense > 0 ? (b.spent / totals.expense) * 100 : 0;
                  return (
                    <tr key={b.cat!.id} className="border-b border-border last:border-0">
                      <td className="py-2">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ background: b.cat!.color ?? "#cbd5e1" }}
                          />
                          {b.cat!.name}
                        </span>
                      </td>
                      <td className="py-2 text-muted">{Math.round(pct)}%</td>
                      <td className="py-2 text-end">
                        <Money value={b.spent} type="expense" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
