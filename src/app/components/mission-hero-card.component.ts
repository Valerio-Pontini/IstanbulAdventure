import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegacyContentService } from '../services/legacy-content.service';

@Component({
  selector: 'ia-mission-hero-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mission-hero-card.component.html',
  styleUrl: './mission-hero-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionHeroCardComponent {
  private readonly content = inject(LegacyContentService);
  @Input() eyebrow = this.content.t('angular.components.missionHeroEyebrow', 'Scheda missione');
  @Input() title = '';
  @Input() backLabel = this.content.t('angular.components.missionHeroBack', 'Torna alle missioni');
  @Input() backLink = '/home';
}
