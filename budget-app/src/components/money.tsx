import { formatMoney } from "@/lib/format";

/** הצגת סכום בש"ח עם צביעה לפי סוג. */
export function Money({
  value,
  type,
  className = "",
}: {
  value: number;
  type?: "income" | "expense" | "neutral";
  className?: string;
}) {
  const color =
    type === "income"
      ? "text-income"
      : type === "expense"
        ? "text-expense"
        : "";
  return (
    <span className={`tabular-nums ${color} ${className}`}>
      {formatMoney(value)}
    </span>
  );
}
