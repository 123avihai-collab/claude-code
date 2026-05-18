"use client";

import { useState } from "react";
import type { PartialBill, PartialBillStatus } from "@/lib/types";
import { buildBillFromInput, type NewBillInput } from "@/lib/local-bills-store";
import { formatCurrency } from "@/lib/format";

const statusOptions: { value: PartialBillStatus; label: string }[] = [
  { value: "draft", label: "טיוטא" },
  { value: "submitted", label: "הוגש" },
  { value: "approved", label: "אושר - ממתין לתשלום" },
  { value: "paid", label: "שולם" },
  { value: "rejected", label: "נדחה" },
  { value: "overdue", label: "באיחור" },
];

export function AddBillModal({
  projectId,
  existingBills,
  onClose,
  onCreated,
}: {
  projectId: string;
  existingBills: PartialBill[];
  onClose: () => void;
  onCreated: (bill: PartialBill) => void;
}) {
  const latest = existingBills.length
    ? existingBills.reduce((a, b) => (a.billNumber > b.billNumber ? a : b))
    : null;

  const suggestedNumber = (latest?.billNumber ?? 0) + 1;
  const prevCumNet = latest?.cumulativeBeforeVat ?? 0;
  const prevCumGross = latest?.cumulativeGrossAmount ?? 0;
  const prevIai = latest?.iaiCumulativeRetention ?? 0;
  const prevYrn = latest?.yrnCumulativeRetention ?? 0;

  const today = new Date().toISOString().slice(0, 10);

  const [billNumber, setBillNumber] = useState(suggestedNumber);
  const [periodLabel, setPeriodLabel] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [gross, setGross] = useState<number>(0);
  const [iaiRate, setIaiRate] = useState<number>(10);
  const [yrnRate, setYrnRate] = useState<number>(5);
  const [paymentDueDate, setPaymentDueDate] = useState("");
  const [status, setStatus] = useState<PartialBillStatus>("draft");
  const [notes, setNotes] = useState("");

  // Live preview
  const iaiAmount = (gross * iaiRate) / 100;
  const afterIai = gross - iaiAmount;
  const yrnAmount = (afterIai * yrnRate) / 100;
  const netBeforeVat = afterIai - yrnAmount;
  const withVat = netBeforeVat * 1.18;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!periodLabel || !invoiceNumber || gross <= 0) return;

    const input: NewBillInput = {
      billNumber,
      periodLabel,
      invoiceNumber,
      invoiceDate,
      grossAmountThisBill: gross,
      iaiRetentionRate: iaiRate / 100,
      yrnRetentionRate: yrnRate / 100,
      paymentDueDate,
      status,
      notes: notes || undefined,
    };

    const bill = buildBillFromInput(
      projectId,
      input,
      prevCumNet,
      prevCumGross,
      prevIai,
      prevYrn,
    );
    onCreated(bill);
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-bold text-slate-800">
            ➕ הזנת חשבון חלקי חדש
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none"
            aria-label="סגור"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Row 1: bill number + period */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                מספר חשבון
              </label>
              <input
                type="number"
                value={billNumber}
                onChange={(e) => setBillNumber(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                min={1}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                תקופה <span className="text-slate-400">(לדוגמה: אפריל 2026)</span>
              </label>
              <input
                type="text"
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
            </div>
          </div>

          {/* Row 2: invoice number + date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                מספר חשבונית
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                placeholder="IV250000XXX"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                תאריך חשבונית
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
            </div>
          </div>

          {/* Row 3: gross + retentions */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                סך ברוטו לחשבון (לפני עיכבונות, לפני מע&quot;מ)
              </label>
              <input
                type="number"
                value={gross || ""}
                onChange={(e) => setGross(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base font-bold"
                min={0}
                step={0.01}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  עיכבון תע&quot;א (%)
                </label>
                <input
                  type="number"
                  value={iaiRate}
                  onChange={(e) => setIaiRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  min={0}
                  max={100}
                  step={0.01}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  עיכבון י.ר.ן (%)
                </label>
                <input
                  type="number"
                  value={yrnRate}
                  onChange={(e) => setYrnRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  min={0}
                  max={100}
                  step={0.01}
                />
              </div>
            </div>
          </div>

          {/* Live preview */}
          {gross > 0 && (
            <div className="bg-white border-2 border-amber-300 rounded-lg p-4">
              <h4 className="font-bold text-amber-800 text-sm mb-3">
                🧮 תצוגה מקדימה של החישוב
              </h4>
              <div className="text-sm space-y-1.5">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>סך ברוטו</span>
                  <span className="font-bold">{formatCurrency(gross)}</span>
                </div>
                <div className="flex justify-between text-red-700 border-b border-slate-100 pb-1">
                  <span>− עיכבון תע&quot;א ({iaiRate}%)</span>
                  <span className="font-mono">−{formatCurrency(iaiAmount)}</span>
                </div>
                <div className="flex justify-between text-orange-700 border-b border-slate-100 pb-1">
                  <span>− עיכבון י.ר.ן ({yrnRate}%)</span>
                  <span className="font-mono">−{formatCurrency(yrnAmount)}</span>
                </div>
                <div className="flex justify-between font-bold bg-slate-800 text-white rounded p-2 mt-2">
                  <span>נטו לפני מע&quot;מ</span>
                  <span>{formatCurrency(netBeforeVat)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs pt-1">
                  <span>+ מע&quot;מ 18% (סופי)</span>
                  <span>{formatCurrency(withVat)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Row 4: payment due + status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                תאריך פירעון
              </label>
              <input
                type="date"
                value={paymentDueDate}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                סטטוס
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PartialBillStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              הערות (אופציונלי)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="הערות פנימיות..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t">
            <p className="text-xs text-slate-500">
              💾 נשמר ב-localStorage של הדפדפן · יעבור ל-Firestore בסשן הבא
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                ביטול
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#1F3864] text-white rounded-lg hover:bg-[#2F5597] font-bold"
              >
                💾 שמור חשבון
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
