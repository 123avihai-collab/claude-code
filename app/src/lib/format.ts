export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (Math.abs(amount) >= 1_000_000) return `₪${(amount / 1_000_000).toFixed(2)}M`;
    if (Math.abs(amount) >= 1_000) return `₪${Math.round(amount / 1_000)}K`;
  }
  return `₪${amount.toLocaleString("he-IL")}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
