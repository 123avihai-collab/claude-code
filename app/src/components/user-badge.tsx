"use client";

import { useAuth } from "@/lib/auth-context";

export function UserBadge() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-sm shrink-0">
      <div className="flex flex-col items-end leading-tight min-w-0">
        <span className="font-medium text-white text-xs sm:text-sm truncate max-w-[90px] sm:max-w-none">
          {user.displayName || user.email}
        </span>
        <span
          className="text-[10px] sm:text-xs text-blue-100 font-mono hidden sm:inline"
          title={`UID מלא: ${user.uid}`}
        >
          {user.uid.slice(0, 12)}...
        </span>
      </div>
      <button
        onClick={() => signOut()}
        className="text-[10px] sm:text-xs text-blue-100 hover:text-white hover:underline"
      >
        התנתק
      </button>
    </div>
  );
}
