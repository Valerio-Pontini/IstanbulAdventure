import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { SymbolBadgeComponent } from '../components/symbol-badge.component';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionStateService } from '../services/mission-state.service';
import { QuizSessionService } from '../services/quiz-session.service';

@Component({
  selector: 'ia-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    EditorialScreenComponent,
    SectionHeaderComponent,
    NarrativeCardComponent,
    PrimaryButtonComponent,
    SymbolBadgeComponent
  ],
  template: `
    <ia-editorial-screen tone="atlas">
      <ia-section-header
        eyebrow="Ingresso segreto"
        title="Apri Istanbul dal lato che ti osserva"
        description="Il libro custodisce il cuore del viaggio. Questa interfaccia e' il suo compagno silenzioso: ti orienta, ti svela e ti accompagna verso il tuo modo personale di attraversare la citta'."
      >
        @if (state.homeUnlocked()) {
          <a class="editorial-link" routerLink="/home">Riapri il tuo archivio</a>
        }
      </ia-section-header>

      <div class="screen-grid screen-grid--hero">
        <ia-narrative-card
          tone="accent"
          eyebrow="Rotta iniziale"
          title="Il compagno digitale del tuo explorer journal"
          text="Non sostituisce il libro: ne estende il ritmo. Ti offre scelte, profili, missioni e piccoli indizi pratici mentre la narrazione rimane nelle mani, nelle pagine e nel gruppo."
        >
          <div class="editorial-metrics">
            <div>
              <span>Missioni</span>
              <strong>{{ content.missions.all.length }}</strong>
            </div>
            <div>
              <span>Archetipi</span>
              <strong>{{ categoryCount }}</strong>
            </div>
            <div>
              <span>Forma</span>
              <strong>Atlante narrativo</strong>
            </div>
          </div>
        </ia-narrative-card>

        <ia-narrative-card
          eyebrow="Rituale di accesso"
          title="Prima scopri come guardi, poi lasci che la citta' risponda"
          text="Puoi entrare con un prologo breve oppure iniziare direttamente dalla Missione 0. In pochi passaggi emergera' l'archetipo che aprira' il tuo archivio personale."
        >
          <div class="editorial-actions">
            <ia-primary-button label="Leggi il prologo" (pressed)="startStory()" />
            <ia-primary-button label="Apri Missione 0" tone="secondary" (pressed)="startQuiz()" />
          </div>

          <div class="badge-cluster">
            @for (category of categories; track category.id) {
              <ia-symbol-badge [iconSrc]="category.iconSrc" [label]="category.title" [sublabel]="category.shortLabel" />
            }
          </div>
        </ia-narrative-card>
      </div>

      <div class="screen-grid">
        <ia-narrative-card eyebrow="Patto di viaggio" title="Usa il telefono per il gesto rapido, il libro per la profondita'">
          <div class="detail-list">
            <div class="detail-list__item">Qui trovi scelte, rivelazioni e missioni da consultare al volo durante il viaggio.</div>
            <div class="detail-list__item">Nel libro restano l'atmosfera, il racconto condiviso e il ritmo piu' lento dell'esplorazione.</div>
          </div>
        </ia-narrative-card>

        <ia-narrative-card tone="quiet" eyebrow="Segni disponibili" title="Simboli, luoghi, rituali, archivi">
          <p class="narrative-card__text">Gli snippet che hai allegato puntavano verso un'interfaccia piu' scura, premium e misteriosa: ho preso quella direzione come base per l'intero sistema visivo.</p>
        </ia-narrative-card>
      </div>
    </ia-editorial-screen>
  `
  ,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
  readonly content = inject(LegacyContentService);
  readonly state = inject(MissionStateService);
  private readonly quiz = inject(QuizSessionService);
  private readonly router = inject(Router);

  readonly categories = Object.values(this.content.categories);
  readonly categoryCount = this.categories.length;

  startStory(): void {
    this.quiz.reset();
    void this.router.navigateByUrl('/story');
  }

  startQuiz(): void {
    this.quiz.reset();
    this.quiz.startQuiz();
    void this.router.navigateByUrl('/quiz');
  }
}
