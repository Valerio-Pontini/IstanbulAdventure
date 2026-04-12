import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChoiceLayerComponent } from '../components/choice-layer.component';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { NarrativeOverlayComponent } from '../components/narrative-overlay.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { ProgressThreadComponent } from '../components/progress-thread.component';
import { SceneViewportComponent } from '../components/scene-viewport.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ChoiceOption } from '../models/narrative.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { QuizSessionService } from '../services/quiz-session.service';

@Component({
  selector: 'ia-quiz-page',
  standalone: true,
  imports: [
    EditorialScreenComponent,
    SceneViewportComponent,
    SectionHeaderComponent,
    NarrativeCardComponent,
    ProgressThreadComponent,
    ChoiceLayerComponent,
    PrimaryButtonComponent,
    NarrativeOverlayComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-scene-viewport tone="reveal">
        @if (question(); as currentQuestion) {
          <ia-section-header
            [eyebrow]="t('angular.quiz.eyebrow', 'Missione 0')"
            [title]="t('angular.quiz.title', 'Segui cio che ti chiama per primo')"
            [description]="t('angular.quiz.description', 'Non rispondere come in un test. Scegli come se stessi sfiorando un indizio nel margine del tuo diario.')"
            [counter]="quiz.questionCounter()"
          >
            <ia-progress-thread
              variant="compact"
              label=""
              [counter]="quiz.questionCounter()"
              [progress]="quiz.questionProgress()"
            />
          </ia-section-header>

          <div class="screen-grid quiz-screen-grid">
            <ia-narrative-card tone="accent" variant="hero" [text]="currentQuestion.text" />
          </div>

          <ia-choice-layer [options]="choiceOptions()" [ariaLabel]="t('angular.quiz.choicesAria', 'Risposte alla domanda')" (picked)="onPicked($event)" />
        } @else {
          <ia-section-header
            [eyebrow]="t('angular.quiz.revealingEyebrow', 'Rivelazione in corso')"
            [title]="t('angular.quiz.revealingTitle', 'Il tuo sguardo sta prendendo forma')"
            [description]="t('angular.quiz.revealingDescription', 'Sto aprendo il risultato della Missione 0.')"
          />
        }
      </ia-scene-viewport>
    </ia-editorial-screen>

    @if (quiz.feedback(); as feedback) {
      <ia-narrative-overlay [title]="t('angular.quiz.feedbackTitle', 'La citta risponde subito')" [text]="feedback.text">
        <ia-primary-button [label]="tapLabel()" tone="secondary" (pressed)="dismissFeedback()" />
      </ia-narrative-overlay>
    }
  `,
  styles: [
    `
      .quiz-screen-grid {
        margin: 0;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizPageComponent {
  private readonly content = inject(LegacyContentService);
  readonly quiz = inject(QuizSessionService);
  private readonly router = inject(Router);

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
  readonly question = this.quiz.currentQuestion;
  readonly tapLabel = computed(() => this.t('angular.common.continue', 'Continua'));

  readonly choiceOptions = computed<ChoiceOption[]>(() => {
    const current = this.question();
    if (!current) {
      return [];
    }
    return current.answers.map((answer, index) => ({
      id: `quiz-answer-${index}`,
      label: answer.label
    }));
  });

  constructor() {
    if (!this.quiz.currentQuestion()) {
      this.quiz.startQuiz();
    }
  }

  onPicked(optionId: string): void {
    const match = /^quiz-answer-(\d+)$/.exec(optionId);
    const index = match ? Number.parseInt(match[1], 10) : -1;
    const answer = this.question()?.answers[index];
    if (!answer) {
      return;
    }

    this.quiz.answer(answer);
    if (!this.quiz.currentQuestion() && !this.quiz.feedback()) {
      void this.router.navigateByUrl('/result');
    }
  }

  dismissFeedback(): void {
    this.quiz.dismissFeedback();
    if (!this.quiz.currentQuestion() && !this.quiz.feedback()) {
      void this.router.navigateByUrl('/result');
    }
  }
}
