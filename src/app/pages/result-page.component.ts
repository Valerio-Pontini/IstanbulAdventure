import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { PersonalityRevealComponent } from '../components/personality-reveal.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { LegacyContentService } from '../services/legacy-content.service';
import { QuizSessionService } from '../services/quiz-session.service';

@Component({
  selector: 'ia-result-page',
  standalone: true,
  imports: [
    RouterLink,
    EditorialScreenComponent,
    SectionHeaderComponent,
    PersonalityRevealComponent,
    NarrativeCardComponent
  ],
  template: `
    <ia-editorial-screen tone="reveal">
      <ia-section-header [title]="result.title" [description]="result.text" />

      <div class="screen-grid">
        <ia-personality-reveal [category]="resolvedCategory()" [eyebrow]="t('angular.result.archetypeEyebrow', 'Archetipo rivelato')" />

        <ia-narrative-card [title]="t('angular.result.cardTitle', 'Da ora non guarderai Istanbul, seguirai i suoi percorsi')">
          <div class="editorial-actions">
            <a class="editorial-link editorial-link--button" routerLink="/home">{{ t('angular.result.goHome', 'Vai alla tua Istanbul') }}</a>
          </div>
        </ia-narrative-card>
      </div>
    </ia-editorial-screen>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultPageComponent {
  private readonly content = inject(LegacyContentService);
  private readonly quiz = inject(QuizSessionService);
  readonly result = this.content.result;
  readonly resolvedCategory = computed(() => this.quiz.resultCategory());
  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);

  constructor() {
    this.quiz.consumeFreshResult();
  }
}
