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
    id: "herzliya",
    name: "בית הרצליה",
    client: "משפחת לוי",
    icon: "🏡",
    status: "active",
    startDate: "06/2025",
    budget: 2_450_000,
    actualSpent: 1_387_200,
    progressPercent: 62,
    urgentCount: 3,
    tasksCount: 5,
    accentColor: "blue",
  },
  {
    id: "raanana",
    name: "דופלקס רעננה",
    client: "משפחת כהן",
    icon: "🏢",
    status: "active",
    startDate: "02/2026",
    budget: 2_100_000,
    actualSpent: 380_000,
    progressPercent: 18,
    urgentCount: 1,
    tasksCount: 8,
    accentColor: "purple",
  },
  {
    id: "kfar-saba",
    name: "שיפוץ כפר סבא",
    client: "משפחת אברהם",
    icon: "🔨",
    status: "almost-done",
    startDate: "11/2024",
    budget: 1_250_000,
    actualSpent: 1_162_500,
    progressPercent: 93,
    urgentCount: 0,
    tasksCount: 2,
    accentColor: "emerald",
  },
];

export const contractors: Contractor[] = [
  {
    id: "c1",
    projectId: "herzliya",
    name: "אלי שלד בע\"מ",
    specialty: "שלד בטון",
    contractTotal: 380_000,
    balance: 45_000,
    urgency: "overdue",
  },
  {
    id: "c2",
    projectId: "herzliya",
    name: "חשמלי הצפון",
    specialty: "חשמל ותקשורת",
    contractTotal: 95_000,
    balance: 28_500,
    urgency: "this-week",
  },
  {
    id: "c3",
    projectId: "herzliya",
    name: "אינסטלציית כהן",
    specialty: "אינסטלציה",
    contractTotal: 65_000,
    balance: 19_500,
    urgency: "this-week",
  },
  {
    id: "c4",
    projectId: "herzliya",
    name: "קרמיקה עד הבית",
    specialty: "חיפויים",
    contractTotal: 48_000,
    balance: 14_400,
    urgency: "this-month",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    projectId: "herzliya",
    title: "פגישת תיאום עם חשמלאי",
    dueDate: "היום · 15:00",
    urgency: "today",
    done: false,
    note: "באתר",
  },
  {
    id: "t2",
    projectId: "raanana",
    title: "בחירת אריחי גמר - פגישה עם לקוח",
    dueDate: "מחר",
    urgency: "tomorrow",
    done: false,
  },
  {
    id: "t3",
    projectId: "herzliya",
    title: "אישור הזמנת אריחי קרמיקה",
    dueDate: "מחר · עד 12:00",
    urgency: "tomorrow",
    done: false,
  },
  {
    id: "t4",
    projectId: "herzliya",
    title: "בדיקת איכות בטון בתקרה",
    dueDate: "18/05 · עם מפקח",
    urgency: "this-week",
    done: false,
  },
  {
    id: "t5",
    projectId: "kfar-saba",
    title: "קבלת מפתחות וסיום עבודות",
    dueDate: "18/05",
    urgency: "this-week",
    done: false,
  },
  {
    id: "t6",
    projectId: "herzliya",
    title: "סקירת חוזה גמרים",
    dueDate: "22/05 · משרד עו\"ד",
    urgency: "later",
    done: false,
  },
  {
    id: "t7",
    projectId: "herzliya",
    title: "תשלום למהנדס קונסטרוקציה",
    dueDate: "הושלם ב-12/05",
    urgency: "later",
    done: true,
  },
];

export const transactions: Transaction[] = [
  {
    id: "tr1",
    projectId: "herzliya",
    date: "13/05/26",
    description: "תשלום: אלי שלד",
    source: "העברה בנקאית",
    amount: -75_000,
  },
  {
    id: "tr2",
    projectId: "herzliya",
    date: "10/05/26",
    description: "קבלת תשלום מבנק",
    source: "משכנתא",
    amount: 450_000,
  },
  {
    id: "tr3",
    projectId: "herzliya",
    date: "08/05/26",
    description: "קניית אריחים",
    source: "קרמיקה עד הבית",
    amount: -32_400,
  },
  {
    id: "tr4",
    projectId: "herzliya",
    date: "05/05/26",
    description: "אגרת בנייה",
    source: "עיריית הרצליה",
    amount: -12_500,
  },
];

export const inventory: InventoryItem[] = [
  { id: "i1", projectId: "herzliya", name: "בלוקים", unit: "קוב", current: 85, required: 120 },
  { id: "i2", projectId: "herzliya", name: "ברזל", unit: "טון", current: 12, required: 30 },
  { id: "i3", projectId: "herzliya", name: "צמנט", unit: "שקים", current: 35, required: 200 },
  { id: "i4", projectId: "herzliya", name: "אריחי קרמיקה", unit: "מ\"ר", current: 180, required: 240 },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    projectId: "herzliya",
    type: "critical",
    icon: "🚨",
    title: "תשלום מאחר - אלי שלד",
    detail: "בית הרצליה · ₪45,000",
  },
  {
    id: "a2",
    projectId: "herzliya",
    type: "critical",
    icon: "⚠️",
    title: "חריגה: חשמל הרצליה",
    detail: "+12% מתקציב",
  },
  {
    id: "a3",
    projectId: "herzliya",
    type: "warning",
    icon: "⏰",
    title: "פגישה היום 15:00",
    detail: "חשמלאי - בית הרצליה",
  },
  {
    id: "a4",
    projectId: "raanana",
    type: "warning",
    icon: "📄",
    title: "חוזה לחתימה",
    detail: "דופלקס רעננה - גמרים",
  },
  {
    id: "a5",
    type: "info",
    icon: "📄",
    title: "3 חשבוניות חדשות מ-Priority",
    detail: "סונכרן לפני 2 שעות",
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
  herzliya: [
    { label: "שלד ובטון", amount: 385_000 },
    { label: "גמרים", amount: 280_000 },
    { label: "חשמל", amount: 195_000 },
    { label: "אינסטלציה", amount: 165_000 },
    { label: "מטבח", amount: 145_000 },
    { label: "אחר", amount: 217_200 },
  ],
  raanana: [
    { label: "תכנון", amount: 95_000 },
    { label: "חפירות ועפר", amount: 145_000 },
    { label: "תשתיות", amount: 85_000 },
    { label: "אחר", amount: 55_000 },
  ],
  "kfar-saba": [
    { label: "הריסה ושינוי קונסטרוקציה", amount: 290_000 },
    { label: "חשמל ואינסטלציה", amount: 245_000 },
    { label: "ריצוף וקירות", amount: 218_000 },
    { label: "מטבח וחדרי רחצה", amount: 268_500 },
    { label: "גמרים וצבע", amount: 141_000 },
  ],
};

export const monthlyCashflowByProject: Record<string, number[]> = {
  herzliya: [120_000, 145_000, 168_000, 152_000, 175_000],
  raanana: [0, 85_000, 120_000, 95_000, 145_000],
  "kfar-saba": [180_000, 145_000, 110_000, 92_000, 92_000],
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

