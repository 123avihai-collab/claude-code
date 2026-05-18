"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tab = { id: string; label: string; icon: string; path: string };

const DEFAULT_TABS: Tab[] = [
  { id: "overview", label: "סקירה", icon: "🏠", path: "" },
  { id: "expenses", label: "הוצאות", icon: "💸", path: "/finance" },
  { id: "bills", label: "חשבונות חלקיים", icon: "🧾", path: "/partial-bills" },
  { id: "po", label: "הזמנות רכש", icon: "📦", path: "/purchase-orders" },
  { id: "tasks", label: "משימות", icon: "📋", path: "/tasks" },
  { id: "contractors", label: "קבלנים וספקים", icon: "👷", path: "/contractors" },
  { id: "documents", label: "חוזים ומסמכים", icon: "📁", path: "/documents" },
];

const STORAGE_KEY = "pm-atuan-tab-order-v1";

function loadOrder(): Tab[] {
  if (typeof window === "undefined") return DEFAULT_TABS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_TABS;
    const savedIds: string[] = JSON.parse(saved);
    const reordered = savedIds
      .map((id) => DEFAULT_TABS.find((t) => t.id === id))
      .filter((t): t is Tab => t !== undefined);
    const missing = DEFAULT_TABS.filter(
      (t) => !reordered.find((r) => r.id === t.id),
    );
    return [...reordered, ...missing];
  } catch {
    return DEFAULT_TABS;
  }
}

function saveOrder(tabs: Tab[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs.map((t) => t.id)));
}

function SortableTab({
  tab,
  projectId,
  isActive,
  editMode,
}: {
  tab: Tab;
  projectId: string;
  isActive: boolean;
  editMode: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id, disabled: !editMode });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const baseClass = "px-4 py-3 text-sm font-medium whitespace-nowrap select-none flex items-center gap-1";
  const linkClass = `${baseClass} border-b-2 transition-colors ${
    isActive
      ? "border-[#1F3864] text-[#1F3864]"
      : "border-transparent text-slate-500 hover:text-slate-800"
  }`;
  const editClass = `${baseClass} border border-slate-300 rounded-lg bg-white shadow-sm cursor-grab active:cursor-grabbing text-slate-700 ${isDragging ? "" : "wiggle-animation"}`;

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={editClass}
      >
        <span>{tab.icon}</span>
        <span>{tab.label}</span>
      </div>
    );
  }

  return (
    <Link
      ref={setNodeRef as never}
      style={style}
      href={`/projects/${projectId}${tab.path}`}
      className={linkClass}
    >
      <span>{tab.icon}</span>
      <span>{tab.label}</span>
    </Link>
  );
}

export function ProjectSubNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [editMode, setEditMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTabs(loadOrder());
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tabs.findIndex((t) => t.id === active.id);
    const newIndex = tabs.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newTabs = arrayMove(tabs, oldIndex, newIndex);
    setTabs(newTabs);
    saveOrder(newTabs);
  }

  function resetToDefault() {
    setTabs(DEFAULT_TABS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function isActiveTab(tab: Tab) {
    const href = `/projects/${projectId}${tab.path}`;
    return tab.path === ""
      ? pathname === href || pathname === href + "/"
      : pathname.startsWith(href);
  }

  // SSR-safe initial render — show defaults until client hydrates with saved order
  if (!mounted) {
    return (
      <div className="flex gap-1 mb-6 border-b border-slate-200 overflow-x-auto">
        {DEFAULT_TABS.map((tab) => {
          const href = `/projects/${projectId}${tab.path}`;
          const isActive =
            tab.path === ""
              ? pathname === href || pathname === href + "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1 ${
                isActive
                  ? "border-[#1F3864] text-[#1F3864]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center mb-6 overflow-x-auto gap-2 ${editMode ? "py-2 px-2 bg-amber-50 rounded-lg border border-amber-200" : "border-b border-slate-200"}`}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tabs.map((t) => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-1 flex-1 items-center">
            {tabs.map((tab) => (
              <SortableTab
                key={tab.id}
                tab={tab}
                projectId={projectId}
                isActive={isActiveTab(tab)}
                editMode={editMode}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-2 mr-auto pl-2">
        {editMode && (
          <button
            onClick={resetToDefault}
            className="px-3 py-1.5 text-xs rounded-lg whitespace-nowrap bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
            title="חזרה לסדר ברירת מחדל"
          >
            ↺ איפוס
          </button>
        )}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
            editMode
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          title={editMode ? "שמור ויציאה ממצב עריכה" : "ערוך סדר טאבים"}
        >
          {editMode ? "✓ סיים" : "✏️ ערוך סדר"}
        </button>
      </div>
    </div>
  );
}
