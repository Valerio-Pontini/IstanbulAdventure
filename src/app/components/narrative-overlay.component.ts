import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NarrativeCardComponent } from './narrative-card.component';

let overlayId = 0;

@Component({
  selector: 'ia-narrative-overlay',
  standalone: true,
  imports: [NarrativeCardComponent],
  templateUrl: './narrative-overlay.component.html',
  styleUrl: './narrative-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NarrativeOverlayComponent {
  @Input() title = '';
  @Input() text = '';
  @Input() tone: 'default' | 'accent' = 'accent';

  readonly titleId = `ia-narrative-overlay-title-${overlayId++}`;
}
