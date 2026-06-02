"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/db/queries";
import { transactionSchema } from "@/lib/validation/schemas";

function parse(formData: FormData) {
  const rawCat = formData.get("category_id");
  return transactionSchema.parse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    category_id: rawCat ? String(rawCat) : null,
    occurred_on: formData.get("occurred_on"),
    note: (formData.get("note") as string) || null,
  });
}

function revalidate() {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  revalidatePath("/reports");
}

export async function createTransaction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const input = parse(formData);
  const { error } = await supabase
    .from("transactions")
    .insert({ ...input, user_id: user.id });
  if (error) throw error;
  revalidate();
}

export async function updateTransaction(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const input = parse(formData);
  const { error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", id);
  if (error) throw error;
  revalidate();
}

export async function deleteTransaction(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
  revalidate();
}

/** הוספה מרובה — לייבוא מ-Excel. rows כבר מנורמלות עם category_id. */
export async function bulkInsertTransactions(
  rows: {
    type: "income" | "expense";
    amount: number;
    category_id: string | null;
    occurred_on: string;
    note: string | null;
  }[],
) {
  const { supabase, user } = await requireUser();
  if (rows.length === 0) return { inserted: 0 };
  const payload = rows.map((r) => ({ ...r, user_id: user.id }));
  const { error, count } = await supabase
    .from("transactions")
    .insert(payload, { count: "exact" });
  if (error) throw error;
  revalidate();
  return { inserted: count ?? rows.length };
}
