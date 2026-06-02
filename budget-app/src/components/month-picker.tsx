"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatMonth, shiftMonth } from "@/lib/format";

/** בורר חודש שמעדכן את פרמטר ה-?month= ב-URL. */
export function MonthPicker({ month }: { month: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function go(delta: number) {
    const next = shiftMonth(month, delta);
    const sp = new URLSearchParams(params);
    sp.set("month", next);
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => go(-1)}
        aria-label="חודש קודם"
        className="rounded-lg border border-border bg-card px-3 py-1.5 hover:bg-background"
      >
        ›
      </button>
      <span className="min-w-32 text-center font-medium">
        {formatMonth(month)}
      </span>
      <button
        onClick={() => go(1)}
        aria-label="חודש הבא"
        className="rounded-lg border border-border bg-card px-3 py-1.5 hover:bg-background"
      >
        ‹
      </button>
    </div>
  );
}
