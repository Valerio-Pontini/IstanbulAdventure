import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCardComponent } from '../components/mission-card.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { PersonalityRevealComponent } from '../components/personality-reveal.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionBundle } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { OnboardingService } from '../services/onboarding.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

@Component({
  selector: 'ia-home-page',
  standalone: true,
  imports: [
    RouterLink,
    EditorialScreenComponent,
    SectionHeaderComponent,
    NarrativeCardComponent,
    PersonalityRevealComponent,
    MissionCardComponent,
    PrimaryButtonComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-section-header
        [eyebrow]="copy.hero?.kicker || 'Home missioni'"
        [title]="copy.hero?.title || 'Le tue missioni a Istanbul'"
        [description]="copy.hero?.text || ''"
      />

      <div class="screen-grid" [class.home-focus-target]="isStepActive(1)">
        <ia-narrative-card eyebrow="Panoramica" title="Muoviti tra archivi, luoghi e percorso personale">
          <div class="editorial-metrics editorial-metrics--compact">
            <div>
              <span>{{ copy.overview?.stats?.totalLabel || 'Missioni totali' }}</span>
              <strong>{{ totalCount() }}</strong>
            </div>
            <div>
              <span>{{ copy.overview?.stats?.generalLabel || 'Generiche' }}</span>
              <strong>{{ generalCount() }}</strong>
            </div>
            <div>
              <span>{{ copy.overview?.stats?.locationLabel || 'Luoghi' }}</span>
              <strong>{{ locationCount() }}</strong>
            </div>
            <div>
              <span>{{ copy.overview?.stats?.personalLabel || 'Per te' }}</span>
              <strong>{{ personalCount() }}</strong>
            </div>
          </div>
        </ia-narrative-card>

        <ia-personality-reveal [category]="profile()" [eyebrow]="copy.profileCard?.kicker || 'Personalita\\' emersa'" />
      </div>

      <div class="editorial-links" [class.home-focus-target]="isStepActive(2)">
        <a class="editorial-link" routerLink="/archive/general">Apri archivio generale</a>
        <a class="editorial-link" routerLink="/archive/locations">Apri archivio luoghi</a>
        <a class="editorial-link editorial-link--button" routerLink="/archive/personal">Apri archivio personale</a>
      </div>

      <section class="section-stack" [class.home-focus-target]="isStepActive(3)">
        @for (section of sections(); track section.key) {
          <article class="catalog-section">
            <ia-section-header [eyebrow]="section.kicker" [title]="section.title" [description]="section.text">
              <a class="editorial-link" [routerLink]="['/archive', section.key]">Vedi tutto</a>
            </ia-section-header>

            <div class="catalog-grid">
              @for (mission of section.missions; track mission.id) {
                <ia-mission-card
                  [mission]="mission"
                  [highlighted]="isHighlighted(mission.id)"
                  [saved]="isSaved(mission)"
                  [completed]="isCompleted(mission)"
                  (savedToggle)="toggleSaved($event)"
                />
              }
            </div>
          </article>
        }
      </section>
    </ia-editorial-screen>

    @if (showTutorial()) {
      <div class="overlay onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="home-onboarding-title">
        <section class="overlay__card onboarding-card onboarding-card--home">
          <div class="onboarding-progress">
            <span>Tutorial home</span>
            <strong>{{ activeStepIndex() + 1 }}/{{ tutorialSteps.length }}</strong>
          </div>

          <h2 id="home-onboarding-title">{{ activeStep().title }}</h2>
          <p class="onboarding-card__lead">{{ activeStep().text }}</p>

          <div class="onboarding-card__context">
            <span class="onboarding-card__spotlight">Area evidenziata</span>
            <strong>{{ activeStep().focusLabel }}</strong>
          </div>

          <div class="onboarding-card__actions onboarding-card__actions--spread">
            <button type="button" class="editorial-link editorial-link--plain" (click)="skipTutorial()">Salta tutorial</button>

            <div class="onboarding-card__action-group">
              @if (activeStepIndex() > 0) {
                <ia-primary-button label="Indietro" tone="ghost" (pressed)="previousStep()" />
              }

              @if (isLastStep()) {
                <ia-primary-button label="Ho capito" (pressed)="completeTutorial()" />
              } @else {
                <ia-primary-button label="Avanti" (pressed)="nextStep()" />
              }
            </div>
          </div>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readonly copy = inject(LegacyContentService).homeCopy;
  private readonly content = inject(LegacyContentService);
  private readonly catalog = inject(MissionCatalogService);
  private readonly state = inject(MissionStateService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly onboarding = inject(OnboardingService);

  readonly tutorialSteps = [
    {
      title: 'Questa fascia ti orienta subito',
      text: 'Qui leggi in un colpo solo quante missioni hai a disposizione e quale profilo personale sta guidando il tuo percorso.',
      focusLabel: 'Panoramica e profilo'
    },
    {
      title: 'Questi tre accessi portano ai tuoi archivi',
      text: 'Usa questi pulsanti per entrare rapidamente nell archivio generale, nei luoghi oppure nella selezione personale costruita per te.',
      focusLabel: 'Accessi rapidi agli archivi'
    },
    {
      title: 'Qui scorri le missioni da aprire o salvare',
      text: 'Ogni sezione raccoglie percorsi consigliati. Puoi aprire una missione, salvarla tra i preferiti o usare "Vedi tutto" per esplorare l archivio completo.',
      focusLabel: 'Sezioni missioni'
    }
  ] as const;
  readonly activeStepIndex = signal(0);
  readonly showTutorial = computed(() => this.onboarding.showHomeTutorial());
  readonly activeStep = computed(() => this.tutorialSteps[this.activeStepIndex()]);

  readonly profileId = this.state.categoryId;
  readonly profile = computed(() => {
    const id = this.profileId();
    return id ? this.content.categories[id] ?? null : null;
  });
  readonly generalCount = computed(() => this.catalog.getSectionMissions('general', this.profileId()).length);
  readonly locationCount = computed(() => this.catalog.getSectionMissions('locations', this.profileId()).length);
  readonly personalCount = computed(() => this.catalog.getSectionMissions('personal', this.profileId()).length);
  readonly totalCount = computed(() => this.generalCount() + this.locationCount() + this.personalCount());

  readonly sections = computed(() => [
    {
      key: 'general',
      kicker: this.copy.sections?.general?.kicker || 'Missioni generiche',
      title: this.copy.sections?.general?.title || 'Azioni leggere',
      text: this.copy.sections?.general?.text || '',
      missions: this.catalog.getRecommended('general', this.profileId())
    },
    {
      key: 'locations',
      kicker: this.copy.sections?.locations?.kicker || 'Missioni luogo',
      title: this.copy.sections?.locations?.title || 'Luoghi iconici',
      text: this.copy.sections?.locations?.text || '',
      missions: this.catalog.getRecommended('locations', this.profileId())
    },
    {
      key: 'personal',
      kicker: this.copy.sections?.personal?.kicker || 'Per te',
      title: this.copy.sections?.personal?.title || 'Percorso personale',
      text: this.copy.sections?.personal?.text || '',
      missions: this.catalog.getRecommended('personal', this.profileId())
    }
  ]);

  toggleSaved(missionId: string): void {
    const mission = this.catalog.getMissionById(missionId);
    if (!mission) {
      return;
    }

    const wasSaved = this.catalog.isSaved(mission);
    this.catalog.toggleSaved(mission);
    this.feedback.show(wasSaved ? 'Missione rimossa dai preferiti.' : 'Missione salvata tra i preferiti.', 'success');
  }

  isHighlighted(missionId: string): boolean {
    const profileId = this.profileId();
    const mission = this.catalog.getMissionById(missionId);
    return !!profileId && !!mission && mission.highlightForCategoryIds.includes(profileId);
  }

  isCompleted(mission: MissionBundle): boolean {
    return this.catalog.isCompleted(mission);
  }

  isSaved(mission: MissionBundle): boolean {
    return this.catalog.isSaved(mission);
  }

  isStepActive(step: number): boolean {
    return this.showTutorial() && this.activeStepIndex() === step - 1;
  }

  previousStep(): void {
    this.activeStepIndex.update((step) => Math.max(0, step - 1));
  }

  nextStep(): void {
    this.activeStepIndex.update((step) => Math.min(this.tutorialSteps.length - 1, step + 1));
  }

  isLastStep(): boolean {
    return this.activeStepIndex() === this.tutorialSteps.length - 1;
  }

  skipTutorial(): void {
    this.completeTutorial();
  }

  completeTutorial(): void {
    this.onboarding.dismissHomeTutorial();
  }
}
