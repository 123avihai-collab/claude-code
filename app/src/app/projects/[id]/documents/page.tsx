import { notFound } from "next/navigation";
import { getProject } from "@/lib/mock-data";

type DocStorage = "firebase" | "drive" | "onedrive";

type MockDoc = {
  id: string;
  name: string;
  category: "contract" | "permit" | "invoice" | "plan" | "other";
  categoryLabel: string;
  pages: number | null;
  uploadedAt: string;
  sizeKb: number | null;
  storage: DocStorage;
  externalUrl?: string;
  icon: string;
};

const mockDocs: MockDoc[] = [
  {
    id: "d1",
    name: "חוזה_קבלן_שלד.pdf",
    category: "contract",
    categoryLabel: "חוזה",
    pages: 28,
    uploadedAt: "12/05/26",
    sizeKb: 1240,
    storage: "firebase",
    icon: "📄",
  },
  {
    id: "d2",
    name: "חוזה_חשמלאי.pdf",
    category: "contract",
    categoryLabel: "חוזה",
    pages: 15,
    uploadedAt: "03/05/26",
    sizeKb: 680,
    storage: "firebase",
    icon: "📄",
  },
  {
    id: "d3",
    name: "חוזה_אינסטלציה.pdf",
    category: "contract",
    categoryLabel: "חוזה",
    pages: 12,
    uploadedAt: "01/05/26",
    sizeKb: 520,
    storage: "firebase",
    icon: "📄",
  },
  {
    id: "d4",
    name: "היתר_בנייה.pdf",
    category: "permit",
    categoryLabel: "היתר",
    pages: 4,
    uploadedAt: "28/04/26",
    sizeKb: 180,
    storage: "firebase",
    icon: "📜",
  },
  {
    id: "d5",
    name: "חשבונית_מנדלסון_8421.pdf",
    category: "invoice",
    categoryLabel: "חשבונית",
    pages: 1,
    uploadedAt: "08/05/26",
    sizeKb: 95,
    storage: "firebase",
    icon: "🧾",
  },
  // תוכניות - שמורות ב-Drive (קישור בלבד)
  {
    id: "p1",
    name: "תוכניות_אדריכליות_v3.pdf",
    category: "plan",
    categoryLabel: "תוכנית",
    pages: 48,
    uploadedAt: "15/04/26",
    sizeKb: null,
    storage: "drive",
    externalUrl: "https://drive.google.com/file/d/example1",
    icon: "📐",
  },
  {
    id: "p2",
    name: "תוכניות_שלד_קונסטרוקציה.pdf",
    category: "plan",
    categoryLabel: "תוכנית",
    pages: 32,
    uploadedAt: "12/04/26",
    sizeKb: null,
    storage: "drive",
    externalUrl: "https://drive.google.com/file/d/example2",
    icon: "📐",
  },
  {
    id: "p3",
    name: "תוכניות_חשמל_ומיזוג.pdf",
    category: "plan",
    categoryLabel: "תוכנית",
    pages: 24,
    uploadedAt: "10/04/26",
    sizeKb: null,
    storage: "drive",
    externalUrl: "https://drive.google.com/file/d/example3",
    icon: "📐",
  },
  {
    id: "p4",
    name: "תוכנית_אדריכלית.dwg",
    category: "plan",
    categoryLabel: "תוכנית CAD",
    pages: null,
    uploadedAt: "05/04/26",
    sizeKb: null,
    storage: "drive",
    externalUrl: "https://drive.google.com/file/d/example4",
    icon: "📐",
  },
];

const categoryColors: Record<string, string> = {
  contract: "bg-purple-100 text-purple-700",
  permit: "bg-blue-100 text-blue-700",
  invoice: "bg-orange-100 text-orange-700",
  plan: "bg-cyan-100 text-cyan-700",
  other: "bg-slate-100 text-slate-700",
};

const storageColors: Record<DocStorage, { label: string; className: string; icon: string }> = {
  firebase: { label: "באפליקציה", className: "bg-emerald-100 text-emerald-700", icon: "📦" },
  drive: { label: "ב-Drive", className: "bg-blue-100 text-blue-700", icon: "☁️" },
  onedrive: { label: "ב-OneDrive", className: "bg-sky-100 text-sky-700", icon: "☁️" },
};

