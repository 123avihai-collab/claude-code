import { notFound } from "next/navigation";
import { getProject, getPurchaseOrders } from "@/lib/mock-data";
import type { PoRamdorStatus, PoUserStatus, PurchaseOrder } from "@/lib/types";

const ramdorStatusLabel: Record<PoRamdorStatus, { label: string; cls: string }> = {
  closed: { label: "סגורה", cls: "bg-green-100 text-green-700" },
  partial: { label: "סגירה חלקית", cls: "bg-amber-100 text-amber-700" },
  shipped: { label: "נשלחה", cls: "bg-orange-100 text-orange-700" },
  approved: { label: "אושרה", cls: "bg-blue-100 text-blue-700" },
  draft: { label: "טיוטא", cls: "bg-slate-200 text-slate-600" },
  cancelled: { label: "מבוטלת", cls: "bg-red-100 text-red-700" },
};

const userStatusLabel: Record<PoUserStatus, { label: string; cls: string; emoji: string }> = {
  pending: { label: "ממתינה לבדיקה", cls: "bg-slate-100 text-slate-700", emoji: "⏳" },
  verified_closed: { label: "אומתה כסגורה", cls: "bg-green-100 text-green-700", emoji: "✅" },
  awaiting_invoice: { label: "ממתינה לחשבונית", cls: "bg-orange-100 text-orange-700", emoji: "📨" },
  cancelled_unused: { label: "בוטלה - לא נוצלה", cls: "bg-red-100 text-red-700", emoji: "🚫" },
  partial_complete: { label: "סגרנו יתרה", cls: "bg-blue-100 text-blue-700", emoji: "📋" },
  invoice_pending_approval: { label: "חשבונית באישור", cls: "bg-amber-100 text-amber-700", emoji: "⚖️" },
  invoice_rejected: { label: "חשבונית נדחתה", cls: "bg-red-100 text-red-700", emoji: "❌" },
  needs_review: { label: "צריך בדיקה", cls: "bg-yellow-100 text-yellow-800", emoji: "🔍" },
};

const currencySymbol = { ILS: "₪", USD: "$", EUR: "€" };

function formatPoAmount(po: PurchaseOrder) {
  const sym = currencySymbol[po.currency];
  return `${sym}${po.totalAmount.toLocaleString("he-IL")}`;
}

