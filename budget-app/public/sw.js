// Service Worker מינימלי ל-PWA: מאפשר התקנה ומספק fallback בסיסי.
// אסטרטגיה: network-first לניווט (כדי שנתונים יישארו עדכניים), cache לנכסים סטטיים.

const CACHE = "kalkalat-bait-v1";
const STATIC_ASSETS = ["/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC_ASSETS)).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // לא לגעת בבקשות API/אימות — תמיד רשת.
  if (url.pathname.startsWith("/auth") || url.search.includes("supabase")) return;

  // נכסים סטטיים: cache-first
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request)),
    );
    return;
  }
});
