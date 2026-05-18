import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCashflowChart } from "@/components/charts/project-cashflow-chart";
import { CategoryChart } from "@/components/charts/category-chart";
import {
  contractors,
  expenseCategoriesByProject,
  getProject,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

const urgencyMap = {
  overdue: { bg: "bg-red-50", border: "border-red-500", text: "text-red-600", label: "לתשלום מיידי" },
  "this-week": { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-600", label: "השבוע" },
  "this-month": { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-600", label: "ב-30 יום" },
};

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const pct = Math.round((project.actualSpent / project.revenue) * 100);
  const profit = project.revenue - project.actualSpent;
  const profitMargin = Math.round((profit / project.revenue) * 100);
  const projectContractors = contractors.filter((c) => c.projectId === project.id);
  const categories = expenseCategoriesByProject[project.id] ?? [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <div className="card-hover bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl p-5 border-r-4 border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-300 text-sm">היקף החוזה</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(project.contractAmount)}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">📜</div>
          </div>
          <p className="text-xs text-slate-300 mt-2">סך החוזה החתום מול המזמין</p>
        </div>

        <Link
          href={`/projects/${project.id}/partial-bills`}
          className="card-hover bg-white rounded-2xl p-5 border-r-4 border-blue-600 block hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">הכנסות מהחוזה</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(project.revenue)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">💰</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.round((project.revenue / project.contractAmount) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {Math.round((project.revenue / project.contractAmount) * 100)}% מההיקף · לחץ לפירוט ←
          </p>
        </Link>

        <Link
          href={`/projects/${project.id}/finance`}
          className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500 block hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">הוצאות בפועל</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {formatCurrency(project.actualSpent)}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">💸</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-orange-600 mt-1">לחץ לפירוט הוצאות פר קטגוריה ←</p>
        </Link>

        <div className={`card-hover bg-white rounded-2xl p-5 border-r-4 ${profit >= 0 ? "border-green-600" : "border-red-600"}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">רווח גולמי</p>
              <p className={`text-2xl font-bold mt-1 ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {formatCurrency(profit)}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${profit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
              {profit >= 0 ? "📈" : "📉"}
            </div>
          </div>
          <p className={`text-xs mt-2 ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {profit >= 0 ? `✓ רווחיות ${profitMargin}%` : `⚠ הפסד ${Math.abs(profitMargin)}%`}
          </p>
        </div>

        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-purple-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">התקדמות פיזית</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{project.progressPercent}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">📊</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">תזרים מצטבר - הכנסות מול הוצאות</h3>
            <Link href={`/projects/${project.id}/finance`} className="text-xs text-blue-600 hover:underline">
              לפיננסי המלא ←
            </Link>
          </div>
          <ProjectCashflowChart />
        </div>
        <div className="card-hover bg-white rounded-2xl p-5">
          <h3 className="font-bold text-slate-800 mb-4">פילוח הוצאות לפי קטגוריה</h3>
          <CategoryChart data={categories} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">יתרות לקבלנים וספקים</h3>
            <Link
              href={`/projects/${project.id}/contractors`}
              className="text-xs text-blue-600 hover:underline"
            >
              הצג הכל ←
            </Link>
          </div>
          {projectContractors.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">אין קבלנים רשומים</p>
          ) : (
            <div className="space-y-3">
              {projectContractors.slice(0, 3).map((c) => {
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

      </div>

      <div className="card-hover bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-3 mb-6 border border-indigo-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="text-sm font-bold text-slate-800 whitespace-nowrap">סוכן AI</span>
          <input
            type="text"
            disabled
            placeholder={`שאל כל שאלה על פרויקט ${project.id}...`}
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

    </>
  );
}
