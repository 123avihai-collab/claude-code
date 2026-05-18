import { notFound } from "next/navigation";
import { ProjectCashflowChart } from "@/components/charts/project-cashflow-chart";
import { CategoryChart } from "@/components/charts/category-chart";
import {
  expenseCategoriesByProject,
  getExpenseCategoryTree,
  getProject,
  getTopSuppliers,
  transactions,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/format";

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700" },
  orange: { bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700" },
  purple: { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700" },
  red: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700" },
  slate: { bg: "bg-slate-50", border: "border-slate-400", text: "text-slate-700" },
};

export default async function ProjectFinancePage({
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
  const categories = expenseCategoriesByProject[project.id] ?? [];
  const categoryTree = getExpenseCategoryTree(project.id);
  const topSuppliers = getTopSuppliers(project.id);
  const totalCategorized = categoryTree.reduce((s, c) => s + c.amount, 0);
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
          <p className="text-slate-500 text-sm">הכנסות מהחוזה</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(project.revenue, true)}</p>
          <p className="text-xs text-slate-400 mt-2">מצטבר עד היום</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500">
          <p className="text-slate-500 text-sm">הוצאות בפועל</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(project.actualSpent, true)}</p>
          <p className="text-xs text-orange-600 mt-2">{formatPercent(pct)} מההכנסות</p>
        </div>
        <div className={`card-hover bg-white rounded-2xl p-5 border-r-4 ${profit >= 0 ? "border-green-600" : "border-red-600"}`}>
          <p className="text-slate-500 text-sm">רווח גולמי</p>
          <p className={`text-2xl font-bold mt-1 ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>
            {profit >= 0 ? "+" : ""}{formatCurrency(profit, true)}
          </p>
          <p className={`text-xs mt-2 ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {profit >= 0 ? `✓ רווחיות ${profitMargin}%` : `⚠ הפסד ${Math.abs(profitMargin)}%`}
          </p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-emerald-500">
          <p className="text-slate-500 text-sm">תזרים החודש</p>
          <p className={`text-2xl font-bold mt-1 ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalIncome - totalExpense >= 0 ? "+" : ""}
            {formatCurrency(totalIncome - totalExpense, true)}
          </p>
          <p className="text-xs text-slate-400 mt-2">תקבולים פחות תשלומים</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4">תזרים מצטבר - הכנסות מול הוצאות</h3>
          <ProjectCashflowChart />
        </div>
        <div className="card-hover bg-white rounded-2xl p-5">
          <h3 className="font-bold text-slate-800 mb-4">פילוח לפי קטגוריה</h3>
          <CategoryChart data={categories} />
        </div>
      </div>

      {/* Hierarchical expense breakdown — top-level cards clickable */}
      <div className="card-hover bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">פירוט הוצאות לפי קטגוריה</h3>
          <button className="text-xs bg-[#1F3864] text-white px-3 py-2 rounded-lg hover:bg-[#2F5597]">
            + הוצאה חדשה
          </button>
        </div>

        <div className="space-y-4">
          {categoryTree.map((cat) => {
            const c = colorClasses[cat.color] ?? colorClasses.slate;
            const sharePct = (cat.amount / totalCategorized) * 100;
            const revenueShare = (cat.amount / project.revenue) * 100;
            return (
              <div
                key={cat.id}
                className={`rounded-xl border-r-4 ${c.border} ${c.bg} p-4`}
              >
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className={`font-bold ${c.text}`}>{cat.label}</h4>
                      <p className="text-xs text-slate-500">
                        {sharePct.toFixed(1)}% מההוצאות · {revenueShare.toFixed(1)}% מההכנסות · {cat.children?.length ?? 0} פריטים
                      </p>
                    </div>
                  </div>
                  <p className={`text-xl font-bold ${c.text}`}>
                    {formatCurrency(cat.amount)}
                  </p>
                </div>

                <div className="bg-white/60 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${c.border.replace("border-", "bg-")}`}
                    style={{ width: `${sharePct}%` }}
                  />
                </div>

                {cat.children && cat.children.length > 0 && (
                  <div className="space-y-2 mt-3 bg-white rounded-lg p-3">
                    {cat.children.map((child, idx) => {
                      const childPct = (child.amount / cat.amount) * 100;
                      return (
                        <div key={idx} className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-sm text-slate-700">{child.label}</span>
                              <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                                {childPct.toFixed(0)}%
                              </span>
                            </div>
                            <div className="bg-slate-100 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full ${c.border.replace("border-", "bg-")}`}
                                style={{ width: `${childPct}%` }}
                              />
                            </div>
                            {child.note && (
                              <p className="text-xs text-slate-400 mt-1">⚠ {child.note}</p>
                            )}
                            {child.rowCount && (
                              <p className="text-xs text-slate-400 mt-1">{child.rowCount} תנועות</p>
                            )}
                          </div>
                          <span className="text-sm font-bold text-slate-800 whitespace-nowrap">
                            {formatCurrency(child.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-between items-center bg-slate-800 text-white rounded-xl p-4 font-bold">
            <span>סה&quot;כ הוצאות פרויקט</span>
            <span className="text-xl">{formatCurrency(totalCategorized)}</span>
          </div>
        </div>
      </div>

      {/* Top suppliers */}
      {topSuppliers.length > 0 && (
        <div className="card-hover bg-white rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Top ספקים וקבלנים בפרויקט</h3>
            <span className="text-xs text-slate-500">{topSuppliers.length} ספקים פעילים</span>
          </div>
          <div className="space-y-2">
            {topSuppliers.map((s, idx) => {
              const maxAmount = topSuppliers[0].totalAmount;
              const widthPct = (s.totalAmount / maxAmount) * 100;
              return (
                <div key={idx} className="border-b last:border-0 py-2">
                  <div className="flex justify-between items-center gap-3 mb-1">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs bg-slate-100 text-slate-600 rounded-full w-7 h-7 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{s.name}</p>
                        <p className="text-xs text-slate-500">
                          {s.category} · {s.txCount} תנועות
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-800 whitespace-nowrap">
                      {formatCurrency(s.totalAmount)}
                    </p>
                  </div>
                  <div className="bg-slate-100 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
