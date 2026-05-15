import { notFound } from "next/navigation";
import { ProjectCashflowChart } from "@/components/charts/project-cashflow-chart";
import { CategoryChart } from "@/components/charts/category-chart";
import {
  expenseCategoriesByProject,
  getProject,
  transactions,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/format";

export default async function ProjectFinancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const pct = Math.round((project.actualSpent / project.budget) * 100);
  const remaining = project.budget - project.actualSpent;
  const categories = expenseCategoriesByProject[project.id] ?? [];
  const totalCategorized = categories.reduce((s, c) => s + c.amount, 0);
  const projectTransactions = transactions.filter((t) => t.projectId === project.id);
  const totalIncome = projectTransactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = Math.abs(
    projectTransactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0),
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-blue-600">
          <p className="text-slate-500 text-sm">תקציב</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(project.budget, true)}</p>
          <p className="text-xs text-slate-400 mt-2">לפי כתב כמויות</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500">
          <p className="text-slate-500 text-sm">הוצא</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(project.actualSpent, true)}</p>
          <p className="text-xs text-orange-600 mt-2">{formatPercent(pct)} מהתקציב</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-green-600">
          <p className="text-slate-500 text-sm">יתרה זמינה</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(remaining, true)}</p>
          <p className="text-xs text-green-600 mt-2">
            {remaining > 0 ? "✓ בתוך התקציב" : "⚠ חריגה"}
          </p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-emerald-500">
          <p className="text-slate-500 text-sm">תזרים החודש</p>
          <p className={`text-2xl font-bold mt-1 ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalIncome - totalExpense >= 0 ? "+" : ""}
            {formatCurrency(totalIncome - totalExpense, true)}
          </p>
          <p className="text-xs text-slate-400 mt-2">הכנסות פחות הוצאות</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4">תזרים מצטבר - תקציב מול בפועל</h3>
          <ProjectCashflowChart />
        </div>
        <div className="card-hover bg-white rounded-2xl p-5">
          <h3 className="font-bold text-slate-800 mb-4">פילוח לפי קטגוריה</h3>
          <CategoryChart data={categories} />
        </div>
      </div>

      <div className="card-hover bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">פירוט הוצאות לפי קטגוריה</h3>
          <button className="text-xs bg-[#1F3864] text-white px-3 py-2 rounded-lg hover:bg-[#2F5597]">
            + הוצאה חדשה
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-right font-medium text-slate-600">קטגוריה</th>
              <th className="p-3 text-right font-medium text-slate-600">סכום</th>
              <th className="p-3 text-right font-medium text-slate-600">% מסה"כ</th>
              <th className="p-3 text-right font-medium text-slate-600">תקציב</th>
              <th className="p-3 text-right font-medium text-slate-600">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const share = (c.amount / totalCategorized) * 100;
              const allocatedBudget = (c.amount / totalCategorized) * project.budget;
              const overshoot = c.amount > allocatedBudget * 1.05;
              return (
                <tr key={c.label} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium">{c.label}</td>
                  <td className="p-3 text-orange-600 font-bold">{formatCurrency(c.amount)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 w-12">{share.toFixed(1)}%</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-32">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{formatCurrency(allocatedBudget)}</td>
                  <td className="p-3">
                    {overshoot ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        ⚠ חריגה
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✓ תקין
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-100 font-bold">
              <td className="p-3">סה&quot;כ</td>
              <td className="p-3 text-orange-600">{formatCurrency(totalCategorized)}</td>
              <td className="p-3">100%</td>
              <td className="p-3">{formatCurrency(project.budget)}</td>
              <td className="p-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">תנועות החודש</h3>
            <div className="flex gap-2 text-xs">
              <button className="px-2 py-1 bg-slate-100 rounded">הכל</button>
              <button className="px-2 py-1 bg-slate-100 rounded">הוצאות</button>
              <button className="px-2 py-1 bg-slate-100 rounded">הכנסות</button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="p-2 text-right font-medium text-slate-500 text-xs">תאריך</th>
                <th className="p-2 text-right font-medium text-slate-500 text-xs">תיאור</th>
                <th className="p-2 text-right font-medium text-slate-500 text-xs">סכום</th>
              </tr>
            </thead>
            <tbody>
              {projectTransactions.map((tr) => (
                <tr key={tr.id} className="border-b hover:bg-slate-50">
                  <td className="p-2 text-slate-500">{tr.date}</td>
                  <td className="p-2">
                    <p className="font-medium">{tr.description}</p>
                    <p className="text-xs text-slate-500">{tr.source}</p>
                  </td>
                  <td className={`p-2 font-bold ${tr.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tr.amount > 0 ? "+" : ""}
                    {formatCurrency(tr.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold text-sm">
                <td className="p-2" colSpan={2}>
                  סה&quot;כ נטו
                </td>
                <td
                  className={`p-2 ${
                    totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalIncome - totalExpense >= 0 ? "+" : ""}
                  {formatCurrency(totalIncome - totalExpense)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card-hover bg-white rounded-2xl p-5">
          <h3 className="font-bold text-slate-800 mb-4">חיזוי תזרים - 3 חודשים קדימה</h3>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 rounded-lg border-r-2 border-amber-500">
              <div className="flex justify-between items-center">
                <p className="font-medium">תשלום משכנתא הבא</p>
                <p className="font-bold text-green-600">+₪450,000</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">📅 ב-15/06 · אבן דרך 60%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border-r-2 border-red-500">
              <div className="flex justify-between items-center">
                <p className="font-medium">תשלום לקבלן השלד</p>
                <p className="font-bold text-red-600">-₪180,000</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">📅 ב-20/06 · על-פי לוז</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border-r-2 border-red-500">
              <div className="flex justify-between items-center">
                <p className="font-medium">חומרי גמר - שלב 1</p>
                <p className="font-bold text-red-600">-₪95,000</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">📅 ביולי · הזמנה צפויה</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg font-bold flex justify-between">
              <span>תזרים נטו צפוי</span>
              <span className="text-green-600">+₪175,000</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
