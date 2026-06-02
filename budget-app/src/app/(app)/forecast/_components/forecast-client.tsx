"use client";

import { useMemo, useState } from "react";
import { formatMonth, shiftMonth } from "@/lib/format";
import { Money } from "@/components/money";
import { SavingsLine } from "@/components/charts/savings-line";

export function ForecastClient({
  startMonth,
  avgIncome,
  avgExpense,
  monthsAnalyzed,
}: {
  startMonth: string;
  avgIncome: number;
  avgExpense: number;
  monthsAnalyzed: number;
}) {
  const [horizon, setHorizon] = useState<12 | 24>(12);
  const [income, setIncome] = useState(avgIncome);
  const [expense, setExpense] = useState(avgExpense);

  const rows = useMemo(() => {
    // ההכנסה וההוצאה קבועות לכל חודש בצפי, ולכן המצטבר = חיסכון × מספר החודשים.
    const saving = income - expense;
    return Array.from({ length: horizon }, (_, i) => {
      const monthIso = shiftMonth(startMonth, i);
      return {
        monthIso,
        label: formatMonth(monthIso),
        income,
        expense,
        saving,
        cumulative: saving * (i + 1),
      };
    });
  }, [horizon, income, expense, startMonth]);

  const monthlySaving = income - expense;
  const totalSaving = rows.length ? rows[rows.length - 1].cumulative : 0;
  const chartData = rows.map((r) => ({ label: r.label, cumulative: r.cumulative }));

  return (
    <div className="space-y-6">
      {/* בקרות */}
      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex gap-2">
          {([12, 24] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                horizon === h
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border"
              }`}
            >
              {h === 12 ? "שנה" : "שנתיים"}
            </button>
          ))}
        </div>

        <NumberField
          label="הכנסה חודשית צפויה"
          value={income}
          onChange={setIncome}
        />
        <NumberField
          label="הוצאה חודשית צפויה"
          value={expense}
          onChange={setExpense}
        />

        <button
          onClick={() => {
            setIncome(avgIncome);
            setExpense(avgExpense);
          }}
          className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:bg-background"
        >
          ↺ אפס לממוצע
        </button>
      </div>

      {monthsAnalyzed > 0 ? (
        <p className="text-sm text-muted">
          הצפי מבוסס על ממוצע {monthsAnalyzed} החודשים האחרונים עם פעילות. ניתן
          לערוך את הסכומים כדי לבדוק תרחישים.
        </p>
      ) : (
        <p className="text-sm text-amber-600">
          אין עדיין מספיק נתונים לחישוב ממוצע — הזן הכנסה והוצאה חודשית צפויה
          ידנית כדי לראות צפי.
        </p>
      )}

      {/* כרטיסי סיכום */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="חיסכון חודשי צפוי" value={monthlySaving} />
        <SummaryCard
          label={`צפי חיסכון ב-${horizon === 12 ? "שנה" : "שנתיים"}`}
          value={totalSaving}
          big
        />
        <SummaryCard
          label="הכנסה פנויה (אחוז חיסכון)"
          percent={income > 0 ? Math.round((monthlySaving / income) * 100) : 0}
        />
      </div>

      {/* גרף */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">חיסכון מצטבר לאורך זמן</h2>
        <SavingsLine data={chartData} />
      </div>

      {/* טבלה */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-background text-muted">
            <tr>
              <Th>חודש</Th>
              <Th>הכנסה</Th>
              <Th>הוצאה</Th>
              <Th>חיסכון</Th>
              <Th>חיסכון מצטבר</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.monthIso} className="border-t border-border">
                <Td>{r.label}</Td>
                <Td>
                  <Money value={r.income} type="income" />
                </Td>
                <Td>
                  <Money value={r.expense} type="expense" />
                </Td>
                <Td>
                  <Money
                    value={r.saving}
                    type={r.saving >= 0 ? "income" : "expense"}
                  />
                </Td>
                <Td className="font-medium">
                  <Money
                    value={r.cumulative}
                    type={r.cumulative >= 0 ? "income" : "expense"}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          step="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-32 rounded-lg border border-border bg-background px-3 py-2"
        />
        <span className="text-muted">₪</span>
      </div>
    </label>
  );
}

function SummaryCard({
  label,
  value,
  percent,
  big = false,
}: {
  label: string;
  value?: number;
  percent?: number;
  big?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 font-bold ${big ? "text-3xl text-primary" : "text-2xl"}`}>
        {percent !== undefined ? (
          `${percent}%`
        ) : (
          <Money
            value={value ?? 0}
            type={(value ?? 0) >= 0 ? "income" : "expense"}
          />
        )}
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 text-start font-medium">{children}</th>;
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}
