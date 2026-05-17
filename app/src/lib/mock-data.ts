import type {
  Alert,
  Contractor,
  ExpenseCategory,
  ExpenseCategoryNode,
  InventoryItem,
  PartialBill,
  Project,
  ProjectStatus,
  PurchaseOrder,
  Task,
  TopSupplier,
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
    revenue: 10_033_697,
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
    revenue: 7_500_000,
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
    revenue: 4_200_000,
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

// תצוגת קטגוריות פשוטה לגרף — סיכומים ברמה עליונה.
// סכום הכל פר פרויקט = project.actualSpent.
export const expenseCategoriesByProject: Record<string, ExpenseCategory[]> = {
  "2253": [
    { label: "חומרים", amount: 3_200_000 },
    { label: "קבלני משנה", amount: 2_000_000 },
    { label: "תקורות - שכר", amount: 600_000 },
    { label: "תקורות - רכב", amount: 90_000 },
    { label: "תקורות - אחר", amount: 49_320 },
  ],
  "2288": [
    { label: "תכנון הנדסי", amount: 285_000 },
    { label: "חומרים", amount: 480_000 },
    { label: "קבלני משנה", amount: 280_000 },
    { label: "תקורות", amount: 75_000 },
  ],
  "2306": [
    { label: "חומרים", amount: 1_850_000 },
    { label: "קבלני משנה", amount: 1_290_000 },
    { label: "ציוד התראה ובטיחות", amount: 520_000 },
    { label: "תקורות", amount: 320_000 },
  ],
};

// היררכיה מלאה — אב + ילדים.
// סך כל ה-amount של הצמתים העליונים = project.actualSpent.
export const expenseCategoryTreeByProject: Record<string, ExpenseCategoryNode[]> = {
  "2253": [
    {
      id: "materials",
      label: "חומרים",
      icon: "📦",
      color: "blue",
      amount: 3_200_000,
      children: [
        { label: "צנרת ואביזרים (פלדה, נירוסטה)", amount: 1_800_000, rowCount: 56 },
        { label: "ציוד דלק (מגופים, אקדחים, מדים)", amount: 700_000, rowCount: 18 },
        { label: "יבוא (PLIDCO ועוד)", amount: 400_000, rowCount: 10 },
        { label: "חומרים שונים", amount: 300_000, rowCount: 15 },
      ],
    },
    {
      id: "subcontractors",
      label: "קבלני משנה",
      icon: "👷",
      color: "orange",
      amount: 2_000_000,
      children: [
        { label: "קבלן עבודות עפר א'", amount: 1_115_352, rowCount: 5, note: "חוזה מלא הושלם" },
        { label: "קבלן מסגרות וריתוך ב'", amount: 700_000, rowCount: 4 },
        { label: "קבלן צביעה ומיגון ג'", amount: 111_050, rowCount: 6 },
        { label: "קבלן בקרה ד' (קומישנינג)", amount: 73_598, rowCount: 2 },
      ],
    },
    {
      id: "salary",
      label: "תקורות - שכר עובדים",
      icon: "👨‍💼",
      color: "purple",
      amount: 600_000,
      children: [
        { label: "עובד 1 (אביחי - מנהל פרויקט)", amount: 200_000, rowCount: 18 },
        { label: "עובד 2 (מהנדס פיקוח שדה)", amount: 180_000, rowCount: 16 },
        { label: "עובד 3 (מהנדס תכנון)", amount: 150_000, rowCount: 15 },
        { label: "עובד 4 (אדמיניסטרציה)", amount: 70_000, rowCount: 11, note: "החזר מילואים: -₪8,500" },
      ],
    },
    {
      id: "vehicle",
      label: "תקורות - רכב",
      icon: "🚗",
      color: "amber",
      amount: 90_000,
      children: [
        { label: "ליסינג רכבים (אלבר)", amount: 50_000, rowCount: 14, note: "לא ניתן להפריד פר רכב" },
        { label: "דלק (סונול + דלק)", amount: 35_000, rowCount: 30, note: "לא ניתן להפריד פר עובד" },
        { label: "אחזקה ותיקונים", amount: 5_000, rowCount: 2 },
      ],
    },
    {
      id: "overhead-other",
      label: "תקורות - אחר",
      icon: "🍽️",
      color: "slate",
      amount: 49_320,
      children: [
        { label: "ארוחות עובדים (סיבוס)", amount: 25_000, rowCount: 10 },
        { label: "לינה לעובדים", amount: 15_000, rowCount: 5 },
        { label: "אחזקת כלי צמ\"ה", amount: 9_320, rowCount: 23 },
      ],
    },
  ],
  "2288": [
    {
      id: "engineering",
      label: "תכנון הנדסי",
      icon: "📐",
      color: "blue",
      amount: 285_000,
    },
    {
      id: "materials",
      label: "חומרים",
      icon: "📦",
      color: "orange",
      amount: 480_000,
    },
    {
      id: "subs",
      label: "קבלני משנה",
      icon: "👷",
      color: "purple",
      amount: 280_000,
    },
    {
      id: "overhead",
      label: "תקורות",
      icon: "💼",
      color: "slate",
      amount: 75_000,
    },
  ],
  "2306": [
    {
      id: "materials",
      label: "חומרים (מיכלים, צנרת)",
      icon: "📦",
      color: "blue",
      amount: 1_850_000,
    },
    {
      id: "subs",
      label: "קבלני משנה",
      icon: "👷",
      color: "orange",
      amount: 1_290_000,
    },
    {
      id: "safety",
      label: "ציוד התראה ובטיחות",
      icon: "🚨",
      color: "red",
      amount: 520_000,
    },
    {
      id: "overhead",
      label: "תקורות",
      icon: "💼",
      color: "slate",
      amount: 320_000,
    },
  ],
};

// Top suppliers — מסונן פר פרויקט.
// השמות אנונימיים (גנריים), הסכומים מצרפיים על-סמך הניתוח.
export const topSuppliersByProject: Record<string, TopSupplier[]> = {
  "2253": [
    { name: "ספק צנרת ראשי", totalAmount: 1_650_000, txCount: 23, category: "חומרים" },
    { name: "קבלן עבודות עפר א'", totalAmount: 1_115_352, txCount: 5, category: "קבלני משנה" },
    { name: "קבלן מסגרות ב'", totalAmount: 700_000, txCount: 4, category: "קבלני משנה" },
    { name: "ספק ציוד דלק יבוא", totalAmount: 520_000, txCount: 18, category: "חומרים" },
    { name: "ספק מתכות וברזל", totalAmount: 380_000, txCount: 10, category: "חומרים" },
    { name: "ספק שילוח בינלאומי", totalAmount: 215_000, txCount: 9, category: "חומרים" },
    { name: "ספק רכב (ליסינג)", totalAmount: 50_000, txCount: 14, category: "תקורות - רכב" },
    { name: "ספק דלק לרכבים", totalAmount: 35_000, txCount: 30, category: "תקורות - רכב" },
    { name: "ספק ארוחות (סיבוס)", totalAmount: 25_000, txCount: 10, category: "תקורות - אחר" },
  ],
  "2288": [],
  "2306": [],
};

export function getExpenseCategoryTree(projectId: string): ExpenseCategoryNode[] {
  return expenseCategoryTreeByProject[projectId] ?? [];
}

export function getTopSuppliers(projectId: string): TopSupplier[] {
  return topSuppliersByProject[projectId] ?? [];
}

export const monthlyCashflowByProject: Record<string, number[]> = {
  "2253": [814_350, 429_287, 5_012_907, 1_598_289, 1_733_681],
  "2288": [0, 250_000, 320_000, 280_000, 270_000],
  "2306": [180_000, 145_000, 110_000, 92_000, 92_000],
};

export const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי"];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po1",
    projectId: "2253",
    poNumber: "PO26-0437",
    supplierName: "ספק הנדסה גדול",
    itemSummary: "מערכת בקרה לדס\"ל - 4 יחידות + ציוד נלווה",
    totalAmount: 240_655,
    currency: "ILS",
    outstandingValue: 240_655,
    orderDate: "19/02/2026",
    expectedDeliveryDate: "30/03/2026",
    ramdorStatus: "shipped",
    userStatus: "awaiting_invoice",
    userStatusReason: "סופק - ממתינים לחשבונית מהספק",
    isLongLeadItem: true,
    daysOpen: 87,
  },
  {
    id: "po2",
    projectId: "2253",
    poNumber: "PO24-4502",
    supplierName: "ספק ציוד דלק יבוא",
    itemSummary: "מגופים ושסתומי בטיחות לקו ראשי",
    totalAmount: 47_575,
    currency: "USD",
    outstandingValue: 12_300,
    orderDate: "15/12/2024",
    expectedDeliveryDate: "20/03/2025",
    ramdorStatus: "partial",
    userStatus: "partial_complete",
    daysOpen: 153,
  },
  {
    id: "po3",
    projectId: "2253",
    poNumber: "PO25-0102",
    supplierName: "ספק הגנה קתודית",
    itemSummary: "אנודות מגנזיום + כבלים",
    totalAmount: 17_600,
    currency: "ILS",
    outstandingValue: 3_400,
    orderDate: "08/01/2025",
    expectedDeliveryDate: "22/02/2025",
    ramdorStatus: "partial",
    userStatus: "partial_complete",
    daysOpen: 95,
  },
  {
    id: "po4",
    projectId: "2253",
    poNumber: "PO25-0807",
    supplierName: "ספק צנרת ראשי",
    itemSummary: "אביזרי צנרת נירוסטה",
    totalAmount: 15_120,
    currency: "ILS",
    outstandingValue: 2_800,
    orderDate: "12/03/2025",
    expectedDeliveryDate: "10/04/2025",
    ramdorStatus: "partial",
    userStatus: "verified_closed",
    userStatusReason: "סוגרים את היתרה - לא נדרש יותר",
    daysOpen: 58,
  },
  {
    id: "po5",
    projectId: "2253",
    poNumber: "PO25-3232",
    supplierName: "ספק מתכת",
    itemSummary: "פרופילים לתמיכות צנרת",
    totalAmount: 14_179,
    currency: "ILS",
    outstandingValue: 14_179,
    orderDate: "18/09/2025",
    expectedDeliveryDate: "05/10/2025",
    ramdorStatus: "shipped",
    userStatus: "needs_review",
    userStatusReason: "צריך לבדוק - האם הסחורה הגיעה?",
    daysOpen: 42,
  },
  {
    id: "po6",
    projectId: "2253",
    poNumber: "PO26-1114",
    supplierName: "ספק נסיעות ולוגיסטיקה",
    itemSummary: "טיסות ולינה - צוות מומחים מחו\"ל",
    totalAmount: 13_500,
    currency: "EUR",
    outstandingValue: 13_500,
    orderDate: "25/04/2026",
    expectedDeliveryDate: "10/05/2026",
    ramdorStatus: "approved",
    userStatus: "pending",
    daysOpen: 22,
  },
];

