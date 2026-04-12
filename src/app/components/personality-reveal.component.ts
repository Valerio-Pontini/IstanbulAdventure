import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { SymbolBadgeComponent } from './symbol-badge.component';

@Component({
  selector: 'ia-personality-reveal',
  standalone: true,
  imports: [SymbolBadgeComponent, RouterLink],
  templateUrl: './personality-reveal.component.html',
  styleUrl: './personality-reveal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalityRevealComponent {
  private readonly content = inject(LegacyContentService);
  @Input() category: Category | null = null;
  @Input() eyebrow = this.content.t('angular.personality.eyebrow', 'Profilo emerso');

  readonly kicker = computed(() => this.content.t('angular.personality.kicker', 'Il tuo modo di leggere Istanbul'));
  readonly openArchiveLabel = computed(() => this.content.t('angular.personality.openPersonalArchive', 'Apri archivio personale'));
  readonly lockedTitle = computed(() => this.content.t('angular.personality.lockedTitle', 'Il tuo profilo e ancora nascosto'));
  readonly lockedText = computed(() => this.content.t('angular.personality.lockedText', 'Completa Missione 0 per sbloccare il percorso che meglio interpreta il tuo sguardo sulla citta.'));
}
