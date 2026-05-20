import { useEffect, useState } from "react";
import type { ExpenseCategoryNode, ExpenseSubItem } from "./types";

// תיקוני סיווג ידניים: שם ספק -> מזהה קטגוריה.
// נשמרים בדפדפן (כמו local-bills-store) ומיושמים על עץ ההוצאות בצד הלקוח,
// כך שכל תיקון הופך לכלל קבוע שחל גם על נתונים עתידיים.
const STORAGE_PREFIX = "pm-atuan-expense-overrides-v1";
const CHANGE_EVENT = "pm-atuan-expense-overrides-changed";

export type ExpenseOverrides = Record<string, string>;

function storageKey(projectId: string): string {
  return `${STORAGE_PREFIX}-${projectId}`;
}

export function loadOverrides(projectId: string): ExpenseOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    return raw ? (JSON.parse(raw) as ExpenseOverrides) : {};
  } catch {
    return {};
  }
}

function persist(projectId: string, overrides: ExpenseOverrides): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(projectId), JSON.stringify(overrides));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function setOverride(
  projectId: string,
  supplierLabel: string,
  categoryId: string,
): ExpenseOverrides {
  const next = { ...loadOverrides(projectId), [supplierLabel]: categoryId };
  persist(projectId, next);
  return next;
}

export function removeOverride(
  projectId: string,
  supplierLabel: string,
): ExpenseOverrides {
  const next = { ...loadOverrides(projectId) };
  delete next[supplierLabel];
  persist(projectId, next);
  return next;
}

export function clearOverrides(projectId: string): ExpenseOverrides {
  persist(projectId, {});
  return {};
}

// מיישם את התיקונים: מעביר ספקים בין קטגוריות ומחשב מחדש סכומים.
// היקף ההוצאות הכולל נשמר — רק הסיווג משתנה.
export function applyOverrides(
  tree: ExpenseCategoryNode[],
  overrides: ExpenseOverrides,
): ExpenseCategoryNode[] {
  if (!overrides || Object.keys(overrides).length === 0) return tree;
  const validIds = new Set(tree.map((c) => c.id));
  const buckets: Record<string, ExpenseSubItem[]> = {};
  for (const c of tree) buckets[c.id] = [];
  for (const c of tree) {
    for (const child of c.children ?? []) {
      const requested = overrides[child.label];
      const target = requested && validIds.has(requested) ? requested : c.id;
      buckets[target].push(child);
    }
  }
  return tree.map((c) => ({
    ...c,
    children: buckets[c.id],
    amount: buckets[c.id].reduce((s, ch) => s + ch.amount, 0),
  }));
}

// Hook משותף — נטען מ-localStorage ומסתנכרן בין הרכיבים דרך אירוע חלון.
export function useExpenseOverrides(projectId: string) {
  const [overrides, setOverrides] = useState<ExpenseOverrides>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setOverrides(loadOverrides(projectId));
    sync();
    setMounted(true);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, [projectId]);

  return {
    overrides,
    mounted,
    count: Object.keys(overrides).length,
    move: (label: string, categoryId: string) =>
      setOverrides(setOverride(projectId, label, categoryId)),
    reset: (label: string) => setOverrides(removeOverride(projectId, label)),
    clearAll: () => setOverrides(clearOverrides(projectId)),
  };
}
