import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCardComponent } from '../components/mission-card.component';
import { PersonalityRevealComponent } from '../components/personality-reveal.component';
import { SceneViewportComponent } from '../components/scene-viewport.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionBundle, SectionKey } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

type HomeEntryPoint = {
  key: SectionKey;
  title: string;
  subtitle: string;
  count: number;
  cta: string;
};

@Component({
  selector: 'ia-home-page',
  standalone: true,
  imports: [
    RouterLink,
    EditorialScreenComponent,
    SceneViewportComponent,
    SectionHeaderComponent,
    PersonalityRevealComponent,
    MissionCardComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-scene-viewport tone="default">
        <section class="home-hub-hero">
          <p class="home-hub-hero__eyebrow">{{ copy.hero?.kicker || 'Hub missioni' }}</p>
          <h1 class="home-hub-hero__title">{{ copy.hero?.title || 'Le tue missioni a Istanbul' }}</h1>
          <p class="home-hub-hero__text">
            {{ t('angular.home.heroText', 'Non sei in una dashboard: sei al tavolo del companion. Scegli un filo narrativo e lasciati portare dalla citta.') }}
          </p>
        </section>

        @if (suggestedMission(); as mission) {
          <section class="home-hub-priority" aria-labelledby="home-priority-title">
            <div class="home-hub-priority__head">
              <h2 id="home-priority-title" class="home-hub-priority__title">{{ t('angular.home.priorityTitle', 'Il filo che ti conviene ora') }}</h2>
              <p class="home-hub-priority__hint">{{ t('angular.home.priorityHint', 'Una missione pronta da seguire senza pianificare.') }}</p>
            </div>
            <ia-mission-card
              [mission]="mission"
              [highlighted]="isHighlighted(mission.id)"
              [saved]="isSaved(mission)"
              [completed]="isCompleted(mission)"
              [inProgress]="isInProgress(mission)"
              [featured]="true"
              [supportText]="t('angular.home.prioritySupport', 'Inizia da qui se vuoi continuita con il tuo profilo.')"
              (savedToggle)="toggleSaved($event)"
            />
          </section>
        }

        <section class="home-hub-paths" aria-labelledby="home-paths-title" id="tutorial-home-archives">
          <ia-section-header
            [eyebrow]="t('angular.home.pathsEyebrow', 'Percorsi')"
            [title]="t('angular.home.pathsTitle', 'Tre strade nella stessa citta')"
            [description]="t('angular.home.pathsDescription', 'Ogni voce apre un capitolo diverso dello stesso viaggio.')"
          >
            <a class="editorial-link editorial-link--plain" routerLink="/missions">{{ t('angular.home.openIndex', "Apri l'indice completo") }}</a>
          </ia-section-header>

          <div class="home-hub-paths__grid">
            @for (entry of entryPoints(); track entry.key) {
              <a class="hub-path-card tutorial-anchor" [routerLink]="['/archive', entry.key]">
                <span class="hub-path-card__label">{{ entry.title }}</span>
                <span class="hub-path-card__count">{{ entry.count }} missioni</span>
                <p class="hub-path-card__text">{{ entry.subtitle }}</p>
                <span class="hub-path-card__cta">{{ entry.cta }}</span>
              </a>
            }
          </div>
        </section>

        <ia-personality-reveal [category]="profile()" [eyebrow]="copy.profileCard?.kicker || t('angular.personality.eyebrow', 'Profilo emerso')" />

        <section class="home-hub-more" aria-labelledby="home-more-title">
          <h2 id="home-more-title" class="home-hub-more__title">{{ t('angular.home.moreTitle', 'Altri sentieri') }}</h2>
          <p class="home-hub-more__text">
            {{ t('angular.home.moreText', "L'archivio e vasto: quando vuoi sfogliare tutto senza filtri narrativi, usa l'indice missioni.") }}
          </p>
          <a class="editorial-link" routerLink="/missions">{{ t('angular.home.goToIndex', "Vai all'indice missioni") }}</a>
        </section>
      </ia-scene-viewport>
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

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
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
      title: this.t('angular.home.entryGeneralTitle', 'Generiche'),
      subtitle: this.t('angular.home.entryGeneralSubtitle', 'Azioni leggere da fare quasi ovunque, come battiti nel diario.'),
      count: this.generalCount(),
      cta: this.t('angular.home.entryGeneralCta', 'Entra nel capitolo')
    },
    {
      key: 'locations',
      title: this.t('angular.home.entryLocationsTitle', 'Luoghi'),
      subtitle: this.t('angular.home.entryLocationsSubtitle', 'Si accendono quando arrivi in punti iconici, senza bisogno di GPS.'),
      count: this.locationCount(),
      cta: this.t('angular.home.entryLocationsCta', 'Segui i luoghi')
    },
    {
      key: 'personal',
      title: this.t('angular.home.entryPersonalTitle', 'Per te'),
      subtitle: this.t('angular.home.entryPersonalSubtitle', 'Missioni in sintonia con il tuo sguardo emerso dal rituale iniziale.'),
      count: this.personalCount(),
      cta: this.t('angular.home.entryPersonalCta', 'Apri il filo personale')
    }
  ]);

  toggleSaved(missionId: string): void {
    const mission = this.catalog.getMissionById(missionId);
    if (!mission) {
      return;
    }

    const wasSaved = this.catalog.isSaved(mission);
    this.catalog.toggleSaved(mission);
    this.feedback.show(
      wasSaved
        ? this.t('angular.home.saveRemoved', 'Missione rimossa dai preferiti.')
        : this.t('angular.home.saveAdded', 'Missione salvata tra i preferiti.'),
      'success'
    );
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
