import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AppToastComponent } from './components/app-toast.component';
import { GuidedTourComponent } from './components/guided-tour.component';
import { PrimaryButtonComponent } from './components/primary-button.component';
import { ShellHeaderComponent } from './components/shell-header.component';
import { LegacyContentService } from './services/legacy-content.service';
import { OnboardingService } from './services/onboarding.service';

@Component({
  selector: 'ia-root',
  standalone: true,
  imports: [RouterOutlet, ShellHeaderComponent, AppToastComponent, PrimaryButtonComponent, GuidedTourComponent],
  template: `
    <div class="app-backdrop" aria-hidden="true"></div>
    <div class="game-shell" [class.game-shell--narrative]="narrativeChrome()">
      <ia-shell-header />
      <main class="game-shell__viewport">
        <router-outlet />
      </main>
    </div>

    @if (onboarding.showInstallTutorial()) {
      <div class="overlay onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="install-onboarding-title">
        <section class="overlay__card onboarding-card onboarding-card--install">
          <div class="onboarding-card__eyebrow">{{ t('angular.app.install.eyebrow', 'Prima di iniziare') }}</div>
          <h2 id="install-onboarding-title">{{ t('angular.app.install.title', 'Aggiungi la web app alla schermata Home') }}</h2>
          <p class="onboarding-card__lead">
            {{ t('angular.app.install.lead', "Per usare l'esperienza in modalita' mobile come previsto, apri questa web app dalla Home del telefono. Ti basta farlo una volta.") }}
          </p>

          <div class="platform-switch" role="tablist" [attr.aria-label]="t('angular.app.install.platformLabel', 'Scegli il tuo telefono')">
            <button
              type="button"
              class="platform-switch__button"
              [class.platform-switch__button--active]="onboarding.installPlatform() === 'ios'"
              [attr.aria-selected]="onboarding.installPlatform() === 'ios'"
              (click)="onboarding.setInstallPlatform('ios')"
            >
              {{ t('angular.app.install.iosLabel', 'iPhone / iPad') }}
            </button>
            <button
              type="button"
              class="platform-switch__button"
              [class.platform-switch__button--active]="onboarding.installPlatform() === 'android'"
              [attr.aria-selected]="onboarding.installPlatform() === 'android'"
              (click)="onboarding.setInstallPlatform('android')"
            >
              {{ t('angular.app.install.androidLabel', 'Android') }}
            </button>
          </div>

          @if (onboarding.installPlatform() === 'ios') {
            <ol class="onboarding-list">
              <li>{{ t('angular.app.install.iosStep1', 'Apri la web app in Safari.') }}</li>
              <li>{{ t('angular.app.install.iosStep2', 'Tocca il tasto Condividi nella barra del browser.') }}</li>
              <li>{{ t('angular.app.install.iosStep3', 'Seleziona "Aggiungi a Home" e conferma.') }}</li>
              <li>{{ t('angular.app.install.iosStep4', "Da quel momento entra sempre dall'icona creata sulla Home.") }}</li>
            </ol>
          } @else {
            <ol class="onboarding-list">
              <li>{{ t('angular.app.install.androidStep1', 'Apri la web app in Chrome.') }}</li>
              <li>{{ t('angular.app.install.androidStep2', 'Tocca il menu con i tre puntini in alto a destra.') }}</li>
              <li>{{ t('angular.app.install.androidStep3', 'Scegli "Aggiungi a schermata Home" oppure "Installa app".') }}</li>
              <li>{{ t('angular.app.install.androidStep4', 'Conferma e poi apri sempre la web app dall\'icona sulla Home.') }}</li>
            </ol>
          }

          <p class="onboarding-card__hint">
            {{ t('angular.app.install.hint', "Se hai gia aggiunto l'app alla Home, puoi continuare subito.") }}
          </p>

          <div class="onboarding-card__actions">
            <ia-primary-button [label]="t('angular.app.install.button', 'Continua')" (pressed)="continueAfterInstallTutorial()" />
          </div>
        </section>
      </div>
    }

    <ia-guided-tour />
    <ia-app-toast />
  `
})
export class AppComponent {
  private readonly content = inject(LegacyContentService);
  readonly onboarding = inject(OnboardingService);
  private readonly router = inject(Router);

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
  readonly narrativeChrome = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.isNarrativeUrl(event.urlAfterRedirects)),
      startWith(this.isNarrativeUrl(this.router.url))
    ),
    { initialValue: this.isNarrativeUrl(this.router.url) }
  );

  private isNarrativeUrl(url: string): boolean {
    return url.startsWith('/story') || url.startsWith('/quiz') || url.startsWith('/mission/');
  }

  continueAfterInstallTutorial(): void {
    this.onboarding.dismissInstallTutorial();
  }
}
