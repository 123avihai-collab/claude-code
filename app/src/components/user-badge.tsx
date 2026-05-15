"use client";

import { useAuth } from "@/lib/auth-context";

export function UserBadge() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg px-3 py-1.5 text-sm">
      <div className="flex flex-col items-end leading-tight">
        <span className="font-medium text-white">
          {user.displayName || user.email}
        </span>
        <span
          className="text-xs text-blue-100 font-mono"
          title={`UID מלא: ${user.uid}`}
        >
          {user.uid.slice(0, 12)}...
        </span>
      </div>
      <button
        onClick={() => signOut()}
        className="text-xs text-blue-100 hover:text-white hover:underline"
      >
        התנתק
      </button>
    </div>
  );
}
