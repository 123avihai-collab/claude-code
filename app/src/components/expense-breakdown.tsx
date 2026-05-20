"use client";

import { useState } from "react";
import type {
  CumulativeSubcontractor,
  ExpenseCategoryNode,
  ExpenseSubItem,
} from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const colorClasses: Record<string, { bg: string; border: string; text: string; barBg: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700", barBg: "bg-blue-500" },
  orange: { bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700", barBg: "bg-orange-500" },
  purple: { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-700", barBg: "bg-purple-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", barBg: "bg-amber-500" },
  red: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", barBg: "bg-red-500" },
  slate: { bg: "bg-slate-50", border: "border-slate-400", text: "text-slate-700", barBg: "bg-slate-400" },
};

// שמות הקבלנים שעובדים בשיטת חשבון מצטבר — מסוננים מקטגוריית קבלני משנה
const CUMULATIVE_NAMES = ["ימית צורית", "עבודות מסגרות"];

function isCumulativeSub(label: string): boolean {
  return CUMULATIVE_NAMES.some((n) => label.includes(n));
}

function SupplierRow({
  child,
  categoryAmount,
  barColor,
}: {
  child: ExpenseSubItem;
  categoryAmount: number;
  barColor: string;
}) {
  const [open, setOpen] = useState(false);
  const childPct = categoryAmount !== 0 ? (child.amount / categoryAmount) * 100 : 0;
  const hasDetail = (child.lineItems && child.lineItems.length > 0) || !!child.rowCount;

  return (
    <div className="bg-white rounded-lg border border-slate-100">
      <button
        onClick={() => hasDetail && setOpen(!open)}
        className={`w-full text-right p-3 flex items-center justify-between gap-3 ${hasDetail ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {hasDetail && (
              <span className="text-slate-400 text-xs shrink-0">{open ? "▾" : "◂"}</span>
            )}
            <span className="text-sm text-slate-700 truncate">{child.label}</span>
            {child.rowCount ? (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                {child.rowCount} תנועות
              </span>
            ) : null}
          </div>
          <div className="bg-slate-100 rounded-full h-1 mt-1.5">
            <div
              className={`h-1 rounded-full ${barColor}`}
              style={{ width: `${Math.max(0, Math.min(childPct, 100))}%` }}
            />
          </div>
          {child.note && <p className="text-xs text-slate-400 mt-1">⚠ {child.note}</p>}
        </div>
        <span className="text-sm font-bold text-slate-800 whitespace-nowrap">
          {formatCurrency(child.amount)}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-100 p-3 bg-slate-50/50">
          {child.lineItems && child.lineItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-slate-500 border-b">
                  <tr>
                    <th className="p-2 text-right font-medium">הזמנת רכש</th>
                    <th className="p-2 text-right font-medium">תיאור</th>
                    <th className="p-2 text-right font-medium">תאריך</th>
                    <th className="p-2 text-left font-medium">סכום</th>
                    <th className="p-2 text-center font-medium">חשבונית</th>
                  </tr>
                </thead>
                <tbody>
                  {child.lineItems.map((li, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-2 font-mono text-slate-600">{li.poNumber ?? "—"}</td>
                      <td className="p-2 text-slate-700">{li.description ?? "—"}</td>
                      <td className="p-2 text-slate-500">{li.date ?? "—"}</td>
                      <td className="p-2 text-left font-bold text-slate-800 whitespace-nowrap">
                        {formatCurrency(li.amount)}
                      </td>
                      <td className="p-2 text-center">
                        {li.invoiceReceived ? (
                          <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                            ✓ נקלטה
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                            ⏳ חסרה
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded p-2">
              📂 יש {child.rowCount} תנועות לספק זה. כדי לראות פירוט{" "}
              <strong>מספר הזמנת רכש</strong> ו<strong>סטטוס חשבונית</strong> לכל תנועה —
              העלה את קובץ ההוצאות/הכנסות.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  cat,
  projectRevenue,
  totalCategorized,
}: {
  cat: ExpenseCategoryNode;
  projectRevenue: number;
  totalCategorized: number;
}) {
  const c = colorClasses[cat.color] ?? colorClasses.slate;
  // סנן קבלנים בשיטת חשבון מצטבר (מוצגים בסקציה נפרדת)
  const children = (cat.children ?? []).filter((ch) => !isCumulativeSub(ch.label));
  const shownAmount = children.reduce((s, ch) => s + ch.amount, 0);
  const displayAmount = children.length === cat.children?.length ? cat.amount : shownAmount;
  const sharePct = totalCategorized !== 0 ? (displayAmount / totalCategorized) * 100 : 0;
  const revenueShare = projectRevenue !== 0 ? (displayAmount / projectRevenue) * 100 : 0;

  return (
    <div className={`rounded-xl border-r-4 ${c.border} ${c.bg} p-4`}>
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cat.icon}</span>
          <div>
            <h4 className={`font-bold ${c.text}`}>{cat.label}</h4>
            <p className="text-xs text-slate-500">
              {sharePct.toFixed(1)}% מההוצאות · {revenueShare.toFixed(1)}% מההכנסות · {children.length} ספקים
            </p>
          </div>
        </div>
        <p className={`text-xl font-bold ${c.text}`}>{formatCurrency(displayAmount)}</p>
      </div>

      <div className="bg-white/60 rounded-full h-1.5 mb-3">
        <div className={`h-1.5 rounded-full ${c.barBg}`} style={{ width: `${sharePct}%` }} />
      </div>

      {children.length > 0 && (
        <div className="space-y-2">
          {children.map((child, idx) => (
            <SupplierRow
              key={idx}
              child={child}
              categoryAmount={displayAmount}
              barColor={c.barBg}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CumulativeSubsSection({ subs }: { subs: CumulativeSubcontractor[] }) {
  if (subs.length === 0) return null;
  const totalPaid = subs.reduce((s, x) => s + x.paidByUs, 0);

  return (
    <div className="rounded-xl border-r-4 border-indigo-500 bg-indigo-50 p-4">
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📑</span>
          <div>
            <h4 className="font-bold text-indigo-700">קבלני משנה — חשבון מצטבר</h4>
            <p className="text-xs text-slate-500">
              עבדו לפי סעיפי חוזה · {subs.length} קבלנים
            </p>
          </div>
        </div>
        <p className="text-xl font-bold text-indigo-700">{formatCurrency(totalPaid)}</p>
      </div>

      <p className="text-xs text-indigo-800 bg-white/60 rounded p-2 my-3">
        💡 כדי לבדוק התאמה בין מה ששילמנו לבין החשבון המצטבר שהקבלן הגיש —
        העלה את החשבון המצטבר של כל קבלן ונשווה.
      </p>

      <div className="space-y-2">
        {subs.map((sub) => {
          const billed = sub.billedCumulative;
          const diff = billed !== undefined ? sub.paidByUs - billed : undefined;
          return (
            <div key={sub.id} className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">{sub.name}</p>
                  <p className="text-xs text-slate-500">
                    {sub.specialty} · {sub.rowCount} תנועות
                  </p>
                  {sub.note && <p className="text-xs text-amber-600 mt-1">⏳ {sub.note}</p>}
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">שילמנו בפועל</p>
                  <p className="font-bold text-slate-800">{formatCurrency(sub.paidByUs)}</p>
                </div>
              </div>

              {billed !== undefined && (
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-slate-500">חשבון מצטבר שהוגש</p>
                    <p className="font-bold text-slate-800">{formatCurrency(billed)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">הפרש</p>
                    <p className={`font-bold ${Math.abs(diff ?? 0) < 1000 ? "text-green-700" : "text-red-700"}`}>
                      {formatCurrency(diff ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">סטטוס</p>
                    <p className={`font-bold ${Math.abs(diff ?? 0) < 1000 ? "text-green-700" : "text-red-700"}`}>
                      {Math.abs(diff ?? 0) < 1000 ? "✓ תואם" : "⚠ לבדוק"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ExpenseBreakdown({
  categoryTree,
  cumulativeSubs,
  projectRevenue,
}: {
  categoryTree: ExpenseCategoryNode[];
  cumulativeSubs: CumulativeSubcontractor[];
  projectRevenue: number;
}) {
  const cumulativePaid = cumulativeSubs.reduce((s, x) => s + x.paidByUs, 0);
  // סך הוצאות כולל הכל (גם הקבלנים המצטברים)
  const totalCategorized =
    categoryTree.reduce((s, c) => s + c.amount, 0);
  // לחישוב אחוזים בכרטיסים נשתמש בסך ללא כפילות
  const totalForShare = totalCategorized;

  return (
    <div className="space-y-4">
      {categoryTree.map((cat) => (
        <CategoryCard
          key={cat.id}
          cat={cat}
          projectRevenue={projectRevenue}
          totalCategorized={totalForShare}
        />
      ))}

      <CumulativeSubsSection subs={cumulativeSubs} />

      <div className="flex justify-between items-center bg-slate-800 text-white rounded-xl p-4 font-bold">
        <span>סה&quot;כ הוצאות פרויקט</span>
        <span className="text-xl">{formatCurrency(totalCategorized)}</span>
      </div>
      <p className="text-xs text-slate-400 text-center">
        כולל ₪{cumulativePaid.toLocaleString("he-IL")} לקבלני חשבון מצטבר
      </p>
    </div>
  );
}
