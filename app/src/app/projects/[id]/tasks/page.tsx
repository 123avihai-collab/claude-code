import { notFound } from "next/navigation";
import { getProject, tasks } from "@/lib/mock-data";

const urgencyMap = {
  today: { badge: "bg-red-100 text-red-700", label: "דחוף - היום", border: "border-red-500" },
  tomorrow: { badge: "bg-amber-100 text-amber-700", label: "מחר", border: "border-amber-500" },
  "this-week": { badge: "bg-blue-100 text-blue-700", label: "השבוע", border: "border-blue-500" },
  later: { badge: "bg-slate-200 text-slate-700", label: "בקרוב", border: "border-slate-300" },
};

export default async function ProjectTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const pending = projectTasks.filter((t) => !t.done);
  const done = projectTasks.filter((t) => t.done);
  const urgent = pending.filter((t) => t.urgency === "today" || t.urgency === "tomorrow");

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-red-500">
          <p className="text-slate-500 text-sm">דחוף</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{urgent.length}</p>
          <p className="text-xs text-red-600 mt-2">דורש תשומת לב</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-blue-500">
          <p className="text-slate-500 text-sm">פתוחות</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{pending.length}</p>
          <p className="text-xs text-slate-400 mt-2">בעבודה / מחכות</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-green-500">
          <p className="text-slate-500 text-sm">הושלמו</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{done.length}</p>
          <p className="text-xs text-green-600 mt-2">✓</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-purple-500">
          <p className="text-slate-500 text-sm">השלמה</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {projectTasks.length === 0
              ? "—"
              : `${Math.round((done.length / projectTasks.length) * 100)}%`}
          </p>
          <p className="text-xs text-slate-400 mt-2">מהמשימות הרשומות</p>
        </div>
      </div>

      <div className="card-hover bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800">משימות פעילות</h3>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 bg-[#1F3864] text-white rounded-full">הכל</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">דחוף</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">השבוע</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">בקרוב</button>
            </div>
          </div>
          <button className="bg-[#1F3864] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2F5597]">
            + משימה חדשה
          </button>
        </div>

        {pending.length === 0 ? (
          <p className="text-sm text-slate-400 py-12 text-center">
            🎉 כל המשימות הושלמו! הוסף משימה חדשה כדי להתחיל.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((t) => {
              const u = urgencyMap[t.urgency];
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-r-2 ${u.border} bg-slate-50 hover:bg-white`}
                >
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-500">📅 {t.dueDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${u.badge}`}>{u.label}</span>
                  <button className="text-slate-400 hover:text-slate-600 text-sm">⋯</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {done.length > 0 && (
        <div className="card-hover bg-white rounded-2xl p-5">
          <h3 className="font-bold text-slate-800 mb-4">משימות שהושלמו</h3>
          <div className="space-y-2">
            {done.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 p-2 opacity-60 hover:opacity-100"
              >
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                <div className="flex-1">
                  <p className="font-medium line-through text-slate-600">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.dueDate}</p>
                </div>
                <span className="text-xs text-green-600">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
