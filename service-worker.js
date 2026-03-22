const CACHE_NAME = "istanbul-adventure-pwa-v15";

const APP_ASSETS = [
  "./",
  "./index.html",
  "./quiz.html",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/theme/bg-main-default.svg",
  "./assets/theme/bg-overlay-default.svg",
  "./assets/theme/map-fragment-default.svg",
  "./assets/theme/grain-default.svg",
  "./assets/theme/icon-seal-default.svg",
  "./assets/theme/icon-story-default.svg",
  "./assets/theme/icon-mission-default.svg",
  "./assets/theme/icon-complete-default.svg"
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
