import { monthStart } from "@/lib/format";
import { getCategories, getTransactions } from "@/lib/db/queries";
import { MonthPicker } from "@/components/month-picker";
import { TransactionsClient } from "./_components/transactions-client";
import { t } from "@/lib/strings";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? monthStart();

  const [categories, transactions] = await Promise.all([
    getCategories(),
    getTransactions(month),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.nav.transactions}</h1>
        <MonthPicker month={month} />
      </header>

      <TransactionsClient
        month={month}
        categories={categories}
        transactions={transactions}
      />
    </div>
  );
}
