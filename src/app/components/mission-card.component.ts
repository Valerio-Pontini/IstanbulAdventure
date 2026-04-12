import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MissionBundle } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { PrimaryButtonComponent } from './primary-button.component';
import { SymbolBadgeComponent } from './symbol-badge.component';

@Component({
  selector: 'ia-mission-card',
  standalone: true,
  imports: [RouterLink, PrimaryButtonComponent, SymbolBadgeComponent],
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionCardComponent {
  private readonly content = inject(LegacyContentService);
  @Input({ required: true }) mission!: MissionBundle;
  @Input() highlighted = false;
  @Input() saved = false;
  @Input() completed = false;
  @Input() inProgress = false;
  @Input() featured = false;
  @Input() supportText = '';
  @Output() readonly savedToggle = new EventEmitter<string>();

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);

  get statusLabel(): string {
    if (this.completed) {
      return this.t('angular.missionCard.completed', 'Completata');
    }

    if (this.inProgress) {
      return this.t('angular.missionCard.inProgress', 'In corso');
    }

    if (this.saved) {
      return this.t('angular.missionCard.saved', 'Salvata');
    }

    return this.t('angular.missionCard.toStart', 'Da iniziare');
  }

  get saveLabel(): string {
    return this.saved ? this.t('angular.missionCard.saved', 'Salvata') : this.t('angular.missionCard.save', 'Salva');
  }
}
