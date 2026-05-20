export type RoadmapTask = {
  id: string;
  label: string;
  note?: string;
  defaultDone?: boolean;
  size?: string; // הערכת זמן
};

export type RoadmapGroup = {
  id: string;
  title: string;
  icon: string;
  color: string; // tailwind border color class
  tasks: RoadmapTask[];
};

export const roadmapGroups: RoadmapGroup[] = [
  {
    id: "done",
    title: "הושלם",
    icon: "✅",
    color: "border-green-500",
    tasks: [
      { id: "cleanup", label: "ניקוי עמודי mock (משימות / מסמכים / קבלנים)", defaultDone: true },
      { id: "bill-form", label: "טופס הזנת חשבון חלקי חדש (localStorage)", defaultDone: true },
      { id: "mobile-core", label: "רספונסיביות לנייד — עמודים עיקריים", defaultDone: true },
      { id: "summary-row", label: "שורת סיכום מאוחדת בעמוד הכנסות", defaultDone: true },
      { id: "bill-calc", label: 'חישוב עיכבונות תע"א + י.ר.ן פר חשבון', defaultDone: true },
    ],
  },
  {
    id: "major",
    title: "פיצ'רים עיקריים",
    icon: "🚀",
    color: "border-blue-500",
    tasks: [
      {
        id: "firestore",
        label: "חיבור Firestore — שמירת נתונים בענן",
        note: "כל הנתונים יישמרו בענן במקום localStorage / hardcoded. נגיש מכל מכשיר.",
        size: "סשן מלא",
      },
      {
        id: "excel-import",
        label: "ייבוא מ-Excel (Importer)",
        note: "העלאת קובץ Master → השורות נכנסות אוטומטית.",
        size: "חצי סשן",
      },
      {
        id: "bill-builder-boq",
        label: 'בונה חשבון מלא — כולל סעיפי כתב כמויות (חשבון 9)',
        note: "הרחבת הטופס הקיים: הזנת סעיפי BoQ, כמויות, מוחזקים/קיזוזים.",
        size: "סשן מלא",
      },
      {
        id: "pdf-export",
        label: "ייצוא PDF / Excel של חשבון",
        note: "הפקת מסמך רשמי להגשה למזמין.",
        size: "סשן מלא",
      },
    ],
  },
  {
    id: "buttons",
    title: "כפתורים לחבר (כרגע לא פעילים)",
    icon: "🎯",
    color: "border-purple-500",
    tasks: [
      { id: "btn-new-project", label: '"+ פרויקט חדש" — יצירת פרויקט' },
      { id: "btn-import-excel", label: '"📥 ייבא מ-Excel" בדף הבית' },
      { id: "btn-add-exception", label: '"+ הוסף חריג" בפאנל החריגים' },
      { id: "btn-edit-bill", label: "עריכה / מחיקה של חשבון קיים" },
    ],
  },
  {
    id: "fixes",
    title: "תיקונים ושיפורים",
    icon: "🔧",
    color: "border-amber-500",
    tasks: [
      { id: "fix-decimals", label: "תיקון מספרים עם 0.18499..." },
      { id: "fix-contractors", label: "שמות קבלנים אמיתיים בעמוד 2253" },
      { id: "fix-dates", label: "אחידות פורמט תאריכים בכל האפליקציה" },
      { id: "fix-mvp-labels", label: 'הסרת תוויות "MVP" / "נתוני mock"' },
      { id: "fix-uid", label: "קיצור ה-UID בכותרת ל-4 תווים" },
      { id: "fix-logo", label: "החלפת 🏗️ בלוגו אמיתי" },
    ],
  },
  {
    id: "mobile-extra",
    title: "נייד — שיפורים נוספים",
    icon: "📱",
    color: "border-pink-500",
    tasks: [
      { id: "mobile-subnav", label: "תפריט המבורגר לסאב-נאב בנייד" },
      { id: "mobile-boq", label: "טבלת סעיפי BoQ → כרטיסים בנייד" },
      { id: "mobile-finance", label: "בדיקת עמוד הוצאות (finance) בנייד" },
    ],
  },
];

export function totalTaskCount(): number {
  return roadmapGroups.reduce((s, g) => s + g.tasks.length, 0);
}
