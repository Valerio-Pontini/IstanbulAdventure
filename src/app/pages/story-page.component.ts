import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { ProgressThreadComponent } from '../components/progress-thread.component';
import { QuizSessionService } from '../services/quiz-session.service';

@Component({
  selector: 'ia-story-page',
  standalone: true,
  imports: [
    EditorialScreenComponent,
    ProgressThreadComponent,
    PrimaryButtonComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-progress-thread
        label=""
        [currentStep]="currentIndex() + 1"
        [totalSteps]="totalSlides"
      />

      <section class="story-focus" aria-label="Testo del prologo">
        <p class="story-focus__text">{{ currentSlide() }}</p>
      </section>

      <div class="editorial-actions">
        <ia-primary-button label="Indietro" tone="ghost" [disabled]="currentIndex() === 0" (pressed)="prev()" />
        <ia-primary-button [label]="currentIndex() === totalSlides - 1 ? 'Entra nella Missione 0' : 'Continua'" (pressed)="next()" />
      </div>
    </ia-editorial-screen>
  `
  ,
  styles: [`
    .story-focus {
      position: relative;
      margin: clamp(1rem, 3vw, 1.75rem) 0;
      padding: clamp(1.75rem, 5vw, 3.5rem);
      border: 1px solid rgba(198, 161, 91, 0.2);
      border-radius: calc(var(--radius-lg) + 0.5rem);
      background:
        radial-gradient(circle at top center, rgba(198, 161, 91, 0.14), transparent 38%),
        linear-gradient(180deg, rgba(16, 30, 46, 0.94), rgba(9, 18, 30, 0.9));
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
      overflow: hidden;
      text-align: center;
    }

    .story-focus::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, rgba(198, 161, 91, 0.32), rgba(255, 255, 255, 0.08), transparent 65%);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .story-focus__text {
      position: relative;
      z-index: 1;
      max-width: 20ch;
      margin: 0 auto;
      color: var(--accent-ivory);
      font-size: clamp(1.9rem, 5vw, 3.4rem);
      line-height: 1.18;
      text-wrap: balance;
    }

    .editorial-actions {
      display: flex;
      align-items: stretch;
      gap: 0.85rem;
      margin-top: 1.25rem;
    }

    .editorial-actions ia-primary-button {
      flex: 1 1 0;
      min-width: 0;
    }

    @media (max-width: 640px) {
      .story-focus {
        padding: 1.5rem 1.25rem 2rem;
      }

      .story-focus__text {
        max-width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryPageComponent {
  private readonly quiz = inject(QuizSessionService);
  private readonly router = inject(Router);
  private readonly slides = [
    'Lascia che Istanbul ti raggiunga prima delle risposte',
    ...this.quiz.storySlides
  ];
  private readonly storyIndexSignal = signal(0);

  readonly totalSlides = this.slides.length;
  readonly currentIndex = this.storyIndexSignal.asReadonly();
  readonly currentSlide = computed(() => this.slides[this.currentIndex()] ?? '');

  prev(): void {
    this.storyIndexSignal.update((index) => Math.max(index - 1, 0));
  }

  next(): void {
    if (this.currentIndex() >= this.totalSlides - 1) {
      this.quiz.startQuiz();
      void this.router.navigateByUrl('/quiz');
      return;
    }

    this.storyIndexSignal.update((index) => Math.min(index + 1, this.totalSlides - 1));
  }
}
