import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ia-mission-hero-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mission-hero-card.component.html',
  styleUrl: './mission-hero-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionHeroCardComponent {
  @Input() eyebrow = 'Scheda missione';
  @Input() title = '';
  @Input() description = '';
  @Input() backLabel = 'Torna alle missioni';
  @Input() backLink = '/home';
}
