import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ב-Next 16 "middleware" הוחלף ב-"proxy" (אותה פונקציונליות).
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * כל המסלולים פרט ל:
     * - קבצים סטטיים (_next/static, _next/image, favicon, אייקונים)
     * - manifest ו-service worker
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
