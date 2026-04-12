import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-narrative-card',
  standalone: true,
  templateUrl: './narrative-card.component.html',
  styleUrl: './narrative-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NarrativeCardComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  /** Optional DOM id for the title heading (e.g. dialog aria-labelledby). */
  @Input() titleDomId = '';
  @Input() text = '';
  @Input() tone: 'default' | 'accent' | 'quiet' = 'default';
  @Input() variant: 'default' | 'hero' = 'default';
}
