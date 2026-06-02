"use client";

import { useEffect } from "react";

/** רושם את ה-Service Worker (בפרודקשן בלבד) כדי לאפשר התקנה כ-PWA. */
export function SWRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
