import { Injectable, computed, signal } from '@angular/core';

type InstallPlatform = 'ios' | 'android';

const STORAGE_KEYS = {
  installTutorialSeen: 'istanbulAdventure.installTutorialSeen',
  homeTutorialSeen: 'istanbulAdventure.homeTutorialSeen'
};

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly installTutorialSeenSignal = signal(this.readInstallTutorialSeen());
  private readonly homeTutorialSeenSignal = signal(window.localStorage.getItem(STORAGE_KEYS.homeTutorialSeen) === 'true');
  private readonly installPlatformSignal = signal<InstallPlatform>(this.detectPlatform());

  readonly showInstallTutorial = computed(() => !this.installTutorialSeenSignal());
  readonly showHomeTutorial = computed(() => !this.homeTutorialSeenSignal());
  readonly installPlatform = this.installPlatformSignal.asReadonly();

  setInstallPlatform(platform: InstallPlatform): void {
    this.installPlatformSignal.set(platform);
  }

  dismissInstallTutorial(): void {
    this.installTutorialSeenSignal.set(true);
    window.localStorage.setItem(STORAGE_KEYS.installTutorialSeen, 'true');
  }

  dismissHomeTutorial(): void {
    this.homeTutorialSeenSignal.set(true);
    window.localStorage.setItem(STORAGE_KEYS.homeTutorialSeen, 'true');
  }

  private readInstallTutorialSeen(): boolean {
    if (window.localStorage.getItem(STORAGE_KEYS.installTutorialSeen) === 'true') {
      return true;
    }

    return this.isStandaloneMode();
  }

  private detectPlatform(): InstallPlatform {
    const userAgent = navigator.userAgent.toLowerCase();
    const vendor = navigator.vendor.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      || vendor.includes('apple');

    return isAppleMobile ? 'ios' : 'android';
  }

  private isStandaloneMode(): boolean {
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
  }
}
