import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChoiceCardComponent } from '../components/choice-card.component';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { ProgressThreadComponent } from '../components/progress-thread.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { QuizSessionService } from '../services/quiz-session.service';

@Component({
  selector: 'ia-quiz-page',
  standalone: true,
  imports: [
    EditorialScreenComponent,
    SectionHeaderComponent,
    NarrativeCardComponent,
    ProgressThreadComponent,
    ChoiceCardComponent,
    PrimaryButtonComponent
  ],
  template: `
    <ia-editorial-screen>
      @if (question(); as currentQuestion) {
        <ia-section-header
          eyebrow="Missione 0"
          title="Segui cio' che ti chiama per primo"
          description="Non rispondere come in un test. Scegli come se stessi sfiorando un indizio nel margine del tuo diario."
          [counter]="quiz.questionCounter()"
        >
          <ia-progress-thread
            variant="compact"
            label=""
            [counter]="quiz.questionCounter()"
            [progress]="quiz.questionProgress()"
          />
        </ia-section-header>

        <div class="screen-grid">
          <ia-narrative-card tone="accent" variant="hero" [text]="currentQuestion.text" />
        </div>

        <div class="choice-stack">
          @for (answer of currentQuestion.answers; track answer.label; let index = $index) {
            <ia-choice-card [index]="index + 1" [label]="answer.label" (select)="answerCurrent(index)" />
          }
        </div>
      } @else {
        <ia-section-header
          eyebrow="Rivelazione in corso"
          title="Il tuo sguardo sta prendendo forma"
          description="Sto aprendo il risultato della Missione 0."
        />
      }
    </ia-editorial-screen>

    @if (quiz.feedback(); as feedback) {
      <div class="overlay">
        <ia-narrative-card class="overlay__card" tone="accent" title="La citta' risponde subito" [text]="feedback.text">
          <ia-primary-button [label]="tapLabel()" tone="secondary" (pressed)="dismissFeedback()" />
        </ia-narrative-card>
      </div>
    }
  `
  ,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizPageComponent {
  readonly quiz = inject(QuizSessionService);
  private readonly router = inject(Router);

  readonly question = this.quiz.currentQuestion;
  readonly tapLabel = computed(() => 'Continua');

  constructor() {
    if (!this.quiz.currentQuestion()) {
      this.quiz.startQuiz();
    }
  }

  answerCurrent(index: number): void {
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
