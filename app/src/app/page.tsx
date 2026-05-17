import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AuthGuard } from "@/components/auth-guard";
import { alerts, projects, tasks } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { CombinedCashflowChart } from "@/components/charts/combined-cashflow-chart";

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

const quickActions = [
  { icon: "💸", label: "הוצאה חדשה" },
  { icon: "💰", label: "תשלום קבלן" },
  { icon: "📋", label: "משימה חדשה" },
  { icon: "📸", label: "צלם חשבונית" },
  { icon: "📅", label: "תיאום פגישה" },
  { icon: "📊", label: "דוח חודשי" },
];

export default function HomePage() {
  const totalRevenue = projects.reduce((s, p) => s + p.revenue, 0);
  const totalSpent = projects.reduce((s, p) => s + p.actualSpent, 0);
  const totalProfit = totalRevenue - totalSpent;
  const upcomingTasks = tasks.filter((t) => !t.done).slice(0, 5);
  const urgentAlerts = alerts.slice(0, 4);

  return (
    <AuthGuard>
      <SiteHeader />
      <main className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">שלום, אבי 👋</h1>
            <p className="text-slate-500 text-sm mt-1">
              יש לך {projects.filter((p) => p.status === "active").length} פרויקטים פעילים ·{" "}
              {tasks.filter((t) => !t.done && (t.urgency === "today" || t.urgency === "tomorrow")).length}{" "}
              משימות דחופות · {alerts.filter((a) => a.type === "critical").length} התראות
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
              📥 ייבא מ-Excel
            </button>
            <button className="bg-[#1F3864] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2F5597]">
              + פרויקט חדש
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-hover bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5">
            <p className="text-blue-100 text-sm">סך הכנסות (מצטבר)</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue, true)}</p>
            <p className="text-xs text-blue-100 mt-2">על-פני {projects.length} פרויקטים</p>
          </div>
          <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500">
            <p className="text-slate-500 text-sm">סך הוצאות החודש</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₪412K</p>
            <p className="text-xs text-orange-600 mt-2">↑ 8% מהחודש שעבר</p>
          </div>
          <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-green-600">
            <p className="text-slate-500 text-sm">תזרים נטו</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">+₪183K</p>
            <p className="text-xs text-green-600 mt-2">חיובי החודש</p>
          </div>
          <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-red-500">
            <p className="text-slate-500 text-sm">דורש פעולה</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">8</p>
            <p className="text-xs text-red-600 mt-2">תשלומים + משימות</p>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800">פעולות מהירות</h3>
            <span className="text-xs text-slate-400">קיצורי דרך לפעולות שגרתיות</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="card-hover bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded-xl p-3 text-center"
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <p className="text-xs font-medium text-slate-700">{a.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card-hover bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6 border-2 border-dashed border-indigo-200">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <h3 className="font-bold text-slate-800">סוכן AI - שאל על כל הפרויקטים</h3>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              בפיתוח · פאזה 5
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div className="bg-white rounded-lg p-2 text-xs text-slate-700 border border-slate-200">
              💭 &quot;כמה הוצאתי החודש בכל הפרויקטים?&quot;
            </div>
            <div className="bg-white rounded-lg p-2 text-xs text-slate-700 border border-slate-200">
              💭 &quot;השווה בין 2253 ל-2288&quot;
            </div>
            <div className="bg-white rounded-lg p-2 text-xs text-slate-700 border border-slate-200">
              💭 &quot;תמצא חשבוניות ממנדלסון בכל הפרויקטים&quot;
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              disabled
              placeholder="שאל כל שאלה על כל הפרויקטים..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white/60 text-sm cursor-not-allowed"
            />
            <button
              disabled
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="card-hover bg-white rounded-2xl p-5 lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-4">תזרים כולל - כל הפרויקטים</h3>
            <CombinedCashflowChart />
          </div>

          <div className="card-hover bg-white rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-4">דחוף - כל הפרויקטים</h3>
            <div className="space-y-2">
              {urgentAlerts.map((a) => {
                const bg =
                  a.type === "critical"
                    ? "bg-red-50"
                    : a.type === "warning"
                    ? "bg-amber-50"
                    : a.type === "success"
                    ? "bg-green-50"
                    : "bg-blue-50";
                return (
                  <div key={a.id} className={`flex gap-2 p-2 rounded-lg ${bg}`}>
                    <span className="text-lg">{a.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">משימות השבוע - על-פני כל הפרויקטים</h3>
            <span className="text-xs text-blue-600 hover:underline cursor-pointer">
              צפה בכל המשימות ←
            </span>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((t) => {
              const project = projects.find((p) => p.id === t.projectId);
              const projTag =
                project?.accentColor === "blue"
                  ? "bg-blue-100 text-blue-700"
                  : project?.accentColor === "purple"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-emerald-100 text-emerald-700";
              const urgencyColor =
                t.urgency === "today"
                  ? "text-red-600"
                  : t.urgency === "tomorrow"
                  ? "text-amber-600"
                  : "text-blue-600";
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600"
                    defaultChecked={t.done}
                  />
                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${projTag}`}
                  >
                    {project?.name}
                  </span>
                  <p className="flex-1 text-sm">{t.title}</p>
                  <span className={`text-xs font-bold ${urgencyColor}`}>{t.dueDate}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        נתוני mock · MVP גרסה ראשונית
      </footer>
    </AuthGuard>
  );
}
