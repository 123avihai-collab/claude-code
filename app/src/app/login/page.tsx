"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function handleSignIn() {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "שגיאה לא ידועה";
      setError(msg);
      setSigningIn(false);
    }
  }

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        טוען...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          דשבורד ניהול פרויקטים
        </h1>
        <p className="text-slate-500 mb-6 text-sm">
          התחבר עם חשבון Google האישי שלך כדי להתחיל.
        </p>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.61 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.39-3.917z"
            />
            <path
              fill="#FF3D00"
              d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          {signingIn ? "מתחבר..." : "התחבר עם Google"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-start">
            <p className="font-bold mb-1">שגיאה בהתחברות:</p>
            <p className="font-mono text-xs break-all">{error}</p>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-6">
          השתמש בחשבון Google האישי שלך (לא הארגוני).
          <br />
          הנתונים שלך פרטיים — רק אתה רואה אותם.
        </p>
      </div>
    </div>
  );
}
