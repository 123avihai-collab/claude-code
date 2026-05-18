import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProjectSubNav } from "@/components/project-sub-nav";
import { getProject, projects } from "@/lib/mock-data";

const statusBadgeMap = {
  active: { label: "פעיל", className: "bg-green-100 text-green-700" },
  "almost-done": { label: "כמעט גמור", className: "bg-amber-100 text-amber-700" },
  paused: { label: "בהקפאה", className: "bg-slate-200 text-slate-600" },
  completed: { label: "הושלם", className: "bg-slate-100 text-slate-500" },
};

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const badge = statusBadgeMap[project.status];

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1">
            <Link href="/" className="text-slate-500 hover:text-blue-600 shrink-0">
              🏠
            </Link>
            <span className="text-slate-400">›</span>
            <div className="bg-white border border-slate-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 font-bold text-slate-800 flex items-center gap-1 sm:gap-2 min-w-0">
              <span>{project.icon}</span>
              <span className="truncate">{project.name}</span>
            </div>
            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${badge.className}`}>
              {badge.label}
            </span>
          </div>
          <div className="flex gap-1.5 sm:gap-2 text-xs sm:text-sm overflow-x-auto max-w-full">
            {projects
              .filter((p) => p.id !== project.id)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="bg-white border border-slate-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-slate-50 whitespace-nowrap"
                >
                  {p.icon} {p.name}
                </Link>
              ))}
          </div>
        </div>

        <ProjectSubNav projectId={project.id} />
        {children}
      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        נתוני mock · MVP גרסה ראשונית
      </footer>
    </>
  );
}
