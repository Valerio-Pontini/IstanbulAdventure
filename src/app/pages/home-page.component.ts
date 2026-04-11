import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCardComponent } from '../components/mission-card.component';
import { PersonalityRevealComponent } from '../components/personality-reveal.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionBundle, SectionKey } from '../models/app.models';
import { GuidedTourService } from '../services/guided-tour.service';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { OnboardingService } from '../services/onboarding.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

type HomeEntryPoint = {
  key: SectionKey;
  title: string;
  subtitle: string;
  count: number;
  cta: string;
};

type HomePreviewSection = {
  key: SectionKey;
  kicker: string;
  title: string;
  text: string;
  missions: MissionBundle[];
};

@Component({
  selector: 'ia-home-page',
  standalone: true,
  imports: [RouterLink, EditorialScreenComponent, SectionHeaderComponent, PersonalityRevealComponent, MissionCardComponent],
  template: `
    <ia-editorial-screen>
      <section class="home-hero">
        <p class="home-hero__eyebrow">{{ copy.hero?.kicker || 'Home missioni' }}</p>
        <h1 class="home-hero__title">{{ copy.hero?.title || 'Le tue missioni a Istanbul' }}</h1>
        <p class="home-hero__text">
          Qui trovi missioni immediate, percorsi legati ai luoghi e il filo personale emerso dal quiz.
        </p>
      </section>

      @if (suggestedMission(); as mission) {
        <section class="home-priority">
          <div class="home-priority__header">
            <div>
              <p class="home-priority__eyebrow">Da fare ora</p>
              <h2 class="home-priority__title">Prova questa</h2>
            </div>
            <span class="home-priority__hint">Perfetta se vuoi iniziare subito senza cambiare percorso.</span>
          </div>

          <ia-mission-card
            [mission]="mission"
            [highlighted]="isHighlighted(mission.id)"
            [saved]="isSaved(mission)"
            [completed]="isCompleted(mission)"
            [inProgress]="isInProgress(mission)"
            [featured]="true"
            [supportText]="'Perfetta se vuoi iniziare subito senza cambiare percorso.'"
            (savedToggle)="toggleSaved($event)"
          />
        </section>
      }

      <section class="home-entrypoints" aria-labelledby="home-entrypoints-title">
        <div class="home-entrypoints__header">
          <p class="home-entrypoints__eyebrow">Percorsi disponibili</p>
          <h2 id="home-entrypoints-title" class="home-entrypoints__title">Scegli da dove entrare nel gioco</h2>
          <a class="editorial-link editorial-link--plain" routerLink="/missions">Vedi tutte le missioni</a>
        </div>

        <div class="home-entrypoints__grid" id="tutorial-home-archives">
          @for (entry of entryPoints(); track entry.key) {
            <a class="entry-card tutorial-anchor" [routerLink]="['/archive', entry.key]">
              <div class="entry-card__top">
                <span class="entry-card__label">{{ entry.title }}</span>
                <span class="entry-card__count">{{ entry.count }} missioni</span>
              </div>
              <p class="entry-card__text">{{ entry.subtitle }}</p>
              <span class="entry-card__cta">{{ entry.cta }}</span>
            </a>
          }
        </div>
      </section>

      <ia-personality-reveal [category]="profile()" [eyebrow]="copy.profileCard?.kicker || 'Profilo emerso'" />

      <section class="section-stack">
        @for (section of sections(); track section.key) {
          <article class="catalog-section">
            <ia-section-header [eyebrow]="section.kicker" [title]="section.title" [description]="section.text">
              <a class="editorial-link editorial-link--plain" [routerLink]="['/archive', section.key]">Vedi tutto</a>
            </ia-section-header>

            <div class="catalog-grid catalog-grid--preview">
              @for (mission of section.missions; track mission.id) {
                <ia-mission-card
                  [mission]="mission"
                  [highlighted]="isHighlighted(mission.id)"
                  [saved]="isSaved(mission)"
                  [completed]="isCompleted(mission)"
                  [inProgress]="isInProgress(mission)"
                  (savedToggle)="toggleSaved($event)"
                />
              }
            </div>
          </article>
        }
      </section>
    </ia-editorial-screen>
  `,
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readonly copy = inject(LegacyContentService).homeCopy;
  private readonly content = inject(LegacyContentService);
  private readonly catalog = inject(MissionCatalogService);
  private readonly state = inject(MissionStateService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly onboarding = inject(OnboardingService);
  private readonly guidedTour = inject(GuidedTourService);

  readonly profileId = this.state.categoryId;
  readonly profile = computed(() => {
    const id = this.profileId();
    return id ? this.content.categories[id] ?? null : null;
  });
  readonly generalCount = computed(() => this.catalog.getSectionMissions('general', this.profileId()).length);
  readonly locationCount = computed(() => this.catalog.getSectionMissions('locations', this.profileId()).length);
  readonly personalCount = computed(() => this.catalog.getSectionMissions('personal', this.profileId()).length);
  readonly suggestedMission = computed(() => this.catalog.getSuggestedMission(this.profileId()));

  readonly entryPoints = computed<HomeEntryPoint[]>(() => [
    {
      key: 'general',
      title: 'Generiche',
      subtitle: 'Azioni leggere da fare quasi ovunque.',
      count: this.generalCount(),
      cta: 'Apri le missioni generiche'
    },
    {
      key: 'locations',
      title: 'Luoghi',
      subtitle: 'Missioni che si attivano quando arrivi in punti iconici.',
      count: this.locationCount(),
      cta: 'Apri le missioni luogo'
    },
    {
      key: 'personal',
      title: 'Per te',
      subtitle: 'Missioni più coerenti con il tuo sguardo.',
      count: this.personalCount(),
      cta: 'Apri il tuo archivio'
    }
  ]);

  readonly sections = computed<HomePreviewSection[]>(() => [
    {
      key: 'general',
      kicker: 'Missioni generiche',
      title: 'Azioni che puoi fare quasi ovunque',
      text: 'Una selezione rapida per muoverti senza pianificare troppo.',
      missions: this.catalog.getRecommended('general', this.profileId(), 2)
    },
    {
      key: 'locations',
      kicker: 'Missioni luogo',
      title: 'Quando arrivi in un punto iconico',
      text: 'Preview di missioni pensate per essere colte sul posto, senza GPS.',
      missions: this.catalog.getRecommended('locations', this.profileId(), 2)
    },
    {
      key: 'personal',
      kicker: 'Missioni personalità',
      title: 'Calibrate sul tuo sguardo',
      text: 'Le missioni che meglio risuonano con la personalità emersa dal quiz.',
      missions: this.catalog.getRecommended('personal', this.profileId(), 2)
    }
  ]);

  constructor() {
    if (this.onboarding.showHomeTutorial() && !this.onboarding.showInstallTutorial()) {
      void this.guidedTour.startIfNeeded();
    }
  }

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

  isInProgress(mission: MissionBundle): boolean {
    return this.catalog.isInProgress(mission);
  }

  isSaved(mission: MissionBundle): boolean {
    return this.catalog.isSaved(mission);
  }
}
