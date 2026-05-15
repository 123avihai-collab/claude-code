import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProjectCashflowChart } from "@/components/charts/project-cashflow-chart";
import { CategoryChart } from "@/components/charts/category-chart";
import {
  alerts,
  contractors,
  expenseCategoriesByProject,
  getProject,
  inventory,
  projects,
  tasks,
  transactions,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/format";

const statusBadgeMap = {
  active: { label: "פעיל", className: "bg-green-100 text-green-700" },
  "almost-done": { label: "כמעט גמור", className: "bg-amber-100 text-amber-700" },
  paused: { label: "בהקפאה", className: "bg-slate-200 text-slate-600" },
  completed: { label: "הושלם", className: "bg-slate-100 text-slate-500" },
};

const urgencyMap = {
  overdue: { bg: "bg-red-50", border: "border-red-500", text: "text-red-600", label: "לתשלום מיידי" },
  "this-week": { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-600", label: "השבוע" },
  "this-month": { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-600", label: "ב-30 יום" },
};

const taskUrgency = {
  today: { color: "text-red-600", badge: "bg-red-100 text-red-700", label: "דחוף" },
  tomorrow: { color: "text-amber-600", badge: "bg-amber-100 text-amber-700", label: "היום" },
  "this-week": { color: "text-blue-600", badge: "bg-blue-100 text-blue-700", label: "השבוע" },
  later: { color: "text-slate-600", badge: "bg-slate-200 text-slate-700", label: "בקרוב" },
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const pct = Math.round((project.actualSpent / project.budget) * 100);
  const remaining = project.budget - project.actualSpent;
  const projectContractors = contractors.filter((c) => c.projectId === project.id);
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectTransactions = transactions.filter((t) => t.projectId === project.id);
  const projectInventory = inventory.filter((i) => i.projectId === project.id);
  const projectAlerts = alerts.filter((a) => a.projectId === project.id || !a.projectId);
  const categories = expenseCategoriesByProject[project.id] ?? [];
  const badge = statusBadgeMap[project.status];

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600">
              🏠 ראשי
            </Link>
            <span className="text-slate-400">›</span>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 flex items-center gap-2">
              <span>{project.icon}</span>
              <span>{project.name}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${badge.className}`}>{badge.label}</span>
          </div>
          <div className="flex gap-2 text-sm">
            {projects
              .filter((p) => p.id !== project.id)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  {p.icon} {p.name}
                </Link>
              ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm">תקציב כולל</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {formatCurrency(project.budget)}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">לפי כתב כמויות מאושר</p>
          </div>
          <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm">הוצא בפועל</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {formatCurrency(project.actualSpent)}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                💸
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatPercent(pct)} מהתקציב</p>
          </div>
          <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm">יתרה זמינה</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(remaining)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                🏦
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              {remaining > 0 ? "✓ בתוך התקציב" : "⚠ חריגה מתקציב"}
            </p>
          </div>
          <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-purple-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm">התקדמות פיזית</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{project.progressPercent}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                📊
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="card-hover bg-white rounded-2xl p-5 lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-4">תזרים מצטבר - תקציב מול בפועל</h3>
            <ProjectCashflowChart />
          </div>
          <div className="card-hover bg-white rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-4">פילוח הוצאות לפי קטגוריה</h3>
            <CategoryChart data={categories} />
          </div>
        </div>

        {/* Contractors + Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="card-hover bg-white rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">יתרות לקבלנים וספקים</h3>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {projectContractors.filter((c) => c.urgency === "overdue").length} דחוף
              </span>
            </div>
            {projectContractors.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">אין קבלנים רשומים לפרויקט הזה</p>
            ) : (
              <div className="space-y-3">
                {projectContractors.map((c) => {
                  const u = urgencyMap[c.urgency];
                  return (
                    <div
                      key={c.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${u.bg} border-r-2 ${u.border}`}
                    >
                      <div>
                        <p className="font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-500">
                          {c.specialty} · חוזה: {formatCurrency(c.contractTotal)}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${u.text}`}>{formatCurrency(c.balance)}</p>
                        <p className={`text-xs ${u.text}`}>{u.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card-hover bg-white rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">משימות קרובות</h3>
              <button className="text-xs text-blue-600 hover:underline">+ הוסף משימה</button>
            </div>
            {projectTasks.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">אין משימות פעילות</p>
            ) : (
              <div className="space-y-3">
                {projectTasks.map((t) => {
                  const u = taskUrgency[t.urgency];
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg ${
                        t.done ? "opacity-60" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-600"
                        defaultChecked={t.done}
                      />
                      <div className="flex-1">
                        <p className={`font-medium text-slate-800 ${t.done ? "line-through" : ""}`}>
                          {t.title}
                        </p>
                        <p className="text-xs text-slate-500">📅 {t.dueDate}</p>
                      </div>
                      {!t.done && (
                        <span className={`text-xs px-2 py-1 rounded-full ${u.badge}`}>{u.label}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Transactions + Inventory + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="card-hover bg-white rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-4">תנועות אחרונות</h3>
            {projectTransactions.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">אין תנועות</p>
            ) : (
              <div className="space-y-3 text-sm">
                {projectTransactions.map((tr) => (
                  <div key={tr.id} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{tr.description}</p>
                      <p className="text-xs text-slate-500">
                        {tr.date} · {tr.source}
                      </p>
                    </div>
                    <p className={`font-bold ${tr.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {tr.amount > 0 ? "+" : ""}
                      {formatCurrency(tr.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-hover bg-white rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-4">מלאי באתר</h3>
            {projectInventory.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">אין נתוני מלאי</p>
            ) : (
              <div className="space-y-3">
                {projectInventory.map((item) => {
                  const pct = (item.current / item.required) * 100;
                  const color = pct < 25 ? "bg-red-500" : pct < 60 ? "bg-amber-500" : "bg-green-500";
                  return (
                    <div key={item.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>
                          {item.name} ({item.unit})
                        </span>
                        <span className={`font-bold ${pct < 25 ? "text-red-600" : "text-slate-700"}`}>
                          {item.current} / {item.required}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      {pct < 25 && <p className="text-xs text-red-500 mt-1">⚠ נדרשת הזמנה</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card-hover bg-white rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 mb-4">התראות</h3>
            <div className="space-y-3">
              {projectAlerts.map((a) => {
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
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        נתוני mock · MVP גרסה ראשונית
      </footer>
    </>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}
