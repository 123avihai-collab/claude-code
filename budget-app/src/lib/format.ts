import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";

const currencyFmt = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

const currencyFmtPrecise = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** פורמט מטבע ש"ח, למשל 1,234 ₪ */
export function formatMoney(value: number, precise = false): string {
  return (precise ? currencyFmtPrecise : currencyFmt).format(value);
}

/** YYYY-MM-DD -> "2 ביוני 2026" */
export function formatDate(iso: string): string {
  return format(parseISO(iso), "d בMMMM yyyy", { locale: he });
}

/** YYYY-MM-DD -> "יוני 2026" */
export function formatMonth(iso: string): string {
  return format(parseISO(iso), "MMMM yyyy", { locale: he });
}

/** מחזיר את ה-1 בחודש של תאריך נתון (ברירת מחדל: היום) בפורמט YYYY-MM-DD */
export function monthStart(date = new Date()): string {
  return format(new Date(date.getFullYear(), date.getMonth(), 1), "yyyy-MM-dd");
}

/** תאריך של היום בפורמט YYYY-MM-DD */
export function today(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** הזזת חודש (delta חודשים) על מחרוזת YYYY-MM-DD של תחילת חודש */
export function shiftMonth(monthIso: string, delta: number): string {
  const d = parseISO(monthIso);
  return format(new Date(d.getFullYear(), d.getMonth() + delta, 1), "yyyy-MM-dd");
}
