"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { t } from "@/lib/strings";

const LINKS = [
  { href: "/dashboard", label: t.nav.dashboard, icon: "📊" },
  { href: "/transactions", label: t.nav.transactions, icon: "💸" },
  { href: "/budgets", label: t.nav.budgets, icon: "🎯" },
  { href: "/reports", label: t.nav.reports, icon: "📈" },
  { href: "/forecast", label: t.nav.forecast, icon: "🔮" },
  { href: "/settings", label: t.nav.settings, icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-border bg-card p-2 md:h-dvh md:w-56 md:flex-col md:gap-1 md:border-e md:p-4">
      <div className="hidden px-2 pb-4 md:block">
        <span className="text-lg font-bold text-primary">{t.appName}</span>
      </div>

      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-primary text-white"
                : "text-foreground hover:bg-background"
            }`}
          >
            <span aria-hidden>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        );
      })}

      <form action={logout} className="md:mt-auto">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-background"
        >
          <span aria-hidden>🚪</span>
          <span>{t.nav.logout}</span>
        </button>
      </form>
    </nav>
  );
}
