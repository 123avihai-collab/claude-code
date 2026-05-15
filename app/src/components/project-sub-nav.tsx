"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "overview", label: "סקירה", icon: "🏠", path: "" },
  { id: "finance", label: "פיננסי", icon: "💰", path: "/finance" },
  { id: "tasks", label: "משימות", icon: "📋", path: "/tasks" },
  { id: "contractors", label: "קבלנים וספקים", icon: "👷", path: "/contractors" },
  { id: "documents", label: "חוזים ומסמכים", icon: "📁", path: "/documents" },
];

export function ProjectSubNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 mb-6 border-b border-slate-200 overflow-x-auto">
      {tabs.map((tab) => {
        const href = `/projects/${projectId}${tab.path}`;
        const isActive =
          tab.path === ""
            ? pathname === href || pathname === href + "/"
            : pathname.startsWith(href);
        return (
          <Link
            key={tab.id}
            href={href}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              isActive
                ? "border-[#1F3864] text-[#1F3864]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="ml-1">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
