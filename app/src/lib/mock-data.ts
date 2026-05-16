import type {
  Alert,
  Contractor,
  ExpenseCategory,
  InventoryItem,
  Project,
  ProjectStatus,
  Task,
  Transaction,
} from "./types";

export const projects: Project[] = [
  {
    id: "2253",
    name: "מערכת דס\"ל - מתחם תחזוקה",
    client: "תע\"א (דרך קבלן ראשי) · באר שבע",
    icon: "⛽",
    status: "active",
    startDate: "11/2024",
    budget: 10_033_697,
    actualSpent: 5_939_320,
    progressPercent: 78,
    urgentCount: 2,
    tasksCount: 6,
    accentColor: "blue",
  },
  {
    id: "2288",
    name: "שדרוג מערכת דלק - תחנת כוח",
    client: "חברת חשמל לישראל",
    icon: "🏭",
    status: "active",
    startDate: "02/2026",
    budget: 7_500_000,
    actualSpent: 1_120_000,
    progressPercent: 14,
    urgentCount: 1,
    tasksCount: 8,
    accentColor: "purple",
  },
  {
    id: "2306",
    name: "הקמת מתקן אחסון דלק",
    client: "תש\"ן",
    icon: "🛢️",
    status: "almost-done",
    startDate: "06/2024",
    budget: 4_200_000,
    actualSpent: 3_980_000,
    progressPercent: 94,
    urgentCount: 0,
    tasksCount: 2,
    accentColor: "emerald",
  },
];

export const contractors: Contractor[] = [
  {
    id: "c1",
    projectId: "2253",
    name: "קבלן עבודות עפר א'",
    specialty: "עבודות עפר וכבישים",
    contractTotal: 1_115_352,
    balance: 38_240,
    urgency: "overdue",
  },
  {
    id: "c2",
    projectId: "2253",
    name: "קבלן מסגרות וריתוך ב'",
    specialty: "מסגרות, ריתוכים, הנחת צנרת",
    contractTotal: 948_790,
    balance: 42_500,
    urgency: "this-week",
  },
  {
    id: "c3",
    projectId: "2253",
    name: "קבלן צביעה ג'",
    specialty: "צביעה ומיגון נגד קורוזיה",
    contractTotal: 111_050,
    balance: 17_300,
    urgency: "this-week",
  },
  {
    id: "c4",
    projectId: "2253",
    name: "קבלן בקרה ד'",
    specialty: "טסטים, MPI, וקומישנינג",
    contractTotal: 0,
    balance: 0,
    urgency: "this-month",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    projectId: "2253",
    title: "הגשת חשבון חלקי 8 למזמין",
    dueDate: "היום · עד 16:00",
    urgency: "today",
    done: false,
    note: "מאזן 02/2026",
  },
  {
    id: "t2",
    projectId: "2288",
    title: "סיור הצעת מחיר באתר",
    dueDate: "מחר · 09:00",
    urgency: "tomorrow",
    done: false,
  },
  {
    id: "t3",
    projectId: "2253",
    title: "תיאום בקרת ריתוכים MPI",
    dueDate: "מחר · עם מפקח",
    urgency: "tomorrow",
    done: false,
  },
  {
    id: "t4",
    projectId: "2253",
    title: "אישור הזמנת רכש לציוד דלק",
    dueDate: "18/05 · long lead",
    urgency: "this-week",
    done: false,
    note: "זמן אספקה: 14 שבועות",
  },
  {
    id: "t5",
    projectId: "2306",
    title: "סיום קומישנינג ומסירה",
    dueDate: "20/05",
    urgency: "this-week",
    done: false,
  },
  {
    id: "t6",
    projectId: "2253",
    title: "סקירת תוספת לחוזה עם המזמין",
    dueDate: "22/05",
    urgency: "later",
    done: false,
  },
  {
    id: "t7",
    projectId: "2253",
    title: "תשלום לקבלן עבודות עפר",
    dueDate: "הושלם 13/05",
    urgency: "later",
    done: true,
  },
];

