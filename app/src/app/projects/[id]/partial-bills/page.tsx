import { notFound } from "next/navigation";
import { getProject, getPartialBills } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { BillsTable } from "@/components/bills-table";
import type { ExceptionStatus, PartialBill } from "@/lib/types";

const exceptionStatusMap: Record<ExceptionStatus, { label: string; cls: string; emoji: string }> = {
  approved: { label: "אושר", cls: "bg-green-100 text-green-700", emoji: "✅" },
  pending_inspector: { label: "ממתין למפקח", cls: "bg-amber-100 text-amber-700", emoji: "⏳" },
  in_review: { label: "בבדיקה", cls: "bg-blue-100 text-blue-700", emoji: "🔍" },
  rejected: { label: "נדחה", cls: "bg-red-100 text-red-700", emoji: "❌" },
  needs_documentation: { label: "דורש תיעוד", cls: "bg-orange-100 text-orange-700", emoji: "📋" },
};

function ExceptionsPanel({ bills, totalRevenue }: { bills: PartialBill[]; totalRevenue: number }) {
  const billsWithExceptions = bills.filter((b) => b.exceptions && b.exceptions.length > 0);
  const totalExceptions = billsWithExceptions.reduce(
    (s, b) => s + (b.exceptionsTotal ?? 0),
    0,
  );
  const approvedTotal = billsWithExceptions.reduce(
    (s, b) =>
      s +
      (b.exceptions ?? []).filter((e) => e.status === "approved").reduce((x, e) => x + e.amount, 0),
    0,
  );
  const pendingTotal = totalExceptions - approvedTotal;
  const pctOfRevenue = totalRevenue > 0 ? (totalExceptions / totalRevenue) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-5 mb-6 border-t-4 border-orange-500">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-slate-800">מעקב חריגים / סעיפים נוספים</h3>
            <p className="text-xs text-slate-500">פירוט סעיפים חריגים פר חשבון חלקי</p>
          </div>
        </div>
        <button className="text-xs bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700">
          + הוסף חריג
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">סך חריגים</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(totalExceptions)}</p>
          <p className="text-xs text-orange-600 mt-1">{pctOfRevenue.toFixed(1)}% מההכנסות</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">אושר ע&quot;י מפקח</p>
          <p className="text-xl font-bold text-green-700">{formatCurrency(approvedTotal)}</p>
          <p className="text-xs text-green-600 mt-1">
            {totalExceptions > 0 ? `${Math.round((approvedTotal / totalExceptions) * 100)}%` : "—"} מהחריגים
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">בהמתנה / בבדיקה</p>
          <p className="text-xl font-bold text-amber-700">{formatCurrency(pendingTotal)}</p>
          <p className="text-xs text-amber-600 mt-1">צריך מעקב</p>
        </div>
      </div>

      {/* Per-bill exception details */}
      {billsWithExceptions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">אין חריגים רשומים בחשבונות</p>
      ) : (
        <div className="space-y-4">
          {billsWithExceptions.map((b) => {
            const billExceptionsTotal = b.exceptionsTotal ?? 0;
            const billExceptionsPct = (billExceptionsTotal / b.amountBeforeVat) * 100;
            return (
              <div key={b.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <span className="font-bold text-slate-800">
                      חשבון {b.billNumber} · {b.periodLabel}
                    </span>
                    <span className="text-xs text-slate-500 mr-2">
                      ({b.exceptions?.length ?? 0} חריגים · {billExceptionsPct.toFixed(1)}% מהחשבון)
                    </span>
                  </div>
                  <span className="font-bold text-orange-700">
                    {formatCurrency(billExceptionsTotal)}
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  {(b.exceptions ?? []).map((ex) => {
                    const s = exceptionStatusMap[ex.status];
                    return (
                      <div
                        key={ex.id}
                        className="flex justify-between items-start gap-3 p-3 bg-white border border-slate-100 rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-800">{ex.description}</span>
                            {ex.itemCode && (
                              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                {ex.itemCode}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-slate-500">
                            {ex.inspectorName && (
                              <span>👤 {ex.inspectorName}</span>
                            )}
                            {ex.submittedDate && <span>· הוגש {ex.submittedDate}</span>}
                            {ex.approvedDate && <span>· אושר {ex.approvedDate}</span>}
                          </div>
                          {ex.inspectorNote && (
                            <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded p-2">
                              💬 {ex.inspectorNote}
                            </p>
                          )}
                        </div>
                        <div className="text-left whitespace-nowrap">
                          <p className="font-bold text-slate-800">{formatCurrency(ex.amount)}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${s.cls}`}
                          >
                            {s.emoji} {s.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default async function PartialBillsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const bills = getPartialBills(id);

  const totalBeforeVat = bills.reduce((s, b) => s + b.amountBeforeVat, 0);
  const totalWithVat = bills.reduce((s, b) => s + b.amountWithVat, 0);
  const totalPaid = bills
    .filter((b) => b.status === "paid")
    .reduce((s, b) => s + b.amountWithVat, 0);
  const totalPending = bills
    .filter((b) => b.status === "approved" || b.status === "submitted")
    .reduce((s, b) => s + b.amountWithVat, 0);
  const totalOverdue = bills
    .filter((b) => b.status === "overdue")
    .reduce((s, b) => s + b.amountWithVat, 0);

  return (
    <>
      {/* Single consolidated summary row */}
      <ConsolidatedSummary
        bills={bills}
        totalBeforeVat={totalBeforeVat}
        totalWithVat={totalWithVat}
        totalPaid={totalPaid}
        totalPending={totalPending}
      />

      {/* Overdue alert */}
      {totalOverdue > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-3xl">🚨</span>
          <div>
            <p className="font-bold text-red-900">חשבונות באיחור — {formatCurrency(totalOverdue, true)}</p>
            <p className="text-sm text-red-700">לוודא עם המזמין למה התשלום מתעכב</p>
          </div>
        </div>
      )}

      {/* Bills table — with expandable BoQ rows */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-slate-800">פירוט {bills.length} החשבונות</h3>
            <p className="text-xs text-slate-500 mt-1">
              לחץ על שורה ▾ להצגת סעיפי כתב הכמויות שנכללו בחשבון
            </p>
          </div>
          <button className="text-xs bg-[#1F3864] text-white px-3 py-2 rounded-lg hover:bg-[#2F5597]">
            + חשבון חלקי חדש
          </button>
        </div>

        <BillsTable
          bills={bills}
          projectRevenue={project.revenue}
          totalBeforeVat={totalBeforeVat}
          totalWithVat={totalWithVat}
        />
      </div>

      {/* Exceptions / Overage tracking */}
      <ExceptionsPanel bills={bills} totalRevenue={totalBeforeVat} />


      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
        <p className="font-bold mb-1">💡 איך זה יעבוד בפועל:</p>
        <ul className="space-y-1 mr-4 list-disc">
          <li>אתה מעלה את הקובץ Master שלך → 7 השורות מגליון &quot;גיליונות שירות&quot; נכנסות אוטומטית.</li>
          <li>חישוב מצטבר אוטומטי + % מהחוזה.</li>
          <li>התראה לפני תאריך פירעון, התראה אדומה אם באיחור.</li>
          <li>סטטוס מתעדכן ידנית: טיוטא → הוגש → אושר → שולם.</li>
          <li>(Phase מאוחר) ייצוא PDF להגשה רשמית למזמין.</li>
        </ul>
      </div>
    </>
  );
}

function ConsolidatedSummary({
  bills,
  totalBeforeVat,
  totalWithVat,
  totalPaid,
  totalPending,
}: {
  bills: PartialBill[];
  totalBeforeVat: number;
  totalWithVat: number;
  totalPaid: number;
  totalPending: number;
}) {
  const latest = bills.length > 0
    ? bills.reduce((a, b) => (a.billNumber > b.billNumber ? a : b))
    : null;
  if (!latest) return null;

  const grossSubmitted = latest.cumulativeGrossAmount ?? totalBeforeVat;
  const iaiHeld = latest.iaiCumulativeRetention ?? 0;
  const yrnHeld = latest.yrnCumulativeRetention ?? 0;

  const cells: Array<{ label: string; value: number; color: string; sub?: string }> = [
    { label: "סך הכל מוגש", value: grossSubmitted, color: "text-slate-800" },
    { label: 'עיכבון תע"א', value: -iaiHeld, color: "text-red-700", sub: "10% מהמוגש" },
    { label: 'עיכבון י.ר.ן', value: -yrnHeld, color: "text-orange-700", sub: "5% נוסף" },
    { label: "סך חיובים", value: totalBeforeVat, color: "text-slate-800", sub: `${bills.length} חשבונות` },
    { label: 'סך כולל מע"מ', value: totalWithVat, color: "text-slate-800", sub: "למזמין" },
    { label: "שולם בפועל", value: totalPaid, color: "text-green-700", sub: `${Math.round((totalPaid / totalWithVat) * 100)}% מהכולל` },
    { label: "ממתין לתשלום", value: totalPending, color: "text-amber-700", sub: "לפי פירעון" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 overflow-x-auto">
      <div className="flex items-stretch gap-1 min-w-max">
        {cells.map((cell, idx) => (
          <div key={idx} className={`flex-1 min-w-[110px] px-3 py-2 ${idx < cells.length - 1 ? "border-l border-slate-200" : ""}`}>
            <p className="text-xs text-slate-500 whitespace-nowrap">{cell.label}</p>
            <p className={`text-lg font-bold ${cell.color} mt-0.5 whitespace-nowrap`}>
              {cell.value < 0 ? "−" : ""}{formatCurrency(Math.abs(cell.value), true)}
            </p>
            {cell.sub && <p className="text-xs text-slate-400 mt-0.5">{cell.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function _UnusedRetentionsSummary({ bills }: { bills: PartialBill[] }) {
  const latest = bills.length > 0
    ? bills.reduce((a, b) => (a.billNumber > b.billNumber ? a : b))
    : null;
  if (!latest) return null;

  const iaiHeld = latest.iaiCumulativeRetention ?? 0;
  const yrnHeld = latest.yrnCumulativeRetention ?? 0;
  const totalHeld = iaiHeld + yrnHeld;
  const grossSoFar = latest.cumulativeGrossAmount ?? 0;
  const netSoFar = latest.netAfterRetentions ?? latest.cumulativeBeforeVat;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🔒</span>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">עיכבונות — כסף שעוד לא הגיע אליך</h3>
          <p className="text-xs text-slate-600">סך הכסף שלסיכו חתמה עליו אבל עדיין מוחזק אצל תע&quot;א וי.ר.ן (יוחזר בסוף הפרויקט + תקופת בדק)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-amber-200">
          <p className="text-xs text-slate-500 mb-1">ברוטו מצטבר</p>
          <p className="text-lg font-bold text-slate-800">{formatCurrency(grossSoFar, true)}</p>
          <p className="text-xs text-slate-400 mt-1">סה&quot;כ עבודות שאושרו</p>
        </div>
        <div className="bg-white rounded-lg p-3 border-r-4 border-red-500">
          <p className="text-xs text-slate-500 mb-1">עיכבון תע&quot;א (10%)</p>
          <p className="text-lg font-bold text-red-700">{formatCurrency(iaiHeld, true)}</p>
          <p className="text-xs text-slate-400 mt-1">מוחזק ע&quot;י המזמין</p>
        </div>
        <div className="bg-white rounded-lg p-3 border-r-4 border-orange-500">
          <p className="text-xs text-slate-500 mb-1">עיכבון י.ר.ן (5%)</p>
          <p className="text-lg font-bold text-orange-700">{formatCurrency(yrnHeld, true)}</p>
          <p className="text-xs text-slate-400 mt-1">מוחזק ע&quot;י הקבלן הראשי</p>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-3">
          <p className="text-xs text-slate-300 mb-1">סך הכסף שעוד מגיע</p>
          <p className="text-xl font-bold">{formatCurrency(totalHeld, true)}</p>
          <p className="text-xs text-slate-400 mt-1">{((totalHeld / grossSoFar) * 100).toFixed(1)}% מהברוטו</p>
        </div>
      </div>

      <div className="bg-white/60 rounded-lg p-3 text-xs text-slate-700">
        <p className="font-bold mb-1">📊 חישוב — חשבון {latest.billNumber}:</p>
        <p>
          ברוטו ₪{grossSoFar.toLocaleString("he-IL")}
          {" − "}
          עיכבון תע&quot;א ₪{iaiHeld.toLocaleString("he-IL")} (10%)
          {" − "}
          עיכבון י.ר.ן ₪{yrnHeld.toLocaleString("he-IL")} (5%)
          {" = "}
          <strong>נטו מצטבר ₪{netSoFar.toLocaleString("he-IL")}</strong>
        </p>
      </div>
    </div>
  );
}
