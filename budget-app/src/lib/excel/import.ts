import * as XLSX from "xlsx";
import { importRowSchema, type ImportRow } from "@/lib/validation/schemas";
import { categorizeMerchant } from "@/lib/categorize";

export interface ParsedRow {
  row: number; // מספר שורה בקובץ (1-based, לא כולל כותרת)
  data?: ImportRow;
  error?: string;
  autoCategorized?: boolean; // האם הקטגוריה זוהתה אוטומטית מבית העסק
}

export interface ParseResult {
  format: "cal" | "generic";
  rows: ParsedRow[];
}

// ---------- עזרי תאריך ----------
const pad = (n: number, len = 2) => String(n).padStart(len, "0");
const toIso = (d: Date) =>
  `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function normalizeDate(v: unknown): string | undefined {
  if (v == null || v === "") return undefined;
  if (v instanceof Date) return toIso(v);
  if (typeof v === "number") {
    const d = XLSX.SSF?.parse_date_code(v);
    if (d) return `${pad(d.y, 4)}-${pad(d.m)}-${pad(d.d)}`;
  }
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
  if (m) {
    const [, d, mo, y] = m;
    const yy = y.length === 2 ? `20${y}` : y;
    return `${pad(Number(yy), 4)}-${pad(Number(mo))}-${pad(Number(d))}`;
  }
  const parsed = new Date(s);
  return isNaN(+parsed) ? undefined : toIso(parsed);
}

function toNumber(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ""));
  return isNaN(n) ? undefined : n;
}

// ---------- זיהוי פורמט ----------
function findCalHeader(grid: unknown[][]): number {
  for (let i = 0; i < Math.min(grid.length, 5); i++) {
    const joined = grid[i].map((c) => String(c ?? "")).join("|");
    if (joined.includes("בית העסק") && joined.includes("סכום החיוב")) return i;
  }
  return -1;
}

// ---------- פרסור פורמט כאל ----------
function parseCal(grid: unknown[][], headerRow: number): ParsedRow[] {
  const header = grid[headerRow].map((c) => String(c ?? "").trim());
  const idxTxDate = header.findIndex((h) => h.includes("תאריך העסקה"));
  const idxMerchant = header.findIndex((h) => h.includes("בית העסק"));
  const idxCharge = header.findIndex((h) => h.includes("סכום החיוב"));

  const out: ParsedRow[] = [];
  for (let i = headerRow + 1; i < grid.length; i++) {
    const r = grid[i];
    const merchant = String(r[idxMerchant] ?? "").trim();
    if (!merchant) continue;
    // דילוג על שורות סיכום/כותרת ביניים
    if (merchant.startsWith("סך") || merchant.includes('סה"כ')) continue;

    const charge = toNumber(r[idxCharge]);
    const date = normalizeDate(r[idxTxDate]);
    if (charge === undefined || charge === 0 || !date) {
      if (charge === 0) continue; // עמלות אפס — מדלגים בשקט
      out.push({ row: i, error: "סכום או תאריך חסר/לא תקין" });
      continue;
    }

    // חיוב שלילי = זיכוי/החזר → נרשם כהכנסה כדי לשמור על מאזן נכון
    const isRefund = charge < 0;
    const cat = isRefund ? "הכנסה אחרת" : categorizeMerchant(merchant);

    const candidate = {
      type: isRefund ? "income" : "expense",
      amount: Math.abs(charge),
      category: cat,
      occurred_on: date,
      note: merchant,
    };
    const parsed = importRowSchema.safeParse(candidate);
    if (!parsed.success) {
      out.push({ row: i, error: parsed.error.issues[0]?.message ?? "שורה לא תקינה" });
    } else {
      out.push({ row: i, data: parsed.data, autoCategorized: !!cat && !isRefund });
    }
  }
  return out;
}

// ---------- פרסור פורמט גנרי (5 עמודות) ----------
const HEADER_MAP: Record<string, keyof ImportRow> = {
  תאריך: "occurred_on", date: "occurred_on",
  סוג: "type", type: "type",
  קטגוריה: "category", category: "category",
  סכום: "amount", amount: "amount",
  הערה: "note", note: "note",
};

function normalizeType(v: unknown): "income" | "expense" | undefined {
  const s = String(v ?? "").trim().toLowerCase();
  if (["הכנסה", "income", "in"].includes(s)) return "income";
  if (["הוצאה", "expense", "out"].includes(s)) return "expense";
  return undefined;
}

function parseGeneric(ws: XLSX.WorkSheet): ParsedRow[] {
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  return raw.map((rawRow, i): ParsedRow => {
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rawRow)) {
      const field =
        HEADER_MAP[String(key).trim().toLowerCase()] ?? HEADER_MAP[String(key).trim()];
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

/**
 * קורא קובץ Excel/CSV ומחזיר את הפורמט שזוהה ושורות מאומתות.
 * תומך בפורמט דוח אשראי כאל (זיהוי וקיטלוג אוטומטיים) ובפורמט הגנרי בן 5 העמודות.
 */
export async function parseImportFile(file: File): Promise<ParseResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  // הגיליון הראשון שאינו ריק
  const sheetName = wb.SheetNames.find((n) => wb.Sheets[n]["!ref"]) ?? wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, blankrows: false });

  const calHeader = findCalHeader(grid);
  if (calHeader >= 0) {
    return { format: "cal", rows: parseCal(grid, calHeader) };
  }
  return { format: "generic", rows: parseGeneric(ws) };
}
