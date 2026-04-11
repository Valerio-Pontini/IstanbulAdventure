import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ia-shell-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="shell-header">
      <div class="shell-header__bar">
        <a class="brand" routerLink="/">
          <span class="brand__kicker">Secret Companion</span>
          <span class="brand__title">Istanbul Adventure</span>
        </a>

        <nav class="shell-header__nav" aria-label="Navigazione principale">
          <a class="shell-nav-link" routerLink="/" routerLinkActive="shell-nav-link--active" [routerLinkActiveOptions]="{ exact: true }">Ingresso</a>
          <a class="shell-nav-link" routerLink="/quiz" routerLinkActive="shell-nav-link--active">Missione 0</a>
          <a class="shell-nav-link" routerLink="/home" routerLinkActive="shell-nav-link--active">Home</a>
          <a class="shell-nav-link" routerLink="/missions" routerLinkActive="shell-nav-link--active">Missioni</a>
        </nav>

        <div class="status-pill" [attr.aria-label]="'Vista corrente: ' + currentLabel()">
          {{ currentLabel() }}
        </div>
      </div>
    </header>
  `
})
export class ShellHeaderComponent {
  private readonly router = inject(Router);
  readonly currentLabel = signal('Ingresso');

  constructor() {
    this.updateLabel(this.router.url);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.updateLabel((event as NavigationEnd).urlAfterRedirects);
    });
  }

  private updateLabel(url: string): void {
    if (url.startsWith('/story')) {
      this.currentLabel.set('Prologo');
      return;
    }

    if (url.startsWith('/quiz')) {
      this.currentLabel.set('Missione 0');
      return;
    }

    if (url.startsWith('/result')) {
      this.currentLabel.set('Esito');
      return;
    }

    if (url.startsWith('/archive')) {
      this.currentLabel.set('Archivio');
      return;
    }

    if (url.startsWith('/missions')) {
      this.currentLabel.set('Tutte le missioni');
      return;
    }

    if (url.startsWith('/mission')) {
      this.currentLabel.set('Dettaglio');
      return;
    }

    if (url.startsWith('/home')) {
      this.currentLabel.set('Home missioni');
      return;
    }

    this.currentLabel.set('Ingresso');
  }
}