export const transactions: Transaction[] = [
  {
    id: "tr1",
    projectId: "2253",
    date: "13/05/26",
    description: "תקבול חשבון חלקי 7",
    source: "מקבלן ראשי",
    amount: 942_853,
  },
  {
    id: "tr2",
    projectId: "2253",
    date: "10/05/26",
    description: "ספק צנרת - צינור 8\" סקד 40",
    source: "חשבונית SI",
    amount: -337_956,
  },
  {
    id: "tr3",
    projectId: "2253",
    date: "08/05/26",
    description: "קבלן עבודות עפר - תשלום ביניים",
    source: "חשבונית קבלן",
    amount: -111_840,
  },
  {
    id: "tr4",
    projectId: "2253",
    date: "05/05/26",
    description: "שכ\"ע מהנדס פיקוח 04/26",
    source: "תקורה",
    amount: -14_374,
  },
];

export const inventory: InventoryItem[] = [
  { id: "i1", projectId: "2253", name: "צינור 8\" סקד.40", unit: "מ\"א", current: 280, required: 320 },
  { id: "i2", projectId: "2253", name: "מגוף כדורי 2\"", unit: "יח'", current: 18, required: 40 },
  { id: "i3", projectId: "2253", name: "אקדח תדלוק NFPA 407", unit: "יח'", current: 4, required: 12 },
  { id: "i4", projectId: "2253", name: "מד הפרשי לחץ FM/UL", unit: "יח'", current: 6, required: 8 },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    projectId: "2253",
    type: "critical",
    icon: "🚨",
    title: "תשלום באיחור - קבלן עבודות עפר",
    detail: "פרויקט 2253 · ₪38,240",
  },
  {
    id: "a2",
    projectId: "2253",
    type: "critical",
    icon: "⚠️",
    title: "long lead item - עיכוב צפוי",
    detail: "ציוד דלק - אספקה ב-21 ימים",
  },
  {
    id: "a3",
    projectId: "2253",
    type: "warning",
    icon: "⏰",
    title: "בקרת ריתוכים מחר 09:00",
    detail: "MPI - פרויקט 2253",
  },
  {
    id: "a4",
    projectId: "2288",
    type: "warning",
    icon: "📄",
    title: "מועד הגשת מכרז קרוב",
    detail: "פרויקט 2288 - 8 ימים",
  },
  {
    id: "a5",
    type: "info",
    icon: "📊",
    title: "חשבון חלקי 7 אושר ע\"י המזמין",
    detail: "פרויקט 2253 · ₪942K",
  },
  {
    id: "a6",
    type: "success",
    icon: "✓",
    title: "גיבוי הושלם",
    detail: "היום בבוקר ל-Drive",
  },
];

export const expenseCategoriesByProject: Record<string, ExpenseCategory[]> = {
  "2253": [
    { label: "חומרים (צנרת, אביזרים, ציוד דלק)", amount: 3_764_127 },
    { label: "קבלני משנה", amount: 2_175_193 },
    { label: "תקורות - שכ\"ע צוות", amount: 850_000 },
    { label: "תקורות - נסיעות ולוגיסטיקה", amount: 95_000 },
    { label: "תקורות - אחר", amount: 55_000 },
  ],
  "2288": [
    { label: "תכנון הנדסי", amount: 285_000 },
    { label: "חומרים", amount: 480_000 },
    { label: "קבלני משנה", amount: 280_000 },
    { label: "תקורות", amount: 75_000 },
  ],
  "2306": [
    { label: "חומרים (מיכלים, צנרת)", amount: 1_850_000 },
    { label: "קבלני משנה", amount: 1_290_000 },
    { label: "ציוד התראה ובטיחות", amount: 520_000 },
    { label: "תקורות", amount: 320_000 },
  ],
};

export const monthlyCashflowByProject: Record<string, number[]> = {
  "2253": [814_350, 429_287, 5_012_907, 1_598_289, 1_733_681],
  "2288": [0, 250_000, 320_000, 280_000, 270_000],
  "2306": [180_000, 145_000, 110_000, 92_000, 92_000],
};

export const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי"];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function totalsAcrossProjects(filter: ProjectStatus | "all" = "active") {
  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter || (filter === "active" && p.status === "almost-done"));
  return {
    totalBudget: filtered.reduce((s, p) => s + p.budget, 0),
    totalSpent: filtered.reduce((s, p) => s + p.actualSpent, 0),
    count: filtered.length,
  };
}
