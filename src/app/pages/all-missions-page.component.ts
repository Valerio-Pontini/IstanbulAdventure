import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCardComponent } from '../components/mission-card.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionBundle } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

type MissionStatusFilter = 'all' | 'todo' | 'saved' | 'completed';

type FilterChip = {
  key: MissionStatusFilter;
  label: string;
  count: number;
};

@Component({
  selector: 'ia-all-missions-page',
  standalone: true,
  imports: [FormsModule, RouterLink, EditorialScreenComponent, SectionHeaderComponent, NarrativeCardComponent, MissionCardComponent],
  template: `
    <ia-editorial-screen>
      <ia-section-header
        [eyebrow]="t('angular.allMissions.eyebrow', 'Tutte le missioni')"
        [title]="t('angular.allMissions.title', 'Vista completa delle missioni')"
        [description]="t('angular.allMissions.description', 'Il catalogo completo delle missioni, con filtri rapidi per capire cosa ti resta da fare, cosa hai salvato e cosa hai gia chiuso.')"
      >
        <a class="editorial-link" routerLink="/home">{{ t('angular.allMissions.backHome', 'Torna alla home') }}</a>
      </ia-section-header>

      <div class="editorial-links">
        <button class="editorial-link" type="button" (click)="filtersOpen.update((value) => !value)">
          {{ filtersOpen() ? t('angular.common.hideFilters', 'Nascondi filtri') : t('angular.common.showFilters', 'Mostra filtri') }}
        </button>
      </div>

      @if (filtersOpen()) {
      <section class="all-missions__filters">
        <div class="all-missions__controls">
          <label class="all-missions__search">
            <span>{{ t('angular.allMissions.searchLabel', 'Cerca una missione') }}</span>
            <input [ngModel]="search()" (ngModelChange)="search.set($event)" [placeholder]="t('angular.allMissions.searchPlaceholder', 'Titolo, tema o luogo')" />
          </label>

          <div class="all-missions__chips" role="tablist" [attr.aria-label]="t('angular.allMissions.filterByStatus', 'Filtra per stato')">
            @for (chip of filterChips(); track chip.key) {
              <button
                type="button"
                class="all-missions__chip"
                [class.all-missions__chip--active]="statusFilter() === chip.key"
                [attr.aria-selected]="statusFilter() === chip.key"
                (click)="statusFilter.set(chip.key)"
              >
                <strong>{{ chip.label }}</strong>
                <span>{{ chip.count }}</span>
              </button>
            }
          </div>
        </div>
      </section>
      }

      <div class="editorial-links">
        <button class="editorial-link editorial-link--plain" type="button" (click)="resetFilters()">{{ t('angular.allMissions.resetFilters', 'Azzera filtri') }}</button>
        <span class="editorial-counter">{{ filteredMissions().length }} {{ t('angular.allMissions.visibleSuffix', 'missioni visibili') }}</span>
      </div>

      @if (filteredMissions().length) {
        <div class="catalog-grid">
          @for (mission of filteredMissions(); track mission.id) {
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
      } @else {
        <ia-narrative-card
          tone="quiet"
          [title]="t('angular.allMissions.emptyTitle', 'Nessuna missione per questo filtro')"
          [text]="t('angular.allMissions.emptyText', 'Prova a cambiare stato o ricerca per tornare all elenco completo.')"
        />
      }
    </ia-editorial-screen>
  `,
  styleUrl: './all-missions-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllMissionsPageComponent {
  private readonly content = inject(LegacyContentService);
  private readonly catalog = inject(MissionCatalogService);
  private readonly state = inject(MissionStateService);
  private readonly feedback = inject(UiFeedbackService);

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
  readonly profileId = this.state.categoryId;
  readonly filtersOpen = signal(false);
  readonly search = signal('');
  readonly statusFilter = signal<MissionStatusFilter>('all');
  readonly missions = computed(() => this.catalog.getCatalogMissions());
  readonly filterChips = computed<FilterChip[]>(() => {
    const missions = this.missions();
    return [
      { key: 'all', label: this.t('angular.allMissions.chipAll', 'Tutte'), count: missions.length },
      { key: 'todo', label: this.t('angular.allMissions.chipTodo', 'Da fare'), count: missions.filter((mission) => !this.isCompleted(mission)).length },
      { key: 'saved', label: this.t('angular.allMissions.chipSaved', 'Salvate'), count: missions.filter((mission) => this.isSaved(mission)).length },
      { key: 'completed', label: this.t('angular.allMissions.chipCompleted', 'Completate'), count: missions.filter((mission) => this.isCompleted(mission)).length }
    ];
  });
  readonly filteredMissions = computed(() => {
    const query = this.normalize(this.search());
    const selectedStatus = this.statusFilter();

    return this.missions().filter((mission) => {
      const matchesSearch = !query || mission.searchIndex.includes(query);
      if (!matchesSearch) {
        return false;
      }

      if (selectedStatus === 'todo') {
        return !this.isCompleted(mission);
      }

      if (selectedStatus === 'saved') {
        return this.isSaved(mission);
      }

      if (selectedStatus === 'completed') {
        return this.isCompleted(mission);
      }

      return true;
    });
  });

  resetFilters(): void {
    this.search.set('');
    this.statusFilter.set('all');
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
        ? this.t('angular.allMissions.saveRemoved', 'Missione rimossa dai preferiti.')
        : this.t('angular.allMissions.saveAdded', 'Missione salvata tra i preferiti.'),
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

  private normalize(value: string): string {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
