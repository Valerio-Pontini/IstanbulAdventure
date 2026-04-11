import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-mission-collapsible-card',
  standalone: true,
  templateUrl: './mission-collapsible-card.component.html',
  styleUrl: './mission-collapsible-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionCollapsibleCardComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() preview = '';
  @Input() content = '';
  @Input() compact = false;
}
