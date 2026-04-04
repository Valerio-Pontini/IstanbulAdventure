import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCardComponent } from '../components/mission-card.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionBundle, MissionFilterState, SectionKey } from '../models/app.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

@Component({
  selector: 'ia-archive-page',
  standalone: true,
  imports: [FormsModule, RouterLink, EditorialScreenComponent, SectionHeaderComponent, NarrativeCardComponent, MissionCardComponent],
  template: `
    <ia-editorial-screen>
      <ia-section-header eyebrow="Archivio missioni" [title]="title()" [description]="text()">
        <a class="editorial-link" routerLink="/home">Torna alla home</a>
      </ia-section-header>

      <div id="tutorial-archive-filters" class="tutorial-anchor">
        <ia-narrative-card eyebrow="Consultazione rapida" title="Trova il percorso giusto per questo momento">
          <div class="filter-grid">
            <label class="filter-field">
              <span>Ricerca</span>
              <input [ngModel]="filters().search" (ngModelChange)="updateFilter('search', $event)" placeholder="Titolo, tema o descrizione" />
            </label>

            <label class="filter-field">
              <span>Personalita'</span>
              <select [ngModel]="filters().personality" (ngModelChange)="updateFilter('personality', $event)">
                <option value="all">Tutte</option>
                @for (option of personalityOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Luogo</span>
              <select [ngModel]="filters().place" (ngModelChange)="updateFilter('place', $event)">
                <option value="all">Tutti</option>
                @for (option of placeOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Tipologia</span>
              <select [ngModel]="filters().type" (ngModelChange)="updateFilter('type', $event)">
                <option value="all">Tutte</option>
                @for (option of typeOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Tema</span>
              <select [ngModel]="filters().theme" (ngModelChange)="updateFilter('theme', $event)">
                <option value="all">Tutti</option>
                @for (option of themeOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Difficolta'</span>
              <select [ngModel]="filters().difficulty" (ngModelChange)="updateFilter('difficulty', $event)">
                <option value="all">Tutte</option>
                @for (option of difficultyOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Budget</span>
              <select [ngModel]="filters().budget" (ngModelChange)="updateFilter('budget', $event)">
                <option value="all">Tutti</option>
                @for (option of budgetOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Durata</span>
              <select [ngModel]="filters().duration" (ngModelChange)="updateFilter('duration', $event)">
                <option value="all">Tutte</option>
                @for (option of durationOptions(); track option.value) {
                  <option [value]="option.value">{{ option.label }} ({{ option.count }})</option>
                }
              </select>
            </label>
          </div>
        </ia-narrative-card>
      </div>

      <div id="tutorial-archive-actions" class="editorial-links tutorial-anchor">
        <button class="editorial-link editorial-link--plain" type="button" (click)="resetFilters()">Pulisci filtri</button>
        <span class="editorial-counter">{{ filteredMissions().length }} risultati</span>
      </div>

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
        <ia-narrative-card tone="quiet" [title]="copy.detailView?.emptyTitle || 'Nessuna missione'" [text]="copy.detailView?.emptyText || 'Prova con filtri diversi.'" />
      }
    </ia-editorial-screen>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivePageComponent {
  readonly copy = inject(LegacyContentService).homeCopy;
  private readonly catalog = inject(MissionCatalogService);
  private readonly state = inject(MissionStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly feedback = inject(UiFeedbackService);

  readonly section = signal<SectionKey>((this.route.snapshot.paramMap.get('section') as SectionKey) || 'general');
  readonly profileId = this.state.categoryId;
  readonly filters = signal<MissionFilterState>(this.getDefaultFilters());
  readonly baseMissions = computed(() => this.catalog.getSectionMissions(this.section(), this.profileId()));
  readonly filteredMissions = computed(() => this.catalog.filterMissions(this.baseMissions(), this.filters()));
  readonly title = computed(() => {
    const section = this.section();
    return this.copy.sections?.[section]?.detailTitle || this.copy.sections?.[section]?.title || 'Archivio missioni';
  });
  readonly text = computed(() => this.copy.sections?.[this.section()]?.text || '');

  readonly personalityOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'personality'));
  readonly placeOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'place'));
  readonly typeOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'type'));
  readonly themeOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'theme'));
  readonly difficultyOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'difficulty'));
  readonly budgetOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'budget'));
  readonly durationOptions = computed(() => this.catalog.getFilterOptions(this.baseMissions(), 'duration'));

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.section.set((params.get('section') as SectionKey) || 'general');
      this.resetFilters();
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

  private getDefaultFilters(): MissionFilterState {
    return {
      search: '',
      personality: 'all',
      place: 'all',
      type: 'all',
      theme: 'all',
      difficulty: 'all',
      budget: 'all',
      duration: 'all'
    };
  }
}
