import * as XLSX from "xlsx";
import type { TransactionWithCategory } from "@/lib/db/queries";

const HEADERS = ["תאריך", "סוג", "קטגוריה", "סכום", "הערה"] as const;

function toRows(txs: TransactionWithCategory[]) {
  return txs.map((t) => ({
    תאריך: t.occurred_on,
    סוג: t.type === "income" ? "הכנסה" : "הוצאה",
    קטגוריה: t.categories?.name ?? "",
    סכום: Number(t.amount),
    הערה: t.note ?? "",
  }));
}

/** מייצא תנועות לקובץ והורדה בדפדפן. format: xlsx | csv */
export function exportTransactions(
  txs: TransactionWithCategory[],
  filename: string,
  format: "xlsx" | "csv" = "xlsx",
) {
  const ws = XLSX.utils.json_to_sheet(toRows(txs), { header: [...HEADERS] });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "תנועות");
  XLSX.writeFile(wb, `${filename}.${format}`, { bookType: format });
}

/** מוריד תבנית ריקה לייבוא, עם כותרות בלבד. */
export function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([[...HEADERS]]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "תנועות");
  XLSX.writeFile(wb, "תבנית-ייבוא.xlsx");
}
