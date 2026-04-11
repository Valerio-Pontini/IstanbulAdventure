import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-mission-objective-card',
  standalone: true,
  templateUrl: './mission-objective-card.component.html',
  styleUrl: './mission-objective-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionObjectiveCardComponent {
  @Input() label = '';
  @Input() title = '';
  @Input() instruction = '';
  @Input() successItems: string[] = [];
  @Input() statusLabel = '';
  @Input() state: 'locked' | 'active' | 'done' | 'pending' = 'pending';
}
