import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AuthGuard } from "@/components/auth-guard";
import { RoadmapBoard } from "@/components/roadmap-board";

export default function RoadmapPage() {
  return (
    <AuthGuard>
      <SiteHeader />
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm mb-4">
          <Link href="/" className="text-slate-500 hover:text-blue-600">
            🏠 ראשי
          </Link>
          <span className="text-slate-400">›</span>
          <span className="font-bold text-slate-800">מפת דרכים</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            📋 מפת דרכים — משימות האפליקציה
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            עבור על המשימות וסמן מה שהושלם. הסימונים נשמרים בדפדפן שלך.
          </p>
        </div>

        <RoadmapBoard />
      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        Beta · בנייה הדרגתית
      </footer>
    </AuthGuard>
  );
}
