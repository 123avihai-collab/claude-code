import { monthStart, shiftMonth } from "@/lib/format";
import { getForecastBaseline } from "@/lib/db/queries";
import { ForecastClient } from "./_components/forecast-client";
import { t } from "@/lib/strings";

export default async function ForecastPage() {
  const thisMonth = monthStart();
  const startMonth = shiftMonth(thisMonth, 1); // הצפי מתחיל מהחודש הבא
  const baseline = await getForecastBaseline(thisMonth, 6);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t.nav.forecast} — תכנון קדימה</h1>
        <p className="mt-1 text-sm text-muted">
          צפי הכנסות, הוצאות וחיסכון מצטבר לשנה או שנתיים קדימה.
        </p>
      </header>

      <ForecastClient
        startMonth={startMonth}
        avgIncome={baseline.avgIncome}
        avgExpense={baseline.avgExpense}
        monthsAnalyzed={baseline.monthsAnalyzed}
      />
    </div>
  );
}
