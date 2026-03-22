const CACHE_NAME = "demo-svg-pwa-v14";

const APP_ASSETS = [
  "./",
  "./index.html",
  "./quiz.html",
  "./styles.css",
  "./content.js",
  "./quiz-content.js",
  "./app.js",
  "./quiz.js",
  "./manifest.json",
  "./assets/hero-onboarding.png",
  "./assets/hero-onboarding2.png",
  "./etichetta-ghirigori.svg",
  "./assets/pulsante marrone.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match("./index.html"))
      );
    })
  );
});
