import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionStateService } from '../services/mission-state.service';

@Component({
  selector: 'ia-shell-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="shell-header">
      <div class="shell-header__bar">
        <a class="brand" routerLink="/">
          <span class="brand__kicker">{{ t('angular.shellHeader.brandKicker', 'Secret Companion') }}</span>
          <span class="brand__title">{{ t('angular.shellHeader.brandTitle', 'Istanbul Adventure') }}</span>
        </a>

        <nav class="shell-header__nav" [attr.aria-label]="t('angular.shellHeader.navAria', 'Navigazione principale')">
          @if (!homeUnlocked()) {
            <a class="shell-nav-link" routerLink="/" routerLinkActive="shell-nav-link--active" [routerLinkActiveOptions]="{ exact: true }">{{ t('angular.shellHeader.entry', 'Ingresso') }}</a>
            <a class="shell-nav-link" routerLink="/quiz" routerLinkActive="shell-nav-link--active">{{ t('angular.shellHeader.mission0', 'Missione 0') }}</a>
          }
          <a class="shell-nav-link" routerLink="/home" routerLinkActive="shell-nav-link--active">{{ t('angular.shellHeader.home', 'Home') }}</a>
          <a class="shell-nav-link" routerLink="/missions" routerLinkActive="shell-nav-link--active">{{ t('angular.shellHeader.missions', 'Missioni') }}</a>
        </nav>

        <div class="shell-header__tail">
          @if (narrativeRoute()) {
            <button
              type="button"
              class="shell-header__menu-btn"
              aria-haspopup="dialog"
              [attr.aria-expanded]="pauseOpen()"
              (click)="pauseOpen.set(true)"
            >
              {{ t('angular.shellHeader.menu', 'Menu') }}
            </button>
          }
          <div class="status-pill" [attr.aria-label]="t('angular.shellHeader.currentViewPrefix', 'Vista corrente: ') + currentLabel()">
            {{ currentLabel() }}
          </div>
        </div>
      </div>
    </header>

    @if (pauseOpen()) {
      <div
        class="ia-overlay ia-overlay--modal pause-menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-menu-title"
      >
        <section class="pause-menu ia-overlay__card">
          <h2 id="pause-menu-title" class="pause-menu__title">{{ t('angular.shellHeader.pauseTitle', 'Menu di pausa') }}</h2>
          <p class="pause-menu__lead">{{ t('angular.shellHeader.pauseLead', 'Torna al hub, sfoglia l\'elenco, o riprendi da qui.') }}</p>
          <nav class="pause-menu__nav" [attr.aria-label]="t('angular.shellHeader.quickLinksAria', 'Collegamenti rapidi')">
            <a class="pause-menu__link" routerLink="/home" (click)="closePause()">{{ t('angular.shellHeader.hubMissions', 'Hub missioni') }}</a>
            <a class="pause-menu__link" routerLink="/missions" (click)="closePause()">{{ t('angular.shellHeader.allMissions', 'Tutte le missioni') }}</a>
            @if (!homeUnlocked()) {
              <a class="pause-menu__link" routerLink="/" (click)="closePause()">{{ t('angular.shellHeader.entry', 'Ingresso') }}</a>
            }
          </nav>
          <button type="button" class="shell-header__menu-btn pause-menu__resume" (click)="closePause()">{{ t('angular.common.continue', 'Continua') }}</button>
        </section>
      </div>
    }
  `
})
export class ShellHeaderComponent {
  private readonly content = inject(LegacyContentService);
  private readonly router = inject(Router);
  private readonly state = inject(MissionStateService);
  readonly homeUnlocked = this.state.homeUnlocked;
  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
  readonly currentLabel = signal(this.homeUnlocked() ? this.t('angular.shellHeader.hubMissions', 'Hub missioni') : this.t('angular.shellHeader.entry', 'Ingresso'));
  readonly narrativeRoute = signal(false);
  readonly pauseOpen = signal(false);

  constructor() {
    this.applyNarrativeFlag(this.router.url);
    this.updateLabel(this.router.url);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const url = (event as NavigationEnd).urlAfterRedirects;
      this.applyNarrativeFlag(url);
      this.updateLabel(url);
      this.pauseOpen.set(false);
    });
  }

  closePause(): void {
    this.pauseOpen.set(false);
  }

  private applyNarrativeFlag(url: string): void {
    this.narrativeRoute.set(url.startsWith('/story') || url.startsWith('/quiz') || url.startsWith('/mission/'));
  }

  private updateLabel(url: string): void {
    if (url.startsWith('/story')) {
      this.currentLabel.set(this.t('angular.shellHeader.prologue', 'Prologo'));
      return;
    }

    if (url.startsWith('/quiz')) {
      this.currentLabel.set(this.t('angular.shellHeader.mission0', 'Missione 0'));
      return;
    }

    if (url.startsWith('/result')) {
      this.currentLabel.set(this.t('angular.shellHeader.outcome', 'Esito'));
      return;
    }

    if (url.startsWith('/archive')) {
      this.currentLabel.set(this.t('angular.shellHeader.archive', 'Archivio'));
      return;
    }

    if (url.startsWith('/missions')) {
      this.currentLabel.set(this.t('angular.shellHeader.allMissions', 'Tutte le missioni'));
      return;
    }

    if (url.startsWith('/mission')) {
      this.currentLabel.set(this.t('angular.shellHeader.mission', 'Missione'));
      return;
    }

    if (url.startsWith('/home')) {
      this.currentLabel.set(this.t('angular.shellHeader.hubMissions', 'Hub missioni'));
      return;
    }

    this.currentLabel.set(this.homeUnlocked() ? this.t('angular.shellHeader.hubMissions', 'Hub missioni') : this.t('angular.shellHeader.entry', 'Ingresso'));
  }
}
