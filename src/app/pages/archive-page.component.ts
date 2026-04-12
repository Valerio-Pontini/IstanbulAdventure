import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCardComponent } from '../components/mission-card.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionBundle, MissionFilterState, SectionKey } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { GuidedTourService } from '../services/guided-tour.service';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

@Component({
  selector: 'ia-archive-page',
  standalone: true,
  imports: [FormsModule, RouterLink, EditorialScreenComponent, SectionHeaderComponent, NarrativeCardComponent, MissionCardComponent],
  template: `
    <ia-editorial-screen>
      <ia-section-header [eyebrow]="t('angular.archive.eyebrow', 'Archivio missioni')" [title]="title()" [description]="text()">
        <a class="editorial-link" routerLink="/home">{{ t('angular.archive.backHome', 'Torna alla home') }}</a>
      </ia-section-header>

      <div class="editorial-links">
        <button id="tutorial-archive-filter-toggle" class="editorial-link tutorial-anchor" type="button" (click)="filtersOpen.update((value) => !value)">
          {{ filtersOpen() ? t('angular.common.hideFilters', 'Nascondi filtri') : t('angular.common.showFilters', 'Mostra filtri') }}
        </button>
      </div>

      <div id="tutorial-archive-filters" class="tutorial-anchor">
      @if (filtersOpen()) {
        <section class="archive-filters">
          <div class="filter-grid">
            <label class="filter-field">
              <span>{{ t('angular.archive.search', 'Ricerca') }}</span>
              <input [ngModel]="filters().search" (ngModelChange)="updateFilter('search', $event)" [placeholder]="t('angular.archive.searchPlaceholder', 'Titolo, tema o descrizione')" />
            </label>

            <label class="filter-field">
              <span>{{ t('angular.archive.place', 'Luogo') }}</span>
              <select [ngModel]="filters().place" (ngModelChange)="updateFilter('place', $event)">
                <option value="all">{{ t('angular.common.allMasculine', 'Tutti') }}</option>
                @for (option of placeOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>{{ t('angular.archive.type', 'Tipologia') }}</span>
              <select [ngModel]="filters().type" (ngModelChange)="updateFilter('type', $event)">
                <option value="all">{{ t('angular.common.allFeminine', 'Tutte') }}</option>
                @for (option of typeOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>{{ t('angular.archive.theme', 'Tema') }}</span>
              <select [ngModel]="filters().theme" (ngModelChange)="updateFilter('theme', $event)">
                <option value="all">{{ t('angular.common.allMasculine', 'Tutti') }}</option>
                @for (option of themeOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>{{ t('angular.archive.budget', 'Budget') }}</span>
              <select [ngModel]="filters().budget" (ngModelChange)="updateFilter('budget', $event)">
                <option value="all">{{ t('angular.common.allMasculine', 'Tutti') }}</option>
                @for (option of budgetOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>
          </div>
        </section>
      }
      </div>

      <div id="tutorial-archive-actions" class="editorial-links tutorial-anchor">
        <button class="editorial-link editorial-link--plain" type="button" (click)="resetFilters()">{{ t('angular.common.clearFilters', 'Pulisci filtri') }}</button>
        <span class="editorial-counter">{{ filteredMissions().length }} {{ t('angular.archive.resultsSuffix', 'risultati') }}</span>
      </div>

      <div id="tutorial-archive-cards" class="tutorial-anchor">
      @if (filteredMissions().length) {
        <div class="catalog-grid">
          @for (mission of filteredMissions(); track mission.id) {
            <ia-mission-card
              [mission]="mission"
              [highlighted]="isHighlighted(mission.id)"
              [saved]="isSaved(mission)"
              [completed]="isCompleted(mission)"
              (savedToggle)="toggleSaved($event)"
            />
          }
        </div>
      } @else {
        <ia-narrative-card tone="quiet" [title]="copy.detailView?.emptyTitle || t('angular.archive.emptyTitle', 'Nessuna missione')" [text]="copy.detailView?.emptyText || t('angular.archive.emptyText', 'Prova con filtri diversi.')" />
      }
      </div>
    </ia-editorial-screen>
  `,
  styleUrl: './archive-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivePageComponent {
  readonly copy = inject(LegacyContentService).homeCopy;
  private readonly content = inject(LegacyContentService);
  private readonly catalog = inject(MissionCatalogService);
  private readonly state = inject(MissionStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly feedback = inject(UiFeedbackService);
  private readonly guidedTour = inject(GuidedTourService);

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
  readonly section = signal<SectionKey>((this.route.snapshot.paramMap.get('section') as SectionKey) || 'general');
  readonly profileId = this.state.categoryId;
  readonly filtersOpen = signal(false);
  readonly filters = signal<MissionFilterState>(this.getDefaultFilters());
  readonly baseMissions = computed(() => this.catalog.getSectionMissions(this.section(), this.profileId()));
  readonly missionStatus = computed(() => {
    const state = this.state.userState();
    const completed = new Set(state.completedMissionIds);
    const saved = new Set(state.savedMissionIds);
    const statusById = new Map<string, { saved: boolean; completed: boolean }>();

    this.baseMissions().forEach((mission) => {
      let completedCount = 0;
      let isSaved = false;

      mission.missionIds.forEach((missionId) => {
        if (completed.has(missionId)) {
          completedCount += 1;
        }
        if (saved.has(missionId)) {
          isSaved = true;
        }
      });

      statusById.set(mission.id, {
        saved: isSaved,
        completed: completedCount === mission.missionIds.length
      });
    });

    return statusById;
  });
  readonly filteredMissions = computed(() => this.catalog.filterMissions(this.baseMissions(), this.filters()));
  readonly title = computed(() => {
    const section = this.section();
    return this.copy.sections?.[section]?.detailTitle || this.copy.sections?.[section]?.title || this.t('angular.archive.fallbackTitle', 'Archivio missioni');
  });
  readonly text = computed(() => this.copy.sections?.[this.section()]?.text || '');

  readonly placeOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'place'));
  readonly typeOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'type'));
  readonly themeOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'theme'));
  readonly budgetOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'budget'));

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.section.set((params.get('section') as SectionKey) || 'general');
      this.resetFilters();
    });

    effect(() => {
      if (!this.guidedTour.active()) {
        return;
      }

      const currentStepId = this.guidedTour.currentStepId();
      if (currentStepId === 'archive_filters' || currentStepId === 'archive_results') {
        this.filtersOpen.set(true);
      }
    });
  }

  updateFilter<K extends keyof MissionFilterState>(key: K, value: MissionFilterState[K]): void {
    this.filters.update((filters) => ({ ...filters, [key]: value }));
  }

  resetFilters(): void {
    this.filters.set(this.getDefaultFilters());
  }

  toggleSaved(missionId: string): void {
    const mission = this.catalog.getMissionById(missionId);
    if (!mission) {
      return;
    }

    const wasSaved = this.catalog.isSaved(mission);
    this.catalog.toggleSaved(mission);
    this.feedback.show(
      wasSaved
        ? this.t('angular.archive.saveRemoved', 'Missione rimossa dai preferiti.')
        : this.t('angular.archive.saveAdded', 'Missione salvata tra i preferiti.'),
      'success'
    );
  }

  isHighlighted(missionId: string): boolean {
    const profileId = this.profileId();
    const mission = this.catalog.getMissionById(missionId);
    return !!profileId && !!mission && mission.highlightForCategoryIds.includes(profileId);
  }

  isCompleted(mission: MissionBundle): boolean {
    return !!this.missionStatus().get(mission.id)?.completed;
  }

  isSaved(mission: MissionBundle): boolean {
    return !!this.missionStatus().get(mission.id)?.saved;
  }

  private getDefaultFilters(): MissionFilterState {
    return {
      search: '',
      place: 'all',
      type: 'all',
      theme: 'all',
      difficulty: 'all',
      budget: 'all',
      duration: 'all'
    };
  }
}