export function getPurchaseOrders(projectId: string): PurchaseOrder[] {
  return purchaseOrders.filter((po) => po.projectId === projectId);
}

// 7 חשבונות חלקיים שהוגשו ע"י לסיכו לקבלן הראשי (י.ר.ן) עבור פרויקט 2253.
// סכומים אמיתיים מקובץ ה-master R02 (מצטבר ל-₪10,033,697).
export const partialBills: PartialBill[] = [
  {
    id: "pb1",
    projectId: "2253",
    billNumber: 1,
    periodLabel: "נובמבר 2024",
    invoiceNumber: "IV-191",
    invoiceDate: "27/02/2025",
    amountBeforeVat: 690_127,
    vatRate: 0.18,
    amountWithVat: 814_350,
    cumulativeBeforeVat: 690_127,
    paymentDueDate: "13/04/2025",
    paidDate: "10/04/2025",
    status: "paid",
  },
  {
    id: "pb2",
    projectId: "2253",
    billNumber: 2,
    periodLabel: "דצמבר 2024",
    invoiceNumber: "IV-352",
    invoiceDate: "31/03/2025",
    amountBeforeVat: 363_802,
    vatRate: 0.18,
    amountWithVat: 429_287,
    cumulativeBeforeVat: 1_053_930,
    paymentDueDate: "15/05/2025",
    paidDate: "14/05/2025",
    status: "paid",
  },
  {
    id: "pb3",
    projectId: "2253",
    billNumber: 3,
    periodLabel: "ינואר 2025",
    invoiceNumber: "IV-414",
    invoiceDate: "24/04/2025",
    amountBeforeVat: 4_248_226,
    vatRate: 0.18,
    amountWithVat: 5_012_907,
    cumulativeBeforeVat: 5_302_157,
    paymentDueDate: "08/06/2025",
    paidDate: "07/06/2025",
    status: "paid",
    notes: "החשבון הגדול — שיא הפרויקט",
  },
  {
    id: "pb4",
    projectId: "2253",
    billNumber: 4,
    periodLabel: "פברואר 2025",
    invoiceNumber: "IV-553",
    invoiceDate: "26/05/2025",
    amountBeforeVat: 1_354_482,
    vatRate: 0.18,
    amountWithVat: 1_598_289,
    cumulativeBeforeVat: 6_656_639,
    paymentDueDate: "10/07/2025",
    paidDate: "09/07/2025",
    status: "paid",
  },
  {
    id: "pb5",
    projectId: "2253",
    billNumber: 5,
    periodLabel: "מרץ 2025",
    invoiceNumber: "IV-660",
    invoiceDate: "30/06/2025",
    amountBeforeVat: 1_469_221,
    vatRate: 0.18,
    amountWithVat: 1_733_681,
    cumulativeBeforeVat: 8_125_860,
    paymentDueDate: "14/08/2025",
    paidDate: "13/08/2025",
    status: "paid",
  },
  {
    id: "pb6",
    projectId: "2253",
    billNumber: 6,
    periodLabel: "ספטמבר 2025",
    invoiceNumber: "IV-1280",
    invoiceDate: "26/11/2025",
    amountBeforeVat: 1_108_809,
    vatRate: 0.18,
    amountWithVat: 1_308_395,
    cumulativeBeforeVat: 9_234_669,
    paymentDueDate: "10/01/2026",
    paidDate: "09/01/2026",
    status: "paid",
  },
  {
    id: "pb7",
    projectId: "2253",
    billNumber: 7,
    periodLabel: "דצמבר 2025",
    invoiceNumber: "IV-175",
    invoiceDate: "28/02/2026",
    amountBeforeVat: 799_028,
    vatRate: 0.18,
    amountWithVat: 942_853,
    cumulativeBeforeVat: 10_033_697,
    paymentDueDate: "14/04/2026",
    status: "approved",
    notes: "אושר ע\"י המזמין — ממתין לתשלום",
  },
];

export function getPartialBills(projectId: string): PartialBill[] {
  return partialBills
    .filter((b) => b.projectId === projectId)
    .sort((a, b) => b.billNumber - a.billNumber);
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function totalsAcrossProjects(filter: ProjectStatus | "all" = "active") {
  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter || (filter === "active" && p.status === "almost-done"));
  return {
    totalRevenue: filtered.reduce((s, p) => s + p.revenue, 0),
    totalSpent: filtered.reduce((s, p) => s + p.actualSpent, 0),
    totalProfit: filtered.reduce((s, p) => s + (p.revenue - p.actualSpent), 0),
    count: filtered.length,
  };
}
