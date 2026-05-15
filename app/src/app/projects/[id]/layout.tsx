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
      <main className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600">
              🏠 ראשי
            </Link>
            <span className="text-slate-400">›</span>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 flex items-center gap-2">
              <span>{project.icon}</span>
              <span>{project.name}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
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

        <ProjectSubNav projectId={project.id} />
        {children}
      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        נתוני mock · MVP גרסה ראשונית
      </footer>
    </>
  );
}
