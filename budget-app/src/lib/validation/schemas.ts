import { z } from "zod";

export const txTypeSchema = z.enum(["income", "expense"]);

export const transactionSchema = z.object({
  type: txTypeSchema,
  amount: z.coerce.number().nonnegative("סכום חייב להיות חיובי"),
  category_id: z.string().uuid().nullable().optional(),
  occurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לא תקין"),
  note: z.string().max(500).optional().nullable(),
});
export type TransactionInput = z.infer<typeof transactionSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "שם חובה").max(50),
  type: txTypeSchema,
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "צבע לא תקין")
    .optional()
    .nullable(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const budgetSchema = z.object({
  category_id: z.string().uuid(),
  month: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.coerce.number().nonnegative(),
});
export type BudgetInput = z.infer<typeof budgetSchema>;

/** שורה מיובאת מ-Excel/CSV (לפני התאמת קטגוריה ל-id) */
export const importRowSchema = z.object({
  type: txTypeSchema,
  amount: z.coerce.number().nonnegative(),
  category: z.string().optional().nullable(),
  occurred_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().optional().nullable(),
});
export type ImportRow = z.infer<typeof importRowSchema>;

export const authSchema = z.object({
  email: z.string().email("אימייל לא תקין"),
  password: z.string().min(6, "סיסמה חייבת לפחות 6 תווים"),
});
