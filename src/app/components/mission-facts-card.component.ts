import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { LegacyContentService } from '../services/legacy-content.service';

export type MissionFactItem = {
  label: string;
  value: string;
};

@Component({
  selector: 'ia-mission-facts-card',
  standalone: true,
  templateUrl: './mission-facts-card.component.html',
  styleUrl: './mission-facts-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionFactsCardComponent {
  private readonly content = inject(LegacyContentService);
  @Input() eyebrow = this.content.t('angular.components.missionFactsEyebrow', 'Coordinate essenziali');
  @Input() title = this.content.t('angular.components.missionFactsTitle', 'Coordinate essenziali');
  @Input() items: MissionFactItem[] = [];
}
