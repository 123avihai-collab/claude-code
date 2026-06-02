"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/db/queries";
import { budgetSchema } from "@/lib/validation/schemas";

/** קביעת/עדכון תקציב לקטגוריה בחודש. amount=0 מוחק את התקציב. */
export async function setBudget(formData: FormData) {
  const { supabase, user } = await requireUser();
  const input = budgetSchema.parse({
    category_id: formData.get("category_id"),
    month: formData.get("month"),
    amount: formData.get("amount"),
  });

  if (input.amount === 0) {
    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("category_id", input.category_id)
      .eq("month", input.month);
    if (error) throw error;
  } else {
    // בדיקה-ואז-עדכון/הוספה (במקום upsert) — שומר על RLS וטיפוסים ברורים.
    const { data: existing } = await supabase
      .from("budgets")
      .select("id")
      .eq("category_id", input.category_id)
      .eq("month", input.month)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("budgets")
        .update({ amount: input.amount })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("budgets")
        .insert({ ...input, user_id: user.id });
      if (error) throw error;
    }
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}
