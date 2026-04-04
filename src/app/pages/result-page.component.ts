import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
      <ia-section-header [eyebrow]="result.kicker" [title]="result.title" [description]="result.text" />

      <div class="screen-grid">
        <ia-personality-reveal [category]="resolvedCategory()" eyebrow="Archetipo rivelato" />

        <ia-narrative-card
          eyebrow="Soglia aperta"
          title="La citta' ora ti restituisce missioni coerenti con il tuo sguardo"
          text="Da qui in poi l'app funziona come uno strato pratico sopra il libro: ti aiuta a ritrovare percorsi, leggere simboli e scegliere missioni con piu' rapidita'."
        >
          <div class="editorial-actions">
            <a class="editorial-link editorial-link--button" routerLink="/home">{{ result.homeButtonLabel || 'Apri la home' }}</a>
            <a class="editorial-link" routerLink="/">Torna all ingresso</a>
          </div>

          <div class="detail-list">
            <div class="detail-list__item">Le missioni personali si adatteranno al profilo emerso nella tua unica Missione 0.</div>
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
