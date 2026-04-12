import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function cleanupLegacyServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }
  } catch (error) {
    console.warn('Unable to cleanup legacy service workers.', error);
  }
}

cleanupLegacyServiceWorkers()
  .finally(() => bootstrapApplication(AppComponent, appConfig))
  .catch((error) => console.error(error));
