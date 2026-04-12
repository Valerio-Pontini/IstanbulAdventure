self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (error) {
        // Keep activation resilient even if cache storage is unavailable.
        console.warn("Legacy service worker cache cleanup failed.", error);
      }

      await self.clients.claim();
      await self.registration.unregister();
    })()
  );
});
