import { notFound } from "next/navigation";
import {
  getCumulativeSubcontractors,
  getExpenseCategoryTree,
  getProject,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/format";
import { ExpenseBreakdown } from "@/components/expense-breakdown";

export default async function ProjectFinancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const pct = Math.round((project.actualSpent / project.revenue) * 100);
  const categoryTree = getExpenseCategoryTree(project.id);
  const cumulativeSubs = getCumulativeSubcontractors(project.id);

  return (
    <>
      {/* Compact header — total spent only (no profit/cashflow KPIs, no charts) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 mb-6 border-r-4 border-orange-500 flex justify-between items-center flex-wrap gap-3">
        <div>
          <p className="text-slate-500 text-sm">סך הוצאות בפועל</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {formatCurrency(project.actualSpent, true)}
          </p>
          <p className="text-xs text-orange-600 mt-1">{formatPercent(pct)} מההכנסות</p>
        </div>
        <button className="text-xs bg-[#1F3864] text-white px-3 py-2 rounded-lg hover:bg-[#2F5597]">
          + הוצאה חדשה
        </button>
      </div>

      {/* Hierarchical expense breakdown — suppliers collapsible */}
      <div className="bg-white rounded-2xl p-3 sm:p-5 mb-6">
        <div className="mb-4">
          <h3 className="font-bold text-slate-800">פירוט הוצאות לפי קטגוריה</h3>
          <p className="text-xs text-slate-500 mt-1">
            לחץ על ספק לפתיחת פירוט ההוצאות (הזמנת רכש + סטטוס חשבונית)
          </p>
        </div>

        <ExpenseBreakdown
          categoryTree={categoryTree}
          cumulativeSubs={cumulativeSubs}
          projectRevenue={project.revenue}
        />
      </div>
    </>
  );
}
