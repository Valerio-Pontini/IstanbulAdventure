import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCardComponent } from '../components/mission-card.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { PersonalityRevealComponent } from '../components/personality-reveal.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionBundle } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { GuidedTourService } from '../services/guided-tour.service';
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
    MissionCardComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-section-header
        [eyebrow]="copy.hero?.kicker || 'Home missioni'"
        [title]="copy.hero?.title || 'Le tue missioni a Istanbul'"
        [description]="copy.hero?.text || ''"
      />

      <div class="screen-grid">
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

      <div id="tutorial-home-archives" class="editorial-links tutorial-anchor">
        <a class="editorial-link" routerLink="/archive/general">Apri archivio generale</a>
        <a class="editorial-link" routerLink="/archive/locations">Apri archivio luoghi</a>
        <a class="editorial-link editorial-link--button" routerLink="/archive/personal">Apri archivio personale</a>
      </div>

      <section class="section-stack">
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
  private readonly guidedTour = inject(GuidedTourService);

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

  isSaved(mission: MissionBundle): boolean {
    return this.catalog.isSaved(mission);
  }
}
