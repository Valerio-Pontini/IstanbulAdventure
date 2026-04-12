import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionStateService } from '../services/mission-state.service';

@Component({
  selector: 'ia-shell-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <footer class="shell-footer">
      <nav
        class="shell-footer__nav"
        [class.shell-footer__nav--compact]="!homeUnlocked()"
        [attr.aria-label]="t('angular.shellFooter.mobileNavAria', 'Navigazione mobile')"
      >
        @if (!homeUnlocked()) {
          <a routerLink="/" routerLinkActive="shell-footer__link--active" [routerLinkActiveOptions]="{ exact: true }">
            <strong>{{ t('angular.shellFooter.entryTitle', 'Ingresso') }}</strong>
            <span>{{ t('angular.shellFooter.entrySubtitle', 'Rituale') }}</span>
          </a>
          <a routerLink="/quiz" routerLinkActive="shell-footer__link--active">
            <strong>{{ t('angular.shellFooter.quizTitle', 'Quiz') }}</strong>
            <span>{{ t('angular.shellFooter.quizSubtitle', 'Missione 0') }}</span>
          </a>
        }
        <a routerLink="/home" routerLinkActive="shell-footer__link--active">
          <strong>{{ t('angular.shellFooter.homeTitle', 'Home') }}</strong>
          <span>{{ t('angular.shellFooter.homeSubtitle', 'Percorsi') }}</span>
        </a>
        <a routerLink="/missions" routerLinkActive="shell-footer__link--active">
          <strong>{{ t('angular.shellFooter.missionsTitle', 'Missioni') }}</strong>
          <span>{{ t('angular.shellFooter.missionsSubtitle', 'Elenco') }}</span>
        </a>
      </nav>

      <p class="shell-footer__note">{{ t('angular.shellFooter.note', 'Ogni missione e un invito a guardare Istanbul con piu attenzione, curiosita e meraviglia.') }}</p>
    </footer>
  `
})
export class ShellFooterComponent {
  private readonly content = inject(LegacyContentService);
  private readonly state = inject(MissionStateService);
  readonly homeUnlocked = this.state.homeUnlocked;
  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
}
