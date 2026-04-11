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
        <ia-personality-reveal [category]="resolvedCategory()" eyebrow="Archetipo rivelato" />

        <ia-narrative-card
          title="Da ora non guarderai Istanbul, seguirai i suoi percorsi"
        >
          <div class="editorial-actions">
            <a class="editorial-link editorial-link--button" routerLink="/home">Vai alla tua Istanbul</a>
          </div>
        </ia-narrative-card>
      </div>
    </ia-editorial-screen>
  `
  ,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultPageComponent {
  private readonly quiz = inject(QuizSessionService);
  readonly result = inject(LegacyContentService).result;
  readonly resolvedCategory = computed(() => this.quiz.resultCategory());
}
