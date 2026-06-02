"use client";

import { useState } from "react";
import {
  createCategory,
  updateCategory,
  archiveCategory,
} from "@/app/actions/categories";
import { t } from "@/lib/strings";
import type { Category } from "@/lib/db/types";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [tab, setTab] = useState<"expense" | "income">("expense");
  const list = categories.filter((c) => c.type === tab);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["expense", "income"] as const).map((tp) => (
          <button
            key={tp}
            onClick={() => setTab(tp)}
            className={`rounded-lg border px-4 py-1.5 text-sm ${
              tab === tp
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-border"
            }`}
          >
            {tp === "expense" ? t.common.expense : t.common.income}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {list.map((c) => (
          <CategoryItem key={c.id} category={c} />
        ))}
      </ul>

      <form
        action={createCategory}
        className="flex flex-wrap items-end gap-2 border-t border-border pt-4"
      >
        <input type="hidden" name="type" value={tab} />
        <label className="flex-1">
          <span className="mb-1 block text-sm text-muted">קטגוריה חדשה</span>
          <input name="name" required placeholder="שם" className="input" />
        </label>
        <input
          name="color"
          type="color"
          defaultValue="#6b7280"
          className="h-10 w-12 rounded-lg border border-border"
        />
        <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
          {t.common.add}
        </button>
      </form>
    </div>
  );
}

function CategoryItem({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li>
        <form
          action={async (fd) => {
            await updateCategory(category.id, fd);
            setEditing(false);
          }}
          className="flex flex-wrap items-center gap-2"
        >
          <input type="hidden" name="type" value={category.type} />
          <input
            name="name"
            defaultValue={category.name}
            required
            className="input flex-1"
          />
          <input
            name="color"
            type="color"
            defaultValue={category.color ?? "#6b7280"}
            className="h-9 w-11 rounded-lg border border-border"
          />
          <button className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white">
            {t.common.save}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm"
          >
            {t.common.cancel}
          </button>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 ${
        category.is_archived ? "opacity-50" : ""
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: category.color ?? "#cbd5e1" }}
        />
        {category.name}
        {category.is_archived && (
          <span className="text-xs text-muted">(בארכיון)</span>
        )}
      </span>
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setEditing(true)}
          className="text-primary hover:underline"
        >
          {t.common.edit}
        </button>
        <form action={archiveCategory.bind(null, category.id, !category.is_archived)}>
          <button className="text-muted hover:underline">
            {category.is_archived ? "שחזר" : "ארכב"}
          </button>
        </form>
      </div>
    </li>
  );
}
