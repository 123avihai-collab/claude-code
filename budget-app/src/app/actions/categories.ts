"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/db/queries";
import { categorySchema } from "@/lib/validation/schemas";

function revalidate() {
  revalidatePath("/settings");
  revalidatePath("/transactions");
  revalidatePath("/budgets");
}

export async function createCategory(formData: FormData) {
  const { supabase, user } = await requireUser();
  const input = categorySchema.parse({
    name: formData.get("name"),
    type: formData.get("type"),
    color: (formData.get("color") as string) || null,
  });
  const { error } = await supabase
    .from("categories")
    .insert({ ...input, user_id: user.id });
  if (error) throw error;
  revalidate();
}

export async function updateCategory(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const input = categorySchema.parse({
    name: formData.get("name"),
    type: formData.get("type"),
    color: (formData.get("color") as string) || null,
  });
  const { error } = await supabase.from("categories").update(input).eq("id", id);
  if (error) throw error;
  revalidate();
}

/** ארכוב במקום מחיקה כדי לא לפגוע בתנועות היסטוריות. */
export async function archiveCategory(id: string, archived: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("categories")
    .update({ is_archived: archived })
    .eq("id", id);
  if (error) throw error;
  revalidate();
}
