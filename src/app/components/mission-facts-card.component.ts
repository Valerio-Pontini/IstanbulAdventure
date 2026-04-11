import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  @Input() eyebrow = 'Coordinate essenziali';
  @Input() title = 'Coordinate essenziali';
  @Input() items: MissionFactItem[] = [];
}
