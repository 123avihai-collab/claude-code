"use client";

import { useState } from "react";
import type { PartialBill, PartialBillStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

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
              const isReduction = item.currentBillAmount < -0.5;  // קיזוז (סעיף שהוסר/הוקטן)
              const cumPct = item.contractQuantity > 0
                ? (item.cumulativeQtyAfter / item.contractQuantity) * 100
                : 0;
              return (
                <tr
                  key={idx}
                  className={`border-b last:border-0 hover:bg-slate-50 ${isNote ? "bg-amber-50" : ""} ${isReduction ? "bg-red-50" : ""}`}
                >
                  <td className="p-2 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {item.itemCode}
                  </td>
                  <td className="p-2 text-slate-800">
                    {item.description}
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
                  <td className={`p-2 text-left font-bold bg-blue-50/50 ${isReduction ? "text-red-700" : "text-slate-800"}`}>
                    {isNote ? "—" : fmtQty(item.currentBillQty)}
                  </td>
                  <td className="p-2 text-left text-slate-700">
                    {isNote ? "—" : fmtQty(item.cumulativeQtyAfter)}
                  </td>
                  <td className={`p-2 text-left font-bold bg-blue-50/50 whitespace-nowrap ${isReduction ? "text-red-700" : "text-blue-800"}`}>
                    {isNote ? "—" : formatCurrency(item.currentBillAmount)}
                  </td>
                  <td className="p-2 text-left text-slate-700 whitespace-nowrap">
                    {isNote ? "—" : formatCurrency(item.cumulativeAmount)}
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
  // Use actual data from file if available, otherwise compute from sum of items
  const gross = bill.grossAmountThisBill ?? grossThisBill;
  const iaiRetention = bill.iaiCurrentRetention ?? 0;
  const yrnRetention = bill.yrnCurrentRetention ?? 0;
  const expectedNet = gross - iaiRetention - yrnRetention;
  const actualNet = bill.amountBeforeVat;

  // Sanity check: does the math match the official bill amount?
  const matches = Math.abs(expectedNet - actualNet) < 1;

  // Calculate effective rates (not always exactly 10/5)
  const iaiRate = gross > 0 ? (iaiRetention / gross) * 100 : 0;
  const yrnAfterIai = gross - iaiRetention;
  const yrnRate = yrnAfterIai > 0 ? (yrnRetention / yrnAfterIai) * 100 : 0;

  return (
    <div className="mt-3 bg-white rounded-lg border-r-4 border-amber-500 p-3">
      <h5 className="font-bold text-slate-800 mb-2 text-sm flex items-center gap-2">
        🧮 חישוב סופי של חשבון {bill.billNumber}
        {matches ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            ✓ תואם לחשבונית
          </span>
        ) : (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            ⚠ הפרש: ₪{(actualNet - expectedNet).toFixed(0)}
          </span>
        )}
      </h5>
      <div className="text-sm space-y-1.5">
        <div className="flex justify-between border-b border-slate-100 pb-1">
          <span className="text-slate-700">סך הברוטו (סעיפי הכתב כמויות)</span>
          <span className="font-bold text-slate-800">{formatCurrency(gross)}</span>
        </div>
        <div className="flex justify-between text-red-700 border-b border-slate-100 pb-1">
          <span>
            − עיכבון תע&quot;א
            {iaiRetention === 0 ? (
              <span className="text-xs text-amber-600 mr-2">(לא נלקח בחשבון זה)</span>
            ) : (
              <span className="text-xs text-slate-500 mr-2">({iaiRate.toFixed(1)}%)</span>
            )}
          </span>
          <span className="font-mono">{iaiRetention === 0 ? "₪0" : `−${formatCurrency(iaiRetention)}`}</span>
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
            ייתכן שיש סעיף שלא נלקח עליו עיכבון, או שהמפקח קיזז אחרת. שווה לבדוק.
          </p>
        )}
      </div>
    </div>
  );
}
