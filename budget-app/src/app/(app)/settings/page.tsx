import { getCategories } from "@/lib/db/queries";
import { CategoriesManager } from "./_components/categories-manager";
import { ImportPanel } from "./_components/import-panel";
import { t } from "@/lib/strings";

export default async function SettingsPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">{t.nav.settings}</h1>

      <section className="space-y-4">
        <h2 className="font-semibold">קטגוריות</h2>
        <CategoriesManager categories={categories} />
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">ייבוא נתונים מ-Excel/CSV</h2>
        <p className="text-sm text-muted">
          אפשר להעלות <strong>דוח אשראי של כאל</strong> כפי שירד (האפליקציה מזהה
          את הפורמט ומקטלגת אוטומטית לפי בית העסק), או קובץ כללי עם העמודות:
          תאריך, סוג, קטגוריה, סכום, הערה (הורד תבנית כדי להתחיל). תמיד מוצגת תצוגה
          מקדימה לפני שמירה. ייצוא תנועות זמין בעמוד התנועות.
        </p>
        <ImportPanel categories={categories} />
      </section>
    </div>
  );
}
