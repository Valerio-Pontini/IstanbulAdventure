import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegacyContentService } from '../services/legacy-content.service';
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
  private readonly content = inject(LegacyContentService);
  @Input() eyebrow = this.content.t('angular.components.missionStatusEyebrow', 'Stato');
  @Input() title = this.content.t('angular.components.missionStatusTitle', 'Azioni rapide');
  @Input() statusLabel = '';
  @Input() summary = '';
  @Input() helper = '';
  @Input() primaryLabel = '';
  @Input() primaryDisabled = false;
  @Input() secondaryLabel = '';
  @Input() backLabel = this.content.t('angular.components.missionStatusBack', 'Torna alle missioni');
  @Input() backLink = '/home';

  @Output() readonly primary = new EventEmitter<void>();
  @Output() readonly secondary = new EventEmitter<void>();
}
