const CACHE_NAME = "istanbul-adventure-pwa-v18";

const APP_ASSETS = [
  "./",
  "./index.html",
  "./quiz.html",
  "./manifest.json",
  "./styles.css",
  "./app.js",
  "./quiz.js",
  "./content.js",
  "./quiz-content.js",
  "./mission-0-result-content.js",
  "./mission-home-content.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/ui/welcome-bg.jpg",
  "./assets/ui/quiz-bg.jpg",
  "./assets/ui/home-bg.jpg",
  "./assets/ui/detail-bg.jpg",
  "./assets/symbols/archivisti.svg",
  "./assets/symbols/leggende.svg",
  "./assets/symbols/citta.svg",
  "./assets/symbols/tradizioni.svg",
  "./assets/symbols/simboli.svg",
  "./assets/symbols/generic.svg",
  "./assets/symbols/luoghi.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request).catch(() => caches.match("./index.html"))));
});
