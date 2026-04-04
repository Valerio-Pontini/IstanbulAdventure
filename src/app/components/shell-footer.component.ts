import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ia-shell-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <footer class="shell-footer">
      <nav class="shell-footer__nav" aria-label="Navigazione mobile">
        <a routerLink="/" routerLinkActive="shell-footer__link--active" [routerLinkActiveOptions]="{ exact: true }">
          <strong>Ingresso</strong>
          <span>Rituale</span>
        </a>
        <a routerLink="/quiz" routerLinkActive="shell-footer__link--active">
          <strong>Quiz</strong>
          <span>Missione 0</span>
        </a>
        <a routerLink="/home" routerLinkActive="shell-footer__link--active">
          <strong>Home</strong>
          <span>Percorsi</span>
        </a>
        <a routerLink="/archive/personal" routerLinkActive="shell-footer__link--active">
          <strong>Archivio</strong>
          <span>Per te</span>
        </a>
      </nav>

      <p class="shell-footer__note">Ogni missione e' un invito a guardare Istanbul con piu' attenzione, curiosita' e meraviglia.</p>
    </footer>
  `
})
export class ShellFooterComponent {}