function formatSize(kb: number | null): string {
  if (kb === null) return "—";
  if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

export default async function ProjectDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const byCategory = mockDocs.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] ?? 0) + 1;
    return acc;
  }, {});

  const firebaseDocs = mockDocs.filter((d) => d.storage === "firebase");
  const externalDocs = mockDocs.filter((d) => d.storage !== "firebase");
  const firebaseTotalMb =
    firebaseDocs.reduce((s, d) => s + (d.sizeKb ?? 0), 0) / 1024;

  return (
    <>
      {/* Storage stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-cyan-500">
          <p className="text-slate-500 text-sm">תוכניות</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{byCategory.plan ?? 0}</p>
          <p className="text-xs text-blue-600 mt-2">☁️ ב-Drive</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-purple-500">
          <p className="text-slate-500 text-sm">חוזים</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{byCategory.contract ?? 0}</p>
          <p className="text-xs text-emerald-600 mt-2">📦 באפליקציה</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500">
          <p className="text-slate-500 text-sm">חשבוניות + היתרים</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {(byCategory.invoice ?? 0) + (byCategory.permit ?? 0)}
          </p>
          <p className="text-xs text-emerald-600 mt-2">📦 באפליקציה</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-emerald-500">
          <p className="text-slate-500 text-sm">שטח שתופס</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{firebaseTotalMb.toFixed(1)} MB</p>
          <p className="text-xs text-slate-500 mt-2">מתוך 5 GB חינמיים</p>
        </div>
      </div>

      {/* AI Agent banner */}
      <div className="card-hover bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6 border-2 border-dashed border-indigo-200">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-2xl">🤖</span>
          <h3 className="font-bold text-slate-800">סוכן AI יחפש בתוך כל המסמכים</h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full mr-auto">
            בפיתוח · פאזה 5
          </span>
        </div>
        <p className="text-sm text-slate-600">
          {firebaseDocs.length} מסמכים מאופסנים באפליקציה ייסרקו אוטומטית.
          {" "}
          {externalDocs.length} קישורי Drive ייסרקו אופציונלית (דרך OAuth) - או יהיו זמינים רק לצפייה ידנית.
        </p>
      </div>

      {/* Strategy explainer */}
      <div className="card-hover bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 mb-6 border border-cyan-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💡</span>
          <h3 className="font-bold text-slate-800">אסטרטגיית אחסון היברידית</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3">
            <p className="font-bold text-emerald-700 mb-1">📦 באפליקציה (Firebase)</p>
            <p className="text-slate-600 text-xs">
              חוזים, חשבוניות, היתרים - קבצים קטנים (פחות מ-5MB)
              שמועלים ונשמרים באפליקציה. הסוכן AI יודע לקרוא אותם.
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-bold text-blue-700 mb-1">☁️ ב-Drive / OneDrive</p>
            <p className="text-slate-600 text-xs">
              תוכניות גדולות (DWG, סטים שלמים) - נשארות בענן שלך,
              האפליקציה רק שומרת קישור. פתיחה ב-iframe או בטאב חדש.
            </p>
          </div>
        </div>
      </div>

      {/* Documents grid */}
      <div className="card-hover bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-slate-800">מסמכי הפרויקט</h3>
            <div className="flex gap-2 text-xs flex-wrap">
              <button className="px-3 py-1 bg-[#1F3864] text-white rounded-full">הכל</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">חוזים</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">תוכניות</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">חשבוניות</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">היתרים</button>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
              🔗 קשר קובץ מ-Drive
            </button>
            <button className="bg-[#1F3864] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2F5597]">
              📤 העלה קובץ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockDocs.map((doc) => {
            const storage = storageColors[doc.storage];
            return (
              <div
                key={doc.id}
                className="card-hover border border-slate-200 rounded-xl p-4 hover:border-blue-300 cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{doc.icon}</div>
                  <div className="flex flex-col gap-1 items-end">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${categoryColors[doc.category]}`}
                    >
                      {doc.categoryLabel}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${storage.className}`}>
                      {storage.icon} {storage.label}
                    </span>
                  </div>
                </div>
                <p className="font-medium text-slate-800 truncate" title={doc.name}>
                  {doc.name}
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                  <span>
                    {doc.pages !== null ? `${doc.pages} עמ׳ · ` : ""}
                    {formatSize(doc.sizeKb)}
                  </span>
                  {doc.storage === "firebase" && (
                    <span className="text-green-600">✓ נסרק AI</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">📅 הועלה {doc.uploadedAt}</p>
                <div className="flex gap-1 mt-3 pt-3 border-t">
                  {doc.storage === "firebase" ? (
                    <>
                      <button className="flex-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 px-2 py-1 rounded text-xs">
                        👁 צפה
                      </button>
                      <button className="flex-1 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded text-xs">
                        ⬇ הורד
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        🔗 פתח ב-{doc.storage === "drive" ? "Drive" : "OneDrive"}
                      </button>
                      <button className="flex-1 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded text-xs">
                        👁 הצג כאן
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <button className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors min-h-48">
            <div className="text-3xl mb-2">📤</div>
            <p className="text-sm font-medium">העלה / קשר קובץ</p>
            <p className="text-xs mt-1">או גרור לכאן</p>
          </button>
        </div>
      </div>

      {/* PDF Viewer mockup */}
      <div className="card-hover bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">📺 צופה מובנה - איך זה ייראה</h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            בפיתוח · PDF.js + Drive embed
          </span>
        </div>
        <div className="bg-slate-100 rounded-xl p-4 min-h-80 relative">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-300">
            <div>
              <p className="font-bold text-slate-800">תוכניות_אדריכליות_v3.pdf</p>
              <p className="text-xs text-slate-500">עמ׳ 12 מתוך 48 · ☁️ ב-Drive</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="bg-white border border-slate-300 px-2 py-1 rounded">‹</button>
              <input
                disabled
                value="12 / 48"
                className="bg-white border border-slate-300 rounded px-2 py-1 w-16 text-center"
              />
              <button className="bg-white border border-slate-300 px-2 py-1 rounded">›</button>
              <button className="bg-white border border-slate-300 px-2 py-1 rounded">🔍 100%</button>
              <button className="bg-white border border-slate-300 px-2 py-1 rounded">📥</button>
              <button className="bg-white border border-slate-300 px-2 py-1 rounded">🔗 ב-Drive</button>
            </div>
          </div>
          <div className="aspect-video bg-white rounded-lg shadow-inner flex flex-col items-center justify-center text-slate-400">
            <div className="text-6xl mb-3">📐</div>
            <p className="text-sm font-medium">תצוגה מקדימה של תוכנית</p>
            <p className="text-xs mt-1">PDF.js יציג את הקובץ בפועל כאן</p>
            <p className="text-xs mt-1">קבצי DWG ייפתחו ב-iframe של Google Drive Viewer</p>
          </div>
        </div>
      </div>
    </>
  );
}
