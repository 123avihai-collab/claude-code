"use client";

import { useState } from "react";
import { parseImportFile, type ParseResult } from "@/lib/excel/import";
import { downloadTemplate } from "@/lib/excel/export";
import { bulkInsertTransactions } from "@/app/actions/transactions";
import { Money } from "@/components/money";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/strings";
import type { Category } from "@/lib/db/types";

export function ImportPanel({ categories }: { categories: Category[] }) {
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const catByName = new Map(
    categories.map((c) => [`${c.type}:${c.name}`, c.id]),
  );

  const rows = parsed?.rows ?? null;
  const valid = rows?.filter((r) => r.data) ?? [];
  const invalid = rows?.filter((r) => r.error) ?? [];
  const autoCount = valid.filter((r) => r.autoCategorized).length;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setParsed(await parseImportFile(file));
  }

  async function onConfirm() {
    if (!rows) return;
    setBusy(true);
    try {
      const payload = valid.map((r) => {
        const d = r.data!;
        const category_id = d.category
          ? (catByName.get(`${d.type}:${d.category}`) ?? null)
          : null;
        return {
          type: d.type,
          amount: d.amount,
          category_id,
          occurred_on: d.occurred_on,
          note: d.note ?? null,
        };
      });
      const { inserted } = await bulkInsertTransactions(payload);
      setResult(`יובאו ${inserted} תנועות בהצלחה.`);
      setParsed(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-background">
          ⬆️ בחר קובץ Excel/CSV
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onFile}
            className="hidden"
          />
        </label>
        <button
          onClick={downloadTemplate}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-background"
        >
          ⬇️ הורד תבנית
        </button>
      </div>

      {result && <p className="text-sm text-income">{result}</p>}

      {parsed && (
        <div className="space-y-3">
          {parsed.format === "cal" && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-2 text-sm text-primary">
              🟦 זוהה דוח אשראי (כאל). {autoCount} מתוך {valid.length} העסקאות
              קוטלגו אוטומטית לפי בית העסק — אפשר לתקן ידנית אחרי הייבוא.
            </div>
          )}
          <p className="text-sm">
            נמצאו <strong>{valid.length}</strong> שורות תקינות
            {invalid.length > 0 && (
              <>
                {" "}
                ו-<strong className="text-expense">{invalid.length}</strong> שגויות
              </>
            )}
            .
          </p>

          {valid.length > 0 && (
            <div className="max-h-64 overflow-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-background text-muted">
                  <tr>
                    <th className="px-3 py-1.5 text-start">{t.common.date}</th>
                    <th className="px-3 py-1.5 text-start">בית העסק / הערה</th>
                    <th className="px-3 py-1.5 text-start">{t.common.category}</th>
                    <th className="px-3 py-1.5 text-start">{t.common.amount}</th>
                  </tr>
                </thead>
                <tbody>
                  {valid.slice(0, 80).map((r) => (
                    <tr key={r.row} className="border-t border-border">
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        {formatDate(r.data!.occurred_on)}
                      </td>
                      <td className="px-3 py-1.5">{r.data!.note || t.common.none}</td>
                      <td className="px-3 py-1.5">
                        {r.data!.category ? (
                          <span>{r.data!.category}</span>
                        ) : (
                          <span className="text-muted">— ללא קטגוריה</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <Money
                          value={r.data!.amount}
                          type={r.data!.type === "income" ? "income" : "expense"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {invalid.length > 0 && (
            <ul className="text-xs text-expense">
              {invalid.slice(0, 10).map((r) => (
                <li key={r.row}>
                  שורה {r.row}: {r.error}
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <button
              onClick={onConfirm}
              disabled={busy || valid.length === 0}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {busy ? t.common.loading : `ייבא ${valid.length} תנועות`}
            </button>
            <button
              onClick={() => setParsed(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
