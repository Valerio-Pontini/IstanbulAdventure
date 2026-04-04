import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

@Component({
  selector: 'ia-mission-detail-page',
  standalone: true,
  imports: [RouterLink, EditorialScreenComponent, SectionHeaderComponent, NarrativeCardComponent, PrimaryButtonComponent],
  template: `
    @if (mission(); as mission) {
      <ia-editorial-screen>
        <ia-section-header eyebrow="Scheda missione" [title]="mission.title" [description]="mission.description">
          <a class="editorial-link" routerLink="/home">Torna alla home</a>
        </ia-section-header>

        <div class="screen-grid">
          <ia-narrative-card tone="accent" eyebrow="Panoramica" title="Coordinate essenziali">
            <div class="detail-ribbon">
              <span>{{ mission.locationLabel }}</span>
              <span>{{ mission.typeLabel }}</span>
              <span>{{ mission.difficultyLabel }}</span>
              <span>{{ mission.durationLabel }}</span>
              <span>{{ mission.budgetLabel }}</span>
              @if (mission.isSequential) {
                <span>{{ mission.objectiveCount }} obiettivi</span>
              }
            </div>
          </ia-narrative-card>

          <ia-narrative-card tone="quiet" eyebrow="Stato" title="Tieni questa missione a portata di mano">
            <div class="editorial-actions">
              <ia-primary-button
                [label]="isSaved() ? 'Rimuovi dai salvati' : 'Salva missione'"
                tone="ghost"
                (pressed)="toggleSaved(mission.id)"
              />
              <ia-primary-button
                [label]="isCompleted() ? 'Segnata come completata' : 'Segna come fatta'"
                (pressed)="toggleCompleted(mission.id)"
              />
            </div>
          </ia-narrative-card>
        </div>

        @if (mission.context) {
          <ia-narrative-card tone="quiet" eyebrow="Contesto" title="Prima di agire, leggi il margine" [text]="mission.context" />
        }

        <ia-narrative-card tone="quiet" eyebrow="Flusso di lettura" title="Come affrontarla sul posto">
          <div class="detail-ribbon">
            <span>Osserva</span>
            <span>Interpreta</span>
            <span>Documenta</span>
            <span>Condividi</span>
          </div>
        </ia-narrative-card>

        <section class="section-stack">
          @for (objective of mission.objectives; track objective.id; let index = $index) {
            <ia-narrative-card [eyebrow]="'Obiettivo ' + (index + 1)" [title]="objective.title" [text]="objective.description">
              <ia-narrative-card tone="quiet" eyebrow="Scoperta" title="Perche' conta" [text]="objective.discovery" />

              <div class="detail-list">
                @for (criterion of objective.validationCriteria; track criterion) {
                  <div class="detail-list__item">{{ criterion }}</div>
                }
              </div>
            </ia-narrative-card>
          }
        </section>
      </ia-editorial-screen>
    } @else {
      <ia-editorial-screen>
        <ia-narrative-card title="Missione non trovata" text="Il percorso che stai cercando non e' disponibile." />
      </ia-editorial-screen>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(MissionCatalogService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly missionId = signal(this.route.snapshot.paramMap.get('id') ?? '');
  readonly mission = computed(() => this.catalog.getMissionById(this.missionId()));
  readonly isSaved = computed(() => {
    const mission = this.mission();
    return mission ? this.catalog.isSaved(mission) : false;
  });
  readonly isCompleted = computed(() => {
    const mission = this.mission();
    return mission ? this.catalog.isCompleted(mission) : false;
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.missionId.set(params.get('id') ?? '');
    });
  }

  toggleSaved(missionId: string): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }

    const wasSaved = this.isSaved();
    this.catalog.toggleSaved(mission);
    this.feedback.show(wasSaved ? 'Missione rimossa dai preferiti.' : 'Missione salvata tra i preferiti.', 'success');
  }

  toggleCompleted(missionId: string): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }

    const wasCompleted = this.isCompleted();
    this.catalog.toggleCompleted(mission);
    this.feedback.show(wasCompleted ? 'Missione riaperta.' : 'Missione segnata come completata.', 'success');
  }
}