export default async function ProjectPurchaseOrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const pos = getPurchaseOrders(id);

  // Aggregated stats (mock-realistic, based on actual Ramdor analysis of 2253)
  const totalPos = 108;
  const totalLines = 396;
  const totalValueClosed = 2_878_497;
  const openPosCount = 18;
  const openValue = 390_478;
  const outstandingValue = 271_781;
  const longLeadCount = pos.filter((p) => p.isLongLeadItem).length;

  const statusBreakdown: Array<{ status: PoRamdorStatus; lines: number; value: number }> = [
    { status: "closed", lines: 219, value: 2_878_497 },
    { status: "partial", lines: 73, value: 105_940 },
    { status: "cancelled", lines: 70, value: 108_937 },
    { status: "shipped", lines: 29, value: 267_138 },
    { status: "approved", lines: 3, value: 15_450 },
    { status: "draft", lines: 2, value: 1_950 },
  ];
  const totalLinesBreakdown = statusBreakdown.reduce((s, x) => s + x.lines, 0);

  return (
    <>
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border-r-4 border-blue-600">
          <p className="text-slate-500 text-sm">סה״כ הזמנות רכש</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalPos}</p>
          <p className="text-xs text-slate-400 mt-2">{totalLines} שורות פריטים</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-r-4 border-green-600">
          <p className="text-slate-500 text-sm">סגורות בהצלחה</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            ₪{(totalValueClosed / 1_000_000).toFixed(2)}M
          </p>
          <p className="text-xs text-slate-400 mt-2">219 שורות פריטים</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-r-4 border-orange-500">
          <p className="text-slate-500 text-sm">פתוחות - צריך טיפול</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">{openPosCount}</p>
          <p className="text-xs text-orange-600 mt-2">₪{openValue.toLocaleString("he-IL")}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-r-4 border-red-500">
          <p className="text-slate-500 text-sm">Long Lead Items</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{longLeadCount}</p>
          <p className="text-xs text-red-600 mt-2">דורש מעקב צמוד</p>
        </div>
      </div>

      {/* Long Lead Alert */}
      {pos.some((p) => p.isLongLeadItem) && (
        <div className="bg-gradient-to-l from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚨</span>
              <div>
                <h3 className="font-bold text-red-900 text-lg">Long Lead Items - דורש פעולה</h3>
                <p className="text-sm text-red-700">
                  הזמנות עם זמן אספקה ארוך שעלולות לעכב את הפרויקט.
                </p>
              </div>
            </div>
          </div>
          {pos
            .filter((p) => p.isLongLeadItem)
            .map((po) => (
              <div key={po.id} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold text-slate-800">
                      {po.poNumber} · {po.supplierName}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{po.itemSummary}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      📅 הוזמן: {po.orderDate} · אספקה צפויה: {po.expectedDeliveryDate}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-red-700">{formatPoAmount(po)}</p>
                    <p className="text-xs text-red-500 mt-1">פתוחה {po.daysOpen} ימים</p>
                  </div>
                </div>
                {po.userStatusReason && (
                  <p className="text-xs text-slate-600 mt-3 bg-slate-50 rounded p-2">
                    💬 {po.userStatusReason}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Status Breakdown Bar */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-slate-800 mb-4">פילוח סטטוסים (לפי שורות פריטים ב-Ramdor)</h3>
        <div className="flex h-8 rounded-lg overflow-hidden mb-3">
          {statusBreakdown.map((s) => {
            const pct = (s.lines / totalLinesBreakdown) * 100;
            const colorMap: Record<PoRamdorStatus, string> = {
              closed: "bg-green-500",
              partial: "bg-amber-500",
              shipped: "bg-orange-500",
              approved: "bg-blue-500",
              draft: "bg-slate-400",
              cancelled: "bg-red-500",
            };
            return (
              <div
                key={s.status}
                className={`${colorMap[s.status]} flex items-center justify-center text-white text-xs font-bold`}
                style={{ width: `${pct}%` }}
                title={`${ramdorStatusLabel[s.status].label}: ${s.lines} שורות`}
              >
                {pct > 8 ? s.lines : ""}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {statusBreakdown.map((s) => (
            <div key={s.status} className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${ramdorStatusLabel[s.status].cls}`}
              >
                {ramdorStatusLabel[s.status].label}
              </span>
              <span className="text-slate-600">
                {s.lines} | ₪{(s.value / 1000).toFixed(0)}K
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Open POs list */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h3 className="font-bold text-slate-800">הזמנות פתוחות - דורשות פעולה</h3>
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            {pos.length} מתוך {openPosCount} מוצגות (דמו)
          </span>
        </div>

        <div className="space-y-3">
          {pos.map((po) => {
            const ramdor = ramdorStatusLabel[po.ramdorStatus];
            const user = userStatusLabel[po.userStatus];
            return (
              <div
                key={po.id}
                className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800">{po.poNumber}</span>
                      {po.isLongLeadItem && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          🔥 Long Lead
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{po.supplierName}</p>
                    <p className="text-xs text-slate-500 mt-1">{po.itemSummary}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-slate-800">{formatPoAmount(po)}</p>
                    {po.outstandingValue !== po.totalAmount && (
                      <p className="text-xs text-orange-600">
                        יתרה: {currencySymbol[po.currency]}
                        {po.outstandingValue.toLocaleString("he-IL")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${ramdor.cls}`}>
                    Ramdor: {ramdor.label}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.cls}`}>
                    {user.emoji} {user.label}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span>
                    📅 הוזמן {po.orderDate} · יעד אספקה {po.expectedDeliveryDate}
                  </span>
                  <span className={po.daysOpen > 60 ? "text-red-600 font-bold" : "text-slate-500"}>
                    פתוחה {po.daysOpen} ימים
                  </span>
                </div>

                {po.userStatusReason && (
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded p-2">
                    💬 {po.userStatusReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
        <p className="font-bold mb-1">💡 איך זה יעבוד בפועל:</p>
        <ul className="space-y-1 mr-4 list-disc">
          <li>אתה מעלה דוח רכש מ-Ramdor → האפליקציה מייבאת אוטומטית.</li>
          <li>סטטוסים של Ramdor נקראים אוטומטית. הסטטוס שלך מוגדר ידנית פעם אחת.</li>
          <li>התראה אוטומטית על PO ב-"נשלחה" יותר מ-30 יום בלי חשבונית.</li>
          <li>קישור חכם לחשבוניות בתזרים (fuzzy match לפי ספק + סכום + תאריך).</li>
        </ul>
      </div>
    </>
  );
}
