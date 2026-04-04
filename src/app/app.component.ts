import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppToastComponent } from './components/app-toast.component';
import { GuidedTourComponent } from './components/guided-tour.component';
import { PrimaryButtonComponent } from './components/primary-button.component';
import { ShellFooterComponent } from './components/shell-footer.component';
import { ShellHeaderComponent } from './components/shell-header.component';
import { GuidedTourService } from './services/guided-tour.service';
import { OnboardingService } from './services/onboarding.service';

@Component({
  selector: 'ia-root',
  standalone: true,
  imports: [RouterOutlet, ShellHeaderComponent, ShellFooterComponent, AppToastComponent, PrimaryButtonComponent, GuidedTourComponent],
  template: `
    <div class="app-backdrop" aria-hidden="true"></div>
    <div class="app-shell">
      <ia-shell-header />
      <main class="app-main">
        <router-outlet />
      </main>
      <ia-shell-footer />
    </div>

    @if (onboarding.showInstallTutorial()) {
      <div class="overlay onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="install-onboarding-title">
        <section class="overlay__card onboarding-card onboarding-card--install">
          <div class="onboarding-card__eyebrow">Prima di iniziare</div>
          <h2 id="install-onboarding-title">Aggiungi la web app alla schermata Home</h2>
          <p class="onboarding-card__lead">
            Per usare l'esperienza in modalita' mobile come previsto, apri questa web app dalla Home del telefono.
            Ti basta farlo una volta.
          </p>

          <div class="platform-switch" role="tablist" aria-label="Scegli il tuo telefono">
            <button
              type="button"
              class="platform-switch__button"
              [class.platform-switch__button--active]="onboarding.installPlatform() === 'ios'"
              [attr.aria-selected]="onboarding.installPlatform() === 'ios'"
              (click)="onboarding.setInstallPlatform('ios')"
            >
              iPhone / iPad
            </button>
            <button
              type="button"
              class="platform-switch__button"
              [class.platform-switch__button--active]="onboarding.installPlatform() === 'android'"
              [attr.aria-selected]="onboarding.installPlatform() === 'android'"
              (click)="onboarding.setInstallPlatform('android')"
            >
              Android
            </button>
          </div>

          @if (onboarding.installPlatform() === 'ios') {
            <ol class="onboarding-list">
              <li>Apri la web app in Safari.</li>
              <li>Tocca il tasto Condividi nella barra del browser.</li>
              <li>Seleziona "Aggiungi a Home" e conferma.</li>
              <li>Da quel momento entra sempre dall'icona creata sulla Home.</li>
            </ol>
          } @else {
            <ol class="onboarding-list">
              <li>Apri la web app in Chrome.</li>
              <li>Tocca il menu con i tre puntini in alto a destra.</li>
              <li>Scegli "Aggiungi a schermata Home" oppure "Installa app".</li>
              <li>Conferma e poi apri sempre la web app dall'icona sulla Home.</li>
            </ol>
          }

          <p class="onboarding-card__hint">
            Se hai gia' aggiunto l'app alla Home, puoi continuare subito.
          </p>

          <div class="onboarding-card__actions">
            <ia-primary-button label="Continua" (pressed)="continueAfterInstallTutorial()" />
          </div>
        </section>
      </div>
    }

    <ia-guided-tour />
    <ia-app-toast />
  `
})
export class AppComponent {
  readonly onboarding = inject(OnboardingService);
  private readonly router = inject(Router);
  private readonly guidedTour = inject(GuidedTourService);

  continueAfterInstallTutorial(): void {
    this.onboarding.dismissInstallTutorial();

    if (this.router.url.startsWith('/home') && this.onboarding.showHomeTutorial()) {
      void this.guidedTour.startIfNeeded();
    }
  }
}
