import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
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
    NarrativeCardComponent,
    ProgressThreadComponent,
    PrimaryButtonComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-section-header
        eyebrow="Prologo"
        title="Lascia che Istanbul ti raggiunga prima delle risposte"
        description="Un breve attraversamento per entrare nella frequenza giusta: piu' vicino a un invito editoriale che a un tutorial."
        [counter]="(currentIndex() + 1) + ' / ' + totalSlides"
      />

      <div class="screen-grid">
        <ia-narrative-card eyebrow="Scena corrente" title="Prologo in movimento" [text]="currentSlide()" />
        <ia-narrative-card tone="quiet" eyebrow="Filo editoriale" title="Ogni scena restringe il campo del tuo sguardo">
          <ia-progress-thread label="Rituale" [counter]="(currentIndex() + 1) + ' di ' + totalSlides" [progress]="progress()" />
          <div class="detail-list">
            <div class="detail-list__item">Non serve memorizzare: lascia sedimentare tono, immagini e ritmo.</div>
          </div>
        </ia-narrative-card>
      </div>

      <div class="editorial-actions">
        <ia-primary-button label="Indietro" tone="ghost" [disabled]="currentIndex() === 0" (pressed)="prev()" />
        <ia-primary-button [label]="currentIndex() === totalSlides - 1 ? 'Entra nella Missione 0' : 'Continua'" (pressed)="next()" />
      </div>
    </ia-editorial-screen>
  `
  ,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryPageComponent {
  private readonly quiz = inject(QuizSessionService);
  private readonly router = inject(Router);

  readonly totalSlides = this.quiz.storySlides.length;
  readonly currentIndex = this.quiz.storyIndex;
  readonly currentSlide = computed(() => this.quiz.storySlides[this.currentIndex()] ?? '');
  readonly progress = computed(() => ((this.currentIndex() + 1) / Math.max(this.totalSlides, 1)) * 100);

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
