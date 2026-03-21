const CACHE_NAME = "travelgame-shell-v3";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/src/main.js",
  "/src/content/game-text.js",
  "/src/ui/app-shell.js",
  "/src/styles/index.css",
  "/src/styles/tokens.css",
  "/src/styles/base.css",
  "/src/styles/layout.css",
  "/src/styles/components.css",
  "/src/assets/app-background.png",
  "/src/assets/hero-onboarding.png",
  "/src/assets/hero-onboarding-2.png",
  "/src/assets/ui/textBox.svg",
  "/src/assets/ui/etichetta-ghirigori.svg",
  "/src/assets/ui/pulsante-marrone.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});
