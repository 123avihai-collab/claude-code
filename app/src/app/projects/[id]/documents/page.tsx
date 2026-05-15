import { notFound } from "next/navigation";
import { getProject } from "@/lib/mock-data";

const mockDocs = [
  {
    id: "d1",
    name: "חוזה_קבלן_שלד.pdf",
    category: "contract",
    categoryLabel: "חוזה",
    pages: 28,
    uploadedAt: "12/05/26",
    sizeKb: 1240,
    status: "ready",
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
    status: "ready",
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
    status: "ready",
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
    status: "ready",
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
    status: "ready",
    icon: "🧾",
  },
  {
    id: "d6",
    name: "תוכנית_שלד_v3.pdf",
    category: "other",
    categoryLabel: "תוכנית",
    pages: 22,
    uploadedAt: "15/04/26",
    sizeKb: 3400,
    status: "ready",
    icon: "📐",
  },
];

const categoryColors: Record<string, string> = {
  contract: "bg-purple-100 text-purple-700",
  permit: "bg-blue-100 text-blue-700",
  invoice: "bg-orange-100 text-orange-700",
  other: "bg-slate-100 text-slate-700",
};

function formatSize(kb: number): string {
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-purple-500">
          <p className="text-slate-500 text-sm">חוזים</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{byCategory.contract ?? 0}</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-blue-500">
          <p className="text-slate-500 text-sm">היתרים</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{byCategory.permit ?? 0}</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-orange-500">
          <p className="text-slate-500 text-sm">חשבוניות</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{byCategory.invoice ?? 0}</p>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border-r-4 border-emerald-500">
          <p className="text-slate-500 text-sm">סך הכל</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{mockDocs.length}</p>
          <p className="text-xs text-green-600 mt-2">✓ כולם נסרקו לסוכן AI</p>
        </div>
      </div>

      <div className="card-hover bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6 border-2 border-dashed border-indigo-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🤖</span>
          <h3 className="font-bold text-slate-800">
            סוכן AI יכול לחפש בתוך כל החוזים האלה
          </h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full mr-auto">
            בפיתוח · פאזה 5
          </span>
        </div>
        <p className="text-sm text-slate-600">
          העלית {mockDocs.filter((d) => d.category === "contract").length} חוזים. הסוכן יענה
          על שאלות כמו: &quot;מתי תאריך מסירת השלד?&quot;, &quot;כמה התשלום הבא לחשמלאי?&quot;,
          &quot;מה תוקף ההיתר?&quot; - עם ציטוטים למסמך ולעמוד.
        </p>
      </div>

      <div className="card-hover bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800">מסמכים שהועלו</h3>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 bg-[#1F3864] text-white rounded-full">הכל</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">חוזים</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">חשבוניות</button>
              <button className="px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200">היתרים</button>
            </div>
          </div>
          <button className="bg-[#1F3864] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2F5597]">
            📤 העלה מסמך
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockDocs.map((doc) => (
            <div
              key={doc.id}
              className="card-hover border border-slate-200 rounded-xl p-4 hover:border-blue-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-3xl">{doc.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[doc.category]}`}>
                  {doc.categoryLabel}
                </span>
              </div>
              <p className="font-medium text-slate-800 truncate" title={doc.name}>
                {doc.name}
              </p>
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{doc.pages} עמ׳ · {formatSize(doc.sizeKb)}</span>
                <span className="text-green-600">✓ נסרק</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">📅 הועלה {doc.uploadedAt}</p>
            </div>
          ))}

          <button className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors min-h-32">
            <div className="text-3xl mb-2">📤</div>
            <p className="text-sm font-medium">העלה מסמך חדש</p>
            <p className="text-xs mt-1">או גרור לכאן</p>
          </button>
        </div>
      </div>
    </>
  );
}
