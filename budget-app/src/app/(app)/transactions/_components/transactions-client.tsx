"use client";

import { useState } from "react";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/app/actions/transactions";
import { exportTransactions } from "@/lib/excel/export";
import { Money } from "@/components/money";
import { formatDate, today } from "@/lib/format";
import { t } from "@/lib/strings";
import type { Category } from "@/lib/db/types";
import type { TransactionWithCategory } from "@/lib/db/queries";

export function TransactionsClient({
  month,
  categories,
  transactions,
}: {
  month: string;
  categories: Category[];
  transactions: TransactionWithCategory[];
}) {
  const [editing, setEditing] = useState<TransactionWithCategory | null>(null);
  const [open, setOpen] = useState(false);

  function openNew() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(tx: TransactionWithCategory) {
    setEditing(tx);
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={openNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          + {t.common.add}
        </button>
        <button
          onClick={() =>
            exportTransactions(transactions, `תנועות-${month.slice(0, 7)}`, "xlsx")
          }
          disabled={transactions.length === 0}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm disabled:opacity-50"
        >
          ⬇️ ייצוא Excel
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {transactions.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">{t.common.empty}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-background text-muted">
              <tr>
                <Th>{t.common.date}</Th>
                <Th>{t.common.category}</Th>
                <Th>{t.common.note}</Th>
                <Th>{t.common.amount}</Th>
                <Th> </Th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-border">
                  <Td>{formatDate(tx.occurred_on)}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: tx.categories?.color ?? "#cbd5e1" }}
                      />
                      {tx.categories?.name ?? t.common.none}
                    </span>
                  </Td>
                  <Td className="text-muted">{tx.note || t.common.none}</Td>
                  <Td>
                    <Money
                      value={Number(tx.amount)}
                      type={tx.type === "income" ? "income" : "expense"}
                    />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(tx)}
                        className="text-primary hover:underline"
                      >
                        {t.common.edit}
                      </button>
                      <form
                        action={deleteTransaction.bind(null, tx.id)}
                        onSubmit={(e) => {
                          if (!confirm(t.common.confirmDelete)) e.preventDefault();
                        }}
                      >
                        <button className="text-expense hover:underline">
                          {t.common.delete}
                        </button>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <TransactionDialog
          editing={editing}
          categories={categories}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function TransactionDialog({
  editing,
  categories,
  onClose,
}: {
  editing: TransactionWithCategory | null;
  categories: Category[];
  onClose: () => void;
}) {
  const [type, setType] = useState<"income" | "expense">(
    editing?.type ?? "expense",
  );
  const cats = categories.filter((c) => c.type === type && !c.is_archived);

  async function handle(formData: FormData) {
    if (editing) await updateTransaction(editing.id, formData);
    else await createTransaction(formData);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <form
        action={handle}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-2xl bg-card p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold">
          {editing ? t.common.edit : t.common.add} {t.nav.transactions}
        </h2>

        <input type="hidden" name="type" value={type} />
        <div className="flex gap-2">
          {(["expense", "income"] as const).map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setType(tp)}
              className={`flex-1 rounded-lg border py-2 text-sm ${
                type === tp
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border"
              }`}
            >
              {tp === "income" ? t.common.income : t.common.expense}
            </button>
          ))}
        </div>

        <Labeled label={t.common.amount}>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={editing ? Number(editing.amount) : ""}
            className="input"
          />
        </Labeled>

        <Labeled label={t.common.category}>
          <select
            name="category_id"
            defaultValue={editing?.category_id ?? ""}
            className="input"
          >
            <option value="">{t.common.none}</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Labeled>

        <Labeled label={t.common.date}>
          <input
            name="occurred_on"
            type="date"
            required
            defaultValue={editing?.occurred_on ?? today()}
            className="input"
          />
        </Labeled>

        <Labeled label={t.common.note}>
          <input
            name="note"
            type="text"
            defaultValue={editing?.note ?? ""}
            className="input"
          />
        </Labeled>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary py-2 font-medium text-white"
          >
            {t.common.save}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2"
          >
            {t.common.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 text-start font-medium">{children}</th>;
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}
