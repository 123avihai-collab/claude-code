import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AuthGuard } from "@/components/auth-guard";
import { alerts, projects, tasks } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

const accentBorderMap: Record<string, string> = {
  blue: "border-blue-600",
  purple: "border-purple-500",
  emerald: "border-emerald-500",
};
const accentProgressMap: Record<string, string> = {
  blue: "bg-orange-500",
  purple: "bg-purple-500",
  emerald: "bg-emerald-500",
};
const statusBadgeMap = {
  active: { label: "פעיל", className: "bg-green-100 text-green-700" },
  "almost-done": { label: "כמעט גמור", className: "bg-amber-100 text-amber-700" },
  paused: { label: "בהקפאה", className: "bg-slate-200 text-slate-600" },
  completed: { label: "הושלם", className: "bg-slate-100 text-slate-500" },
};

export default function HomePage() {
  const urgentAlerts = alerts.slice(0, 4);

  return (
    <AuthGuard>
      <SiteHeader />
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">שלום, אביחי 👋</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              יש לך {projects.filter((p) => p.status === "active").length} פרויקטים פעילים ·{" "}
              {tasks.filter((t) => !t.done && (t.urgency === "today" || t.urgency === "tomorrow")).length}{" "}
              משימות דחופות · {alerts.filter((a) => a.type === "critical").length} התראות
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial bg-white border border-slate-200 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-slate-50 whitespace-nowrap">
              📥 ייבא מ-Excel
            </button>
            <button className="flex-1 sm:flex-initial bg-[#1F3864] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-[#2F5597] whitespace-nowrap">
              + פרויקט חדש
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 hidden">
          {/* removed per user request - KPI strip (revenue / monthly expenses / cashflow / action items) — not relevant right now */}
        </div>

        <div className="card-hover bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-3 mb-6 border border-indigo-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="text-sm font-bold text-slate-800 whitespace-nowrap">סוכן AI</span>
            <input
              type="text"
              disabled
              placeholder="שאל כל שאלה על הפרויקטים..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white/70 text-sm cursor-not-allowed min-w-0"
            />
            <button
              disabled
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm cursor-not-allowed opacity-50 whitespace-nowrap"
            >
              שלח
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-800 text-lg">הפרויקטים שלי</h3>
          <div className="flex gap-2 text-sm">
            <button className="px-3 py-1 bg-[#1F3864] text-white rounded-full">
              פעילים ({projects.length})
            </button>
            <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200">
              הושלמו (0)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {projects.map((p) => {
            const pct = Math.round((p.actualSpent / p.revenue) * 100);
            const badge = statusBadgeMap[p.status];
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`card-hover bg-white rounded-2xl p-5 cursor-pointer border-t-4 ${accentBorderMap[p.accentColor]} block`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                    <h4 className="font-bold text-slate-800 mt-2 text-lg">{p.name}</h4>
                    <p className="text-xs text-slate-500">
                      לקוח: {p.client} · החל {p.startDate}
                    </p>
                  </div>
                  <div className="text-2xl">{p.icon}</div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">הכנסות</span>
                    <span className="font-bold">{formatCurrency(p.revenue, true)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">הוצא</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(p.actualSpent, true)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                    <div
                      className={`${accentProgressMap[p.accentColor]} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-2 border-t mt-3">
                    <span>
                      📋 {p.tasksCount} משימות{" "}
                      {p.urgentCount > 0 ? (
                        <span className="text-red-600">· ⚠️ {p.urgentCount} דחוף</span>
                      ) : (
                        <span className="text-green-600">· ✓ ללא דחיפות</span>
                      )}
                    </span>
                    <span className="text-blue-600 font-bold">פתח ←</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="card-hover bg-white rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">🚨 דחוף - כל הפרויקטים</h3>
            <span className="text-xs text-slate-500">{urgentAlerts.length} פריטים שדורשים פעולה</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {urgentAlerts.map((a) => {
              const bg =
                a.type === "critical"
                  ? "bg-red-50 border-r-2 border-red-500"
                  : a.type === "warning"
                  ? "bg-amber-50 border-r-2 border-amber-500"
                  : a.type === "success"
                  ? "bg-green-50 border-r-2 border-green-500"
                  : "bg-blue-50 border-r-2 border-blue-500";
              return (
                <div key={a.id} className={`flex gap-2 p-3 rounded-lg ${bg}`}>
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{a.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        Beta · בנייה הדרגתית
      </footer>
    </AuthGuard>
  );
}
