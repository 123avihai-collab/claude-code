"use client";

import { useEffect, useState } from "react";
import type { PartialBill } from "@/lib/types";
import { BillsTable } from "@/components/bills-table";
import { AddBillModal } from "@/components/add-bill-modal";
import {
  loadLocalBills,
  appendLocalBill,
  removeLocalBill,
} from "@/lib/local-bills-store";

export function BillsSection({
  projectId,
  projectRevenue,
  serverBills,
}: {
  projectId: string;
  projectRevenue: number;
  serverBills: PartialBill[];
}) {
  const [localBills, setLocalBills] = useState<PartialBill[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocalBills(loadLocalBills(projectId));
    setMounted(true);
  }, [projectId]);

  const allBills = [...serverBills, ...localBills].sort(
    (a, b) => a.billNumber - b.billNumber,
  );
  const totalBeforeVat = allBills.reduce((s, b) => s + b.amountBeforeVat, 0);
  const totalWithVat = totalBeforeVat * 1.18;

  function handleCreated(bill: PartialBill) {
    const next = appendLocalBill(projectId, bill);
    setLocalBills(next);
    setShowModal(false);
  }

  function handleDeleteLocal(billId: string) {
    if (!confirm("למחוק את החשבון הזה (מקומי בלבד)?")) return;
    const next = removeLocalBill(projectId, billId);
    setLocalBills(next);
  }

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-5 mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2 sm:gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 flex-wrap">
            פירוט {allBills.length} החשבונות
            {mounted && localBills.length > 0 && (
              <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                💾 {localBills.length} מקומיים
              </span>
            )}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
            לחץ על חשבון להצגת סעיפי כתב הכמויות
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs bg-[#1F3864] text-white px-3 py-2 rounded-lg hover:bg-[#2F5597] whitespace-nowrap shrink-0"
        >
          + חשבון חלקי חדש
        </button>
      </div>

      <BillsTable
        bills={allBills}
        projectRevenue={projectRevenue}
        totalBeforeVat={totalBeforeVat}
        totalWithVat={totalWithVat}
      />

      {mounted && localBills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-2">
            חשבונות מקומיים (נשמרו בדפדפן בלבד):
          </p>
          <div className="flex flex-wrap gap-2">
            {localBills.map((b) => (
              <div
                key={b.id}
                className="text-xs bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-2"
              >
                <span>חשבון {b.billNumber} · {b.periodLabel}</span>
                <button
                  onClick={() => handleDeleteLocal(b.id)}
                  className="text-red-500 hover:text-red-700"
                  title="מחק"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <AddBillModal
          projectId={projectId}
          existingBills={allBills}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
