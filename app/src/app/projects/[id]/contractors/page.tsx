import { notFound } from "next/navigation";
import { contractors, getProject } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

const urgencyMap = {
  overdue: {
    bg: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
    label: "לתשלום מיידי",
  },
  "this-week": {
    bg: "bg-amber-50",
    border: "border-amber-500",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    label: "השבוע",
  },
  "this-month": {
    bg: "bg-slate-50",
    border: "border-slate-300",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-700",
    label: "ב-30 יום",
  },
};

export default async function ProjectContractorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const projectContractors = contractors.filter((c) => c.projectId === project.id);
  const totalContracts = projectContractors.reduce((s, c) => s + c.contractTotal, 0);
  const totalBalance = projectContractors.reduce((s, c) => s + c.balance, 0);
  const overdue = projectContractors.filter((c) => c.urgency === "overdue");

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-blue-600">
          <p className="text-slate-500 text-sm">קבלנים פעילים</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{projectContractors.length}</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-purple-500">
          <p className="text-slate-500 text-sm">סך החוזים</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {formatCurrency(totalContracts, true)}
          </p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500">
          <p className="text-slate-500 text-sm">יתרה כוללת לתשלום</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {formatCurrency(totalBalance, true)}
          </p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-red-500">
          <p className="text-slate-500 text-sm">דחוף</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{overdue.length}</p>
          <p className="text-xs text-slate-500 mt-2">
            {overdue.length > 0
              ? formatCurrency(overdue.reduce((s, c) => s + c.balance, 0))
              : "—"}
          </p>
        </div>
      </div>

      <div className="card-hover bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">קבלנים וספקים</h3>
          <button className="bg-[#1F3864] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2F5597]">
            + הוסף קבלן
          </button>
        </div>

        {projectContractors.length === 0 ? (
          <p className="text-sm text-slate-400 py-12 text-center">
            אין קבלנים רשומים. הוסף קבלן ראשון כדי להתחיל.
          </p>
        ) : (
          <div className="space-y-3">
            {projectContractors.map((c) => {
              const u = urgencyMap[c.urgency];
              const paid = c.contractTotal - c.balance;
              const paidPct = (paid / c.contractTotal) * 100;
              return (
                <div
                  key={c.id}
                  className={`rounded-xl p-4 ${u.bg} border-r-4 ${u.border}`}
                >
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{c.name}</h4>
                      <p className="text-sm text-slate-500">
                        {c.specialty} · חוזה: {formatCurrency(c.contractTotal)}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-xl ${u.text}`}>{formatCurrency(c.balance)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${u.badge}`}>{u.label}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-slate-500">סך החוזה</p>
                      <p className="font-bold text-slate-800 text-sm mt-1">
                        {formatCurrency(c.contractTotal)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-slate-500">שולם</p>
                      <p className="font-bold text-green-600 text-sm mt-1">{formatCurrency(paid)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-slate-500">יתרה</p>
                      <p className={`font-bold text-sm mt-1 ${u.text}`}>
                        {formatCurrency(c.balance)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-white rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${paidPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">{paidPct.toFixed(0)}% שולם</span>
                    <div className="flex gap-2">
                      <button className="bg-white border border-slate-200 px-3 py-1 rounded text-xs hover:bg-slate-50">
                        💰 רישום תשלום
                      </button>
                      <button className="bg-white border border-slate-200 px-3 py-1 rounded text-xs hover:bg-slate-50">
                        📄 חוזה
                      </button>
                      <button className="bg-white border border-slate-200 px-3 py-1 rounded text-xs hover:bg-slate-50">
                        ✏ עריכה
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
