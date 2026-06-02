import { monthStart } from "@/lib/format";
import {
  getMonthTotals,
  getCategorySpend,
  getCategories,
  getBudgets,
  getMonthlySeries,
} from "@/lib/db/queries";
import { Money } from "@/components/money";
import { MonthPicker } from "@/components/month-picker";
import { CategoryDonut } from "@/components/charts/category-donut";
import { TrendChart } from "@/components/charts/trend-chart";
import { t } from "@/lib/strings";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? monthStart();

  const [totals, spend, categories, budgets, series] = await Promise.all([
    getMonthTotals(month),
    getCategorySpend(month),
    getCategories(),
    getBudgets(month),
    getMonthlySeries(month, 6),
  ]);

  const catById = new Map(categories.map((c) => [c.id, c]));

  // התראות חריגה מתקציב
  const spendById = new Map(spend.map((s) => [s.category_id, s.spent]));
  const alerts = budgets
    .map((b) => {
      const spent = spendById.get(b.category_id) ?? 0;
      const ratio = b.amount > 0 ? spent / b.amount : 0;
      return { cat: catById.get(b.category_id), spent, budget: b.amount, ratio };
    })
    .filter((a) => a.cat && a.ratio >= 0.8)
    .sort((x, y) => y.ratio - x.ratio);

  const donut = spend
    .map((s) => {
      const c = catById.get(s.category_id);
      return c ? { name: c.name, value: s.spent, color: c.color ?? "#6b7280" } : null;
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.nav.dashboard}</h1>
        <MonthPicker month={month} />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label={t.common.income} value={totals.income} type="income" />
        <SummaryCard label={t.common.expense} value={totals.expense} type="expense" />
        <SummaryCard
          label={t.common.balance}
          value={totals.balance}
          type={totals.balance >= 0 ? "income" : "expense"}
        />
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 text-sm ${
                a.ratio >= 1
                  ? "border-expense/30 bg-expense/10 text-expense"
                  : "border-amber-300 bg-amber-50 text-amber-700"
              }`}
            >
              {a.ratio >= 1 ? "⚠️ חריגה מהתקציב" : "🔔 מתקרב לתקציב"} בקטגוריית{" "}
              <strong>{a.cat!.name}</strong>: {Math.round(a.ratio * 100)}% נוצל (
              {<Money value={a.spent} />} מתוך {<Money value={a.budget} />})
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="הוצאות לפי קטגוריה">
          <CategoryDonut data={donut} />
        </Card>
        <Card title="הכנסות מול הוצאות — 6 חודשים">
          <TrendChart data={series} />
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  type,
}: {
  label: string;
  value: number;
  type: "income" | "expense";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold">
        <Money value={value} type={type} />
      </p>
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
