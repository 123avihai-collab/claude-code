"use client";

import { useEffect, useState } from "react";
import { roadmapGroups } from "@/lib/roadmap-data";

const STORAGE_KEY = "pm-atuan-roadmap-done-v1";

function loadDone(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveDone(state: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function RoadmapBoard() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Merge persisted state with defaults from data
    const persisted = loadDone();
    const initial: Record<string, boolean> = {};
    roadmapGroups.forEach((g) =>
      g.tasks.forEach((t) => {
        initial[t.id] = persisted[t.id] ?? t.defaultDone ?? false;
      }),
    );
    setDone(initial);
    setMounted(true);
  }, []);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveDone(next);
      return next;
    });
  }

  const allTasks = roadmapGroups.flatMap((g) => g.tasks);
  const completed = allTasks.filter((t) => done[t.id]).length;
  const total = allTasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Progress header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <h2 className="font-bold text-slate-800 text-base sm:text-lg">
            התקדמות כוללת
          </h2>
          <span className="text-sm font-bold text-[#1F3864]">
            {mounted ? `${completed} / ${total} (${pct}%)` : "טוען..."}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-gradient-to-l from-[#1F3864] to-[#2F5597] h-3 rounded-full transition-all duration-500"
            style={{ width: `${mounted ? pct : 0}%` }}
          />
        </div>
      </div>

      {/* Groups */}
      {roadmapGroups.map((group) => {
        const groupCompleted = group.tasks.filter((t) => done[t.id]).length;
        return (
          <div
            key={group.id}
            className={`bg-white rounded-2xl border-r-4 ${group.color} border-t border-l border-b border-slate-200 p-4 sm:p-5`}
          >
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="text-xl">{group.icon}</span>
                {group.title}
              </h3>
              <span className="text-xs text-slate-500">
                {mounted ? `${groupCompleted} / ${group.tasks.length}` : ""}
              </span>
            </div>

            <div className="space-y-2">
              {group.tasks.map((task) => {
                const isDone = mounted && done[task.id];
                return (
                  <button
                    key={task.id}
                    onClick={() => toggle(task.id)}
                    className={`w-full text-right flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      isDone
                        ? "bg-green-50 border-green-200"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-5 h-5 rounded shrink-0 flex items-center justify-center text-xs ${
                        isDone
                          ? "bg-green-600 text-white"
                          : "bg-white border-2 border-slate-300"
                      }`}
                    >
                      {isDone ? "✓" : ""}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-medium ${
                            isDone ? "text-slate-400 line-through" : "text-slate-800"
                          }`}
                        >
                          {task.label}
                        </span>
                        {task.size && (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            ⏱ {task.size}
                          </span>
                        )}
                      </div>
                      {task.note && (
                        <p
                          className={`text-xs mt-1 ${
                            isDone ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {task.note}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-slate-400 text-center">
        💾 הסימונים נשמרים בדפדפן שלך · לחץ על משימה כדי לסמן/לבטל
      </p>
    </div>
  );
}
