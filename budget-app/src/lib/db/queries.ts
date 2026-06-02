import { createClient } from "@/lib/supabase/server";
import { shiftMonth } from "@/lib/format";
import type { Category, Transaction, Budget } from "./types";

/** מחזיר את המשתמש המחובר או זורק אם אין (להגנה כפולה על גבי RLS). */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthenticated");
  return { supabase, user };
}

export async function getCategories(): Promise<Category[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("type", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export type TransactionWithCategory = Transaction & {
  categories: Pick<Category, "name" | "color"> | null;
};

/** תנועות לחודש נתון (month = YYYY-MM-DD של תחילת החודש). */
export async function getTransactions(
  month: string,
): Promise<TransactionWithCategory[]> {
  const { supabase } = await requireUser();
  const next = shiftMonth(month, 1);
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .gte("occurred_on", month)
    .lt("occurred_on", next)
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as TransactionWithCategory[];
}

export interface MonthTotals {
  income: number;
  expense: number;
  balance: number;
}

export async function getMonthTotals(month: string): Promise<MonthTotals> {
  const txs = await getTransactions(month);
  let income = 0;
  let expense = 0;
  for (const t of txs) {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  }
  return { income, expense, balance: income - expense };
}

export async function getBudgets(month: string): Promise<Budget[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("month", month);
  if (error) throw error;
  return data ?? [];
}

export interface CategorySpend {
  category_id: string;
  spent: number;
}

/** סכום הוצאות לפי קטגוריה לחודש נתון. */
export async function getCategorySpend(month: string): Promise<CategorySpend[]> {
  const txs = await getTransactions(month);
  const map = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== "expense" || !t.category_id) continue;
    map.set(t.category_id, (map.get(t.category_id) ?? 0) + Number(t.amount));
  }
  return [...map.entries()].map(([category_id, spent]) => ({
    category_id,
    spent,
  }));
}

export interface MonthlySeriesPoint {
  month: string;
  income: number;
  expense: number;
}

/** סדרת חודשים אחרונים (ברירת מחדל 6) להכנסה מול הוצאה — לדוחות. */
export async function getMonthlySeries(
  fromMonth: string,
  months = 6,
): Promise<MonthlySeriesPoint[]> {
  const { supabase } = await requireUser();
  const start = shiftMonth(fromMonth, -(months - 1));
  const end = shiftMonth(fromMonth, 1);
  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount, occurred_on")
    .gte("occurred_on", start)
    .lt("occurred_on", end);
  if (error) throw error;

  const buckets = new Map<string, MonthlySeriesPoint>();
  for (let i = 0; i < months; i++) {
    const m = shiftMonth(start, i);
    buckets.set(m, { month: m, income: 0, expense: 0 });
  }
  for (const row of data ?? []) {
    const m = `${row.occurred_on.slice(0, 7)}-01`;
    const b = buckets.get(m);
    if (!b) continue;
    if (row.type === "income") b.income += Number(row.amount);
    else b.expense += Number(row.amount);
  }
  return [...buckets.values()];
}
