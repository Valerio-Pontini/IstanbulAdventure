import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimaryButtonComponent } from './primary-button.component';

@Component({
  selector: 'ia-mission-status-card',
  standalone: true,
  imports: [RouterLink, PrimaryButtonComponent],
  templateUrl: './mission-status-card.component.html',
  styleUrl: './mission-status-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionStatusCardComponent {
  @Input() eyebrow = 'Stato';
  @Input() title = 'Azioni rapide';
  @Input() statusLabel = '';
  @Input() summary = '';
  @Input() helper = '';
  @Input() primaryLabel = '';
  @Input() primaryDisabled = false;
  @Input() secondaryLabel = '';
  @Input() backLabel = 'Torna alle missioni';
  @Input() backLink = '/home';

  @Output() readonly primary = new EventEmitter<void>();
  @Output() readonly secondary = new EventEmitter<void>();
}
