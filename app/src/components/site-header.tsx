import Link from "next/link";
import { UserBadge } from "./user-badge";

export function SiteHeader() {
  return (
    <header className="bg-gradient-to-l from-[#1F3864] to-[#2F5597] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* TODO: replace with Avichai's logo when provided */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold shrink-0">
            🏗️
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold truncate">ניהול פרויקטים</h1>
            <p className="text-[10px] sm:text-xs text-blue-100 tracking-wider">BY ATUAN</p>
          </div>
        </Link>
        <UserBadge />
      </div>
    </header>
  );
}
