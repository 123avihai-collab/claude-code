import Link from "next/link";
import { UserBadge } from "./user-badge";

export function SiteHeader() {
  return (
    <header className="bg-gradient-to-l from-[#1F3864] to-[#2F5597] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          {/* TODO: replace with Avichai's logo when provided */}
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl font-bold">
            🏗️
          </div>
          <div>
            <h1 className="text-xl font-bold">ניהול פרויקטים</h1>
            <p className="text-xs text-blue-100 tracking-wider">BY ATUAN</p>
          </div>
        </Link>
        <UserBadge />
      </div>
    </header>
  );
}
