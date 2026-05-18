import type { PartialBill, PartialBillStatus } from "./types";

const STORAGE_PREFIX = "pm-atuan-local-bills-v1";

function storageKey(projectId: string): string {
  return `${STORAGE_PREFIX}-${projectId}`;
}

export function loadLocalBills(projectId: string): PartialBill[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    if (!raw) return [];
    return JSON.parse(raw) as PartialBill[];
  } catch {
    return [];
  }
}

export function saveLocalBills(projectId: string, bills: PartialBill[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(projectId), JSON.stringify(bills));
}

export function appendLocalBill(projectId: string, bill: PartialBill): PartialBill[] {
  const existing = loadLocalBills(projectId);
  const next = [...existing, bill];
  saveLocalBills(projectId, next);
  return next;
}

export function removeLocalBill(projectId: string, billId: string): PartialBill[] {
  const existing = loadLocalBills(projectId);
  const next = existing.filter((b) => b.id !== billId);
  saveLocalBills(projectId, next);
  return next;
}

export type NewBillInput = {
  billNumber: number;
  periodLabel: string;
  invoiceNumber: string;
  invoiceDate: string;
  grossAmountThisBill: number;
  iaiRetentionRate: number; // 0..1
  yrnRetentionRate: number; // 0..1
  paymentDueDate: string;
  status: PartialBillStatus;
  notes?: string;
};

export function buildBillFromInput(
  projectId: string,
  input: NewBillInput,
  previousCumulativeBeforeVat: number,
  previousCumulativeGross: number,
  previousIaiCumulative: number,
  previousYrnCumulative: number,
): PartialBill {
  const gross = input.grossAmountThisBill;
  const iaiCurrent = Math.round(gross * input.iaiRetentionRate * 100) / 100;
  const afterIai = gross - iaiCurrent;
  const yrnCurrent = Math.round(afterIai * input.yrnRetentionRate * 100) / 100;
  const amountBeforeVat = Math.round((afterIai - yrnCurrent) * 100) / 100;
  const vatRate = 0.18;
  const amountWithVat = Math.round(amountBeforeVat * (1 + vatRate) * 100) / 100;

  return {
    id: `local-${projectId}-${input.billNumber}-${Date.now()}`,
    projectId,
    billNumber: input.billNumber,
    periodLabel: input.periodLabel,
    invoiceNumber: input.invoiceNumber,
    invoiceDate: input.invoiceDate,
    amountBeforeVat,
    vatRate,
    amountWithVat,
    cumulativeBeforeVat: previousCumulativeBeforeVat + amountBeforeVat,
    paymentDueDate: input.paymentDueDate,
    status: input.status,
    grossAmountThisBill: gross,
    cumulativeGrossAmount: previousCumulativeGross + gross,
    iaiCurrentRetention: iaiCurrent,
    iaiCumulativeRetention: previousIaiCumulative + iaiCurrent,
    yrnCurrentRetention: yrnCurrent,
    yrnCumulativeRetention: previousYrnCumulative + yrnCurrent,
    netAfterRetentions: previousCumulativeBeforeVat + amountBeforeVat,
    notes: input.notes,
  };
}
