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

      @if (answerHistory().length) {
        <ia-narrative-card [title]="t('angular.result.reviewTitle', 'Rivedi Missione 0: domande e risposte')">
          <div class="result-review">
            @for (entry of answerHistory(); track entry.questionId + '-' + $index) {
              <article class="result-review__item">
                <p class="result-review__question">{{ entry.questionText }}</p>
                <p class="result-review__answer"><strong>{{ t('angular.result.yourAnswer', 'Tua risposta') }}:</strong> {{ entry.answerLabel }}</p>
                @if (entry.feedbackText) {
                  <p class="result-review__feedback"><strong>{{ t('angular.result.explanation', 'Spiegazione') }}:</strong> {{ entry.feedbackText }}</p>
                }
              </article>
            }
          </div>
        </ia-narrative-card>
      }
    </ia-editorial-screen>
  `,
  styles: [
    `
      .result-review {
        display: grid;
        gap: 0.8rem;
      }

      .result-review__item {
        display: grid;
        gap: 0.38rem;
        padding: 0.85rem 0.9rem;
        border: 1px solid var(--border-soft);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
      }

      .result-review__question {
        color: var(--text-1);
        font-weight: 600;
      }

      .result-review__answer,
      .result-review__feedback {
        color: var(--text-2);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultPageComponent {
  private readonly content = inject(LegacyContentService);
  private readonly quiz = inject(QuizSessionService);
  readonly result = this.content.result;
  readonly resolvedCategory = computed(() => this.quiz.resultCategory());
  readonly answerHistory = computed(() => this.quiz.answerHistory());
  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);

  constructor() {
    this.quiz.consumeFreshResult();
  }
}
