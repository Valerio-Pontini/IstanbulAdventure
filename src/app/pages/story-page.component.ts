import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { ProgressThreadComponent } from '../components/progress-thread.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { QuizSessionService } from '../services/quiz-session.service';

@Component({
  selector: 'ia-story-page',
  standalone: true,
  imports: [
    EditorialScreenComponent,
    SectionHeaderComponent,
    ProgressThreadComponent,
    PrimaryButtonComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-section-header
        eyebrow="Prologo"
        title="Lascia che Istanbul ti raggiunga prima delle risposte"
        description="Un breve attraversamento per entrare nella frequenza giusta: piu' vicino a un invito editoriale che a un tutorial."
      />

      <ia-progress-thread
        label="Rituale"
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

  readonly totalSlides = this.quiz.storySlides.length;
  readonly currentIndex = this.quiz.storyIndex;
  readonly currentSlide = computed(() => this.quiz.storySlides[this.currentIndex()] ?? '');

  prev(): void {
    this.quiz.previousStory();
  }

  next(): void {
    if (this.currentIndex() >= this.totalSlides - 1) {
      this.quiz.startQuiz();
      void this.router.navigateByUrl('/quiz');
      return;
    }

    this.quiz.nextStory();
  }
}
