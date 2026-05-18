"use client";

import { useState } from "react";
import type { PartialBill, PartialBillStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { billReductionsByBill } from "@/lib/bill-reductions-2253";

// Format quantity / unit price: max 3 decimals, no trailing zeros
function fmtQty(n: number): string {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 3 }).format(n);
}

function fmtPrice(n: number): string {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 2 }).format(n);
}

const statusMap: Record<PartialBillStatus, { label: string; cls: string; emoji: string }> = {
  draft: { label: "טיוטא", cls: "bg-slate-200 text-slate-700", emoji: "📝" },
  submitted: { label: "הוגש", cls: "bg-blue-100 text-blue-700", emoji: "📤" },
  approved: { label: "אושר - ממתין לתשלום", cls: "bg-amber-100 text-amber-700", emoji: "⏳" },
  paid: { label: "שולם", cls: "bg-green-100 text-green-700", emoji: "✅" },
  rejected: { label: "נדחה", cls: "bg-red-100 text-red-700", emoji: "❌" },
  overdue: { label: "באיחור", cls: "bg-red-100 text-red-700", emoji: "🚨" },
};

export function BillsTable({
  bills,
  projectRevenue,
  totalBeforeVat,
  totalWithVat,
}: {
  bills: PartialBill[];
  projectRevenue: number;
  totalBeforeVat: number;
  totalWithVat: number;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="p-3 text-right font-medium text-slate-600 w-8"></th>
            <th className="p-3 text-right font-medium text-slate-600">#</th>
            <th className="p-3 text-right font-medium text-slate-600">תקופה</th>
            <th className="p-3 text-right font-medium text-slate-600">מס׳ חשבונית</th>
            <th className="p-3 text-right font-medium text-slate-600">תאריך</th>
            <th className="p-3 text-right font-medium text-slate-600">לפני מע&quot;מ</th>
            <th className="p-3 text-right font-medium text-slate-600">כולל מע&quot;מ</th>
            <th className="p-3 text-right font-medium text-slate-600">מצטבר</th>
            <th className="p-3 text-right font-medium text-slate-600">פירעון</th>
            <th className="p-3 text-right font-medium text-slate-600">סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => {
            const s = statusMap[b.status];
            const cumPct = (b.cumulativeBeforeVat / projectRevenue) * 100;
            const isExpanded = expandedId === b.id;
            const hasItems = b.boqItems && b.boqItems.length > 0;
            return (
              <BillRowGroup
                key={b.id}
                bill={b}
                isExpanded={isExpanded}
                hasItems={!!hasItems}
                onToggle={() => toggle(b.id)}
                statusLabel={s}
                cumPct={cumPct}
              />
            );
          })}
          <tr className="bg-slate-100 font-bold">
            <td className="p-3"></td>
            <td className="p-3" colSpan={4}>
              סה&quot;כ ({bills.length} חשבונות)
            </td>
            <td className="p-3 text-slate-800">{formatCurrency(totalBeforeVat)}</td>
            <td className="p-3 text-slate-800">{formatCurrency(totalWithVat)}</td>
            <td className="p-3 text-xs text-slate-600">
              {((totalBeforeVat / projectRevenue) * 100).toFixed(0)}% מהחוזה
            </td>
            <td className="p-3"></td>
            <td className="p-3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BillRowGroup({
  bill: b,
  isExpanded,
  hasItems,
  onToggle,
  statusLabel: s,
  cumPct,
}: {
  bill: PartialBill;
  isExpanded: boolean;
  hasItems: boolean;
  onToggle: () => void;
  statusLabel: { label: string; cls: string; emoji: string };
  cumPct: number;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b transition-colors ${
          isExpanded ? "bg-blue-50" : "hover:bg-slate-50"
        } ${hasItems ? "cursor-pointer" : "cursor-default"}`}
        title={hasItems ? "לחץ להצגת סעיפי הכתב כמויות" : "אין פירוט סעיפים"}
      >
        <td className="p-3 text-center">
          {hasItems ? (
            <span
              className={`inline-block w-5 h-5 rounded text-xs leading-5 text-center ${
                isExpanded ? "bg-blue-200 text-blue-800" : "bg-slate-200 text-slate-600"
              }`}
            >
              {isExpanded ? "▾" : "◂"}
            </span>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </td>
        <td className="p-3 font-bold text-slate-700">{b.billNumber}</td>
        <td className="p-3 text-slate-700">{b.periodLabel}</td>
        <td className="p-3 text-xs">
          <div className="font-mono text-slate-700">{b.invoiceNumber}</div>
          {b.documentURL ? (
            <a
              href={b.documentURL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 mt-1"
            >
              📥 הורד PDF
            </a>
          ) : (
            <span className="text-slate-400 text-xs mt-1 inline-block">אין קובץ</span>
          )}
        </td>
        <td className="p-3 text-xs text-slate-500">{b.invoiceDate}</td>
        <td className="p-3 text-slate-800">{formatCurrency(b.amountBeforeVat)}</td>
        <td className="p-3 font-bold text-slate-800">{formatCurrency(b.amountWithVat)}</td>
        <td className="p-3 text-xs">
          <div className="text-slate-600">{formatCurrency(b.cumulativeBeforeVat)}</div>
          <div className="text-slate-400">{cumPct.toFixed(0)}% מהחוזה</div>
        </td>
        <td className="p-3 text-xs">
          <div className="text-slate-700">{b.paymentDueDate}</div>
          {b.paidDate && <div className="text-green-600">✓ שולם {b.paidDate}</div>}
        </td>
        <td className="p-3">
          <span className={`text-xs px-2 py-1 rounded-full ${s.cls} whitespace-nowrap`}>
            {s.emoji} {s.label}
          </span>
        </td>
      </tr>
      {isExpanded && hasItems && (
        <tr>
          <td colSpan={10} className="p-0">
            <BoqItemsExpansion bill={b} />
          </td>
        </tr>
      )}
    </>
  );
}

function BoqItemsExpansion({ bill }: { bill: PartialBill }) {
  const items = bill.boqItems ?? [];
  const totalCurrent = items.reduce((s, i) => s + i.currentBillAmount, 0);
  const totalCumulative = items.reduce((s, i) => s + i.cumulativeAmount, 0);

  return (
    <div className="bg-blue-50 border-r-4 border-blue-500 p-4">
      <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-bold text-blue-900 flex items-center gap-2">
          📋 סעיפי כתב כמויות בחשבון {bill.billNumber}
          <span className="text-xs font-normal text-blue-700">
            ({items.length} סעיפים)
          </span>
        </h4>
        <span className="text-xs text-blue-700">
          סכום סעיפים: {formatCurrency(totalCurrent)} · מצטבר: {formatCurrency(totalCumulative)}
        </span>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-2 text-right font-medium text-slate-600">קוד סעיף</th>
              <th className="p-2 text-right font-medium text-slate-600">תיאור</th>
              <th className="p-2 text-center font-medium text-slate-600">יחידה</th>
              <th className="p-2 text-left font-medium text-slate-600">מחיר יח׳</th>
              <th className="p-2 text-left font-medium text-slate-600">חוזה</th>
              <th className="p-2 text-left font-medium text-slate-600">קודם</th>
              <th className="p-2 text-left font-medium text-slate-600 bg-blue-100">בחשבון זה</th>
              <th className="p-2 text-left font-medium text-slate-600">מצטבר</th>
              <th className="p-2 text-left font-medium text-slate-600 bg-blue-100">סכום בחשבון</th>
              <th className="p-2 text-left font-medium text-slate-600">סכום מצטבר</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const isNote = item.unit === "הערה";
              const isReduction = item.currentBillAmount < -0.5;
              const isHeld = item.isHeld === true;
              const wasRemoved = item.wasRemoved === true;
              // Any "money problem" → red background (consistent color)
              const hasMoneyIssue = isReduction || isHeld || wasRemoved;
              const cumPct = item.contractQuantity > 0
                ? (item.cumulativeQtyAfter / item.contractQuantity) * 100
                : 0;
              return (
                <tr
                  key={idx}
                  className={`border-b last:border-0 hover:bg-slate-50 ${isNote ? "bg-amber-50" : ""} ${hasMoneyIssue ? "bg-red-50" : ""}`}
                >
                  <td className="p-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {item.itemCode}
                  </td>
                  <td className="p-2 text-slate-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{item.description}</span>
                      {isHeld && (
                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full whitespace-nowrap font-bold">
                          🔻 מוחזק ₪{(item.heldAmount ?? 0).toLocaleString("he-IL")}
                        </span>
                      )}
                      {wasRemoved && (
                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full whitespace-nowrap font-bold">
                          🗑️ הוסר ₪{(item.removedAmount ?? 0).toLocaleString("he-IL")}
                        </span>
                      )}
                    </div>
                    {!isNote && item.contractQuantity > 0 && (
                      <div className="mt-1 bg-slate-100 rounded-full h-1 max-w-28">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${Math.min(cumPct, 100)}%` }}
                          title={`${cumPct.toFixed(0)}% מהחוזה הושלם`}
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-center text-slate-600">{item.unit}</td>
                  <td className="p-2 text-left text-slate-600 whitespace-nowrap">
                    {isNote ? "—" : `₪${fmtPrice(item.unitPrice)}`}
                  </td>
                  <td className="p-2 text-left text-slate-600">
                    {isNote ? "—" : fmtQty(item.contractQuantity)}
                  </td>
                  <td className="p-2 text-left text-slate-500">
                    {isNote ? "—" : fmtQty(item.previousCumulativeQty)}
                  </td>
                  <td className={`p-2 text-left font-bold bg-blue-50/50 ${item.currentBillQty < -0.001 ? "text-red-700" : "text-slate-800"}`}>
                    {isNote ? "—" : (
                      item.currentBillQty < -0.001 ? (
                        <span title="כמות הוקטנה ע&quot;י המפקח (rollback)">
                          ↩ {fmtQty(item.currentBillQty)}
                        </span>
                      ) : (
                        fmtQty(item.currentBillQty)
                      )
                    )}
                  </td>
                  <td className="p-2 text-left text-slate-700">
                    {isNote ? "—" : fmtQty(item.cumulativeQtyAfter)}
                  </td>
                  <td className={`p-2 text-left font-bold bg-blue-50/50 whitespace-nowrap ${item.currentBillAmount < -0.5 ? "text-red-700" : "text-blue-800"}`}>
                    {isNote ? "—" : (
                      item.currentBillAmount < -0.5 ? (
                        <span title="סכום קוזז ע&quot;י המפקח">
                          ↩ {formatCurrency(item.currentBillAmount)}
                        </span>
                      ) : (
                        formatCurrency(item.currentBillAmount)
                      )
                    )}
                  </td>
                  <td className="p-2 text-left text-slate-700 whitespace-nowrap">
                    {isNote ? "—" : (
                      <>
                        {formatCurrency(item.cumulativeAmount)}
                        {isHeld && item.cumulativeGrossAmount && (
                          <div className="text-xs text-red-600 mt-0.5">
                            ברוטו: ₪{item.cumulativeGrossAmount.toLocaleString("he-IL")}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-200 font-bold">
              <td className="p-2" colSpan={8}>
                סה&quot;כ סעיפי הכתב כמויות בחשבון
              </td>
              <td className="p-2 text-left text-blue-800 whitespace-nowrap">
                {formatCurrency(totalCurrent)}
              </td>
              <td className="p-2 text-left text-slate-700 whitespace-nowrap">
                {formatCurrency(totalCumulative)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bill calculation: gross → after IAI → after YRN = net invoice */}
      <BillCalculationBox bill={bill} grossThisBill={totalCurrent} />

      {/* Reductions panel — items held > 15% or removed in this bill */}
      <BillReductionsPanel billNumber={bill.billNumber} />

      <p className="text-xs text-blue-700 mt-3 bg-white/60 rounded p-2">
        💡 <strong>כך זה עובד</strong>: כל חשבון חלקי כולל רק את הסעיפים שעליהם
        חויב/הוגש באותו חודש. הכמויות הן <strong>מצטברות</strong> — &quot;כמות בחשבון&quot;
        זו ההוספה לעומת החשבון הקודם.
      </p>
    </div>
  );
}

function BillCalculationBox({
  bill,
  grossThisBill,
}: {
  bill: PartialBill;
  grossThisBill: number;
}) {
  // grossThisBill here is actually the sum of NET item amounts (after IAI retention per-item).
  // The "gross before IAI" must come from the bill's grossAmountThisBill field.
  const sumItemsNet = grossThisBill;  // already net of per-item IAI retention
  const grossBeforeIai = bill.grossAmountThisBill ?? sumItemsNet;
  const iaiRetention = bill.iaiCurrentRetention ?? (grossBeforeIai - sumItemsNet);
  const yrnRetention = bill.yrnCurrentRetention ?? 0;
  const expectedNet = sumItemsNet - yrnRetention;
  const actualNet = bill.amountBeforeVat;

  const matches = Math.abs(expectedNet - actualNet) < 5;
  const iaiRate = grossBeforeIai > 0 ? (iaiRetention / grossBeforeIai) * 100 : 0;
  const yrnRate = sumItemsNet > 0 ? (yrnRetention / sumItemsNet) * 100 : 0;
  const iaiNote = iaiRate < 9.5
    ? "פחות מ-10% — חלק מהסעיפים שולמו ב-100% (לדוגמה: מתקני דלק, רג\"י)"
    : iaiRate > 10.5
      ? "יותר מ-10%"
      : "10% רגיל";

  return (
    <div className="mt-3 bg-white rounded-lg border-r-4 border-amber-500 p-3">
      <h5 className="font-bold text-slate-800 mb-2 text-sm flex items-center gap-2">
        🧮 חישוב סופי של חשבון {bill.billNumber}
        {matches ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            ✓ תואם לחשבונית שיצאה
          </span>
        ) : (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            ⚠ הפרש: ₪{Math.abs(actualNet - expectedNet).toFixed(0)}
          </span>
        )}
      </h5>
      <div className="text-sm space-y-1.5">
        <div className="flex justify-between border-b border-slate-100 pb-1">
          <span className="text-slate-700">סך ברוטו (לפני עיכבונות)</span>
          <span className="font-bold text-slate-800">{formatCurrency(grossBeforeIai)}</span>
        </div>
        <div className="flex justify-between text-red-700 border-b border-slate-100 pb-1">
          <span>
            − עיכבון תע&quot;א
            <span className="text-xs text-slate-500 mr-2">
              ({iaiRate.toFixed(2)}% — {iaiNote})
            </span>
          </span>
          <span className="font-mono">−{formatCurrency(iaiRetention)}</span>
        </div>
        <div className="flex justify-between bg-slate-50 px-2 py-1 rounded">
          <span className="text-slate-700 text-xs italic">= סך אחרי תע&quot;א (סכימת סעיפים בטבלה)</span>
          <span className="text-slate-700 font-mono text-xs">{formatCurrency(sumItemsNet)}</span>
        </div>
        <div className="flex justify-between text-orange-700 border-b border-slate-100 pb-1">
          <span>
            − עיכבון י.ר.ן
            <span className="text-xs text-slate-500 mr-2">({yrnRate.toFixed(1)}%)</span>
          </span>
          <span className="font-mono">−{formatCurrency(yrnRetention)}</span>
        </div>
        <div className="flex justify-between font-bold bg-slate-800 text-white rounded p-2 mt-2">
          <span>= סך החשבון לתשלום (נטו, לפני מע&quot;מ)</span>
          <span>{formatCurrency(actualNet)}</span>
        </div>
        {!matches && (
          <p className="text-xs text-red-700 mt-2 bg-red-50 p-2 rounded">
            ⚠ <strong>הפרש של ₪{Math.abs(actualNet - expectedNet).toFixed(0)}</strong> —
            ייתכן שיש סעיף ספציפי שטופל אחרת. בדוק בטבלה למעלה איזה סעיף לא מסתדר.
          </p>
        )}
      </div>
    </div>
  );
}

function BillReductionsPanel({ billNumber }: { billNumber: number }) {
  const data = billReductionsByBill[billNumber];
  const [expanded, setExpanded] = useState(false);
  if (!data) return null;
  const { unusualReductions, standardRetentionCount, standardRetentionTotal } = data;
  if (unusualReductions.length === 0 && standardRetentionCount === 0) return null;

  const removed = unusualReductions.filter(
    (r) => r.type === "removed" || r.type === "removed_and_held",
  );
  const heldOnly = unusualReductions.filter((r) => r.type === "held");
  const totalRemoved = removed.reduce((s, r) => s + r.removedThisBill, 0);
  const totalHeldUnusual = unusualReductions.reduce((s, r) => s + r.heldAmount, 0);
  const grandTotalUnusual = totalRemoved + totalHeldUnusual;

  let billExplanation = "";
  if (billNumber === 6) {
    billExplanation = "5 סעיפי רג\"י הוחזקו ב-100% — המפקח רשם את העבודה אבל לא אישר תשלום. עדיין מגיע לך הכסף.";
  } else if (billNumber === 7) {
    billExplanation = "אותם 5 רג\"י של חשבון 6 — עדיין מוחזקים. בנוסף: ניקוז V6/V8 הוחזק. ~₪189K מעוכבים.";
  } else if (billNumber === 8) {
    billExplanation = "5 סעיפים הוסרו רטרואקטיבית (V1/V3/V4/V9 valves -₪315K + 4 רג\"י -₪65.6K). דרוש לדרוש מחדש.";
  } else {
    billExplanation = "סעיפים חריגים בחשבון זה.";
  }

  if (unusualReductions.length === 0) {
    // Only standard retention — show as a small line
    return (
      <div className="mt-3 bg-slate-50 rounded-lg p-2 text-xs text-slate-600 flex justify-between items-center">
        <span>ℹ️ {standardRetentionCount} סעיפים עם עיכבון 10% רגיל</span>
        <span className="font-mono">₪{standardRetentionTotal.toLocaleString("he-IL")}</span>
      </div>
    );
  }

  // Collapsible summary view — click to expand
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg mt-4">
      {/* Always-visible summary header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex justify-between items-center hover:bg-red-100 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3 text-right">
          <span className="text-2xl">🔻</span>
          <div>
            <p className="font-bold text-red-900">
              קיזוזים חריגים בחשבון {billNumber}
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              {removed.length > 0 && `${removed.length} הוסרו`}
              {removed.length > 0 && heldOnly.length > 0 && " · "}
              {heldOnly.length > 0 && `${heldOnly.length} מוחזקים`}
              {" · לחץ לפירוט"}
            </p>
          </div>
        </div>
        <div className="text-left flex items-center gap-3">
          <div>
            <p className="text-xs text-red-700">סך קיזוזים</p>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(grandTotalUnusual)}</p>
          </div>
          <span className="text-red-700 text-xl">{expanded ? "▾" : "◂"}</span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-xs text-red-800 mb-3 bg-white/60 rounded p-2">
            ℹ️ {billExplanation}
          </p>

          {removed.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-red-700 mb-2">
                🗑️ {removed.length} סעיפים הוסרו / הוקטנו · ₪{totalRemoved.toLocaleString("he-IL")}
              </p>
              <div className="space-y-1.5">
                {removed.map((r, i) => (
                  <div key={`r-${i}`} className="bg-white rounded p-2 text-xs flex justify-between items-center border-r-2 border-red-500">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-slate-600">{r.itemCode}</span>
                      <span className="text-slate-800 mr-2">{r.description}</span>
                    </div>
                    <span className="text-red-700 font-bold whitespace-nowrap text-base">
                      −{formatCurrency(r.removedThisBill)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {heldOnly.length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-700 mb-2">
                ⏸️ {heldOnly.length} סעיפים מוחזקים · ₪{totalHeldUnusual.toLocaleString("he-IL")}
              </p>
              <div className="space-y-1.5">
                {heldOnly.map((r, i) => (
                  <div key={`h-${i}`} className="bg-white rounded p-2 text-xs flex justify-between items-center border-r-2 border-red-500">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-slate-600">{r.itemCode}</span>
                      <span className="text-slate-800 mr-2">{r.description}</span>
                      <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                        {(r.heldRate * 100).toFixed(0)}% מוחזק
                      </span>
                    </div>
                    <div className="text-left whitespace-nowrap mr-3">
                      <div className="text-slate-500 text-xs">ברוטו ₪{r.grossCurrent.toLocaleString("he-IL")}</div>
                      <div className="text-slate-600 text-xs">נטו ₪{r.netCurrent.toLocaleString("he-IL")}</div>
                    </div>
                    <span className="text-red-700 font-bold whitespace-nowrap text-base">
                      −{formatCurrency(r.heldAmount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {standardRetentionCount > 0 && (
            <div className="mt-3 pt-3 border-t border-red-200 flex justify-between items-center text-xs text-slate-600">
              <span>ℹ️ בנוסף: {standardRetentionCount} סעיפים עם עיכבון 10% רגיל</span>
              <span className="font-mono">₪{standardRetentionTotal.toLocaleString("he-IL")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
