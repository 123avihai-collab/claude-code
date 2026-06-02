import * as XLSX from "xlsx";
import { importRowSchema, type ImportRow } from "@/lib/validation/schemas";

export interface ParsedRow {
  row: number; // מספר שורה בקובץ (1-based, לא כולל כותרת)
  data?: ImportRow;
  error?: string;
}

// מיפוי כותרות אפשריות (עברית/אנגלית) לשדות
const HEADER_MAP: Record<string, keyof ImportRow> = {
  תאריך: "occurred_on",
  date: "occurred_on",
  סוג: "type",
  type: "type",
  קטגוריה: "category",
  category: "category",
  סכום: "amount",
  amount: "amount",
  הערה: "note",
  note: "note",
};

function normalizeType(v: unknown): "income" | "expense" | undefined {
  const s = String(v ?? "").trim().toLowerCase();
  if (["הכנסה", "income", "in"].includes(s)) return "income";
  if (["הוצאה", "expense", "out"].includes(s)) return "expense";
  return undefined;
}

/** ממיר תאריך (serial של Excel / Date / מחרוזת) ל-YYYY-MM-DD. */
function normalizeDate(v: unknown): string | undefined {
  if (v == null || v === "") return undefined;
  if (v instanceof Date) return toIso(v);
  if (typeof v === "number") {
    const d = XLSX.SSF?.parse_date_code(v);
    if (d) return `${pad(d.y, 4)}-${pad(d.m)}-${pad(d.d)}`;
  }
  const s = String(v).trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // DD/MM/YYYY או DD.MM.YYYY
  const m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
  if (m) {
    const [, d, mo, y] = m;
    const yy = y.length === 2 ? `20${y}` : y;
    return `${pad(Number(yy), 4)}-${pad(Number(mo))}-${pad(Number(d))}`;
  }
  const parsed = new Date(s);
  return isNaN(+parsed) ? undefined : toIso(parsed);
}

const pad = (n: number, len = 2) => String(n).padStart(len, "0");
const toIso = (d: Date) =>
  `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** קורא קובץ Excel/CSV ומחזיר שורות מאומתות + שגיאות לכל שורה. */
export async function parseImportFile(file: File): Promise<ParsedRow[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
  });

  return raw.map((rawRow, i): ParsedRow => {
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rawRow)) {
      const field = HEADER_MAP[String(key).trim().toLowerCase()] ?? HEADER_MAP[String(key).trim()];
      if (field) mapped[field] = value;
    }

    const candidate = {
      type: normalizeType(mapped.type),
      amount: mapped.amount,
      category: mapped.category ? String(mapped.category).trim() : null,
      occurred_on: normalizeDate(mapped.occurred_on),
      note: mapped.note ? String(mapped.note) : null,
    };

    const parsed = importRowSchema.safeParse(candidate);
    if (!parsed.success) {
      return { row: i + 1, error: parsed.error.issues[0]?.message ?? "שורה לא תקינה" };
    }
    return { row: i + 1, data: parsed.data };
  });
}
