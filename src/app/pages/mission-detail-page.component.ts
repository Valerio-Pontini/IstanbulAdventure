import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionCollapsibleCardComponent } from '../components/mission-collapsible-card.component';
import { MissionFactItem, MissionFactsCardComponent } from '../components/mission-facts-card.component';
import { MissionHeroCardComponent } from '../components/mission-hero-card.component';
import { MissionObjectiveCardComponent } from '../components/mission-objective-card.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

type MissionStateLabel = 'Non iniziata' | 'Salvata' | 'In corso' | 'Completata';
type ObjectiveViewState = 'locked' | 'active' | 'done' | 'pending';

type OnSiteStep = {
  title: string;
  text: string;
};

@Component({
  selector: 'ia-mission-detail-page',
  standalone: true,
  imports: [
    EditorialScreenComponent,
    MissionHeroCardComponent,
    PrimaryButtonComponent,
    MissionFactsCardComponent,
    MissionObjectiveCardComponent,
    MissionCollapsibleCardComponent
  ],
  templateUrl: './mission-detail-page.component.html',
  styleUrl: './mission-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(MissionCatalogService);
  private readonly missionState = inject(MissionStateService);
  private readonly feedback = inject(UiFeedbackService);
  private readonly missionId = signal(this.route.snapshot.paramMap.get('id') ?? '');

  readonly mission = computed(() => this.catalog.getMissionById(this.missionId()));
  readonly completedIds = computed(() => new Set(this.missionState.userState().completedMissionIds));
  readonly isSaved = computed(() => {
    const mission = this.mission();
    return mission ? this.catalog.isSaved(mission) : false;
  });
  readonly isCompleted = computed(() => {
    const mission = this.mission();
    return mission ? this.catalog.isCompleted(mission) : false;
  });
  readonly isInProgress = computed(() => {
    const mission = this.mission();
    return mission ? this.catalog.isInProgress(mission) : false;
  });
  readonly completedObjectiveCount = computed(() => {
    const mission = this.mission();
    const completedIds = this.completedIds();
    return mission ? mission.missionIds.filter((missionId) => completedIds.has(missionId)).length : 0;
  });
  readonly activeObjectiveIndex = computed(() => {
    const mission = this.mission();
    if (!mission) {
      return 0;
    }

    const completedIds = this.completedIds();
    const firstIncompleteIndex = mission.objectives.findIndex((objective) => !completedIds.has(objective.id));
    return firstIncompleteIndex === -1 ? Math.max(mission.objectives.length - 1, 0) : firstIncompleteIndex;
  });
  readonly missionStateLabel = computed<MissionStateLabel>(() => {
    if (this.isCompleted()) {
      return 'Completata';
    }

    if (this.isInProgress()) {
      return 'In corso';
    }

    if (this.isSaved()) {
      return 'Salvata';
    }

    return 'Non iniziata';
  });
  readonly factItems = computed<MissionFactItem[]>(() => {
    const mission = this.mission();
    if (!mission) {
      return [];
    }

    return [
      { label: 'Dove', value: mission.locationLabel },
      { label: 'Durata', value: mission.durationLabel },
      { label: 'Costo', value: mission.budgetLabel },
      { label: 'Tipologia', value: mission.typeLabel },
      { label: 'Stato', value: this.missionStateLabel() },
      { label: 'Struttura', value: mission.isSequential ? `${mission.objectiveCount} obiettivi in sequenza` : 'Missione singola' }
    ];
  });
  readonly primaryActionLabel = computed(() => {
    const mission = this.mission();
    if (!mission) {
      return '';
    }

    if (this.isCompleted()) {
      return 'Riapri missione';
    }

    if (mission.isSequential) {
      return `Segna obiettivo ${this.activeObjectiveIndex() + 1} completato`;
    }

    return 'Segna come fatta';
  });
  readonly secondaryActionLabel = computed(() => (this.isSaved() ? 'Rimuovi dai salvati' : 'Salva missione'));
  readonly topActionHint = computed(() => {
    const mission = this.mission();
    if (!mission) {
      return '';
    }

    if (this.isCompleted()) {
      return mission.isSequential
        ? `Percorso completato: ${mission.objectiveCount} obiettivi chiusi.`
        : 'Missione completata.';
    }

    if (this.isInProgress()) {
      return `In corso: ${this.completedObjectiveCount()} di ${mission.objectiveCount} obiettivi completati.`;
    }

    return mission.isSequential
      ? `Missione sequenziale: parti dall'obiettivo ${this.activeObjectiveIndex() + 1}.`
      : 'Missione pronta da usare sul posto.';
  });
  readonly contextPreview = computed(() => {
    const mission = this.mission();
    return mission ? this.getContextPreview(mission.context) : '';
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.missionId.set(params.get('id') ?? '');
    });
  }

  objectiveState(index: number, objectiveId: string): ObjectiveViewState {
    if (this.completedIds().has(objectiveId)) {
      return 'done';
    }

    const mission = this.mission();
    if (!mission) {
      return 'pending';
    }

    if (!mission.isSequential) {
      return 'active';
    }

    if (index < this.activeObjectiveIndex()) {
      return 'done';
    }

    if (index === this.activeObjectiveIndex()) {
      return 'active';
    }

    return 'locked';
  }

  objectiveStatusLabel(index: number, objectiveId: string): string {
    const state = this.objectiveState(index, objectiveId);
    if (state === 'done') {
      return 'Completato';
    }

    if (state === 'active') {
      return 'Attivo';
    }

    if (state === 'locked') {
      return 'Prima completa quello precedente';
    }

    return 'Da fare';
  }

  objectiveInstruction(index: number, objective: MissionObjectiveLike): string {
    const mission = this.mission();
    if (!mission) {
      return objective.description;
    }

    if (mission.isSequential) {
      return '';
    }

    const normalizedMissionDescription = this.normalizeComparableText(mission.description);
    const normalizedObjectiveDescription = this.normalizeComparableText(objective.description);
    return normalizedMissionDescription === normalizedObjectiveDescription ? '' : objective.description;
  }

  objectiveProgressLabel(index: number): string {
    const mission = this.mission();
    if (!mission) {
      return '';
    }

    return mission.isSequential ? `Step ${index + 1} di ${mission.objectiveCount}` : 'Step unico';
  }

  objectiveProgressHint(index: number, objectiveId: string): string {
    const mission = this.mission();
    if (!mission) {
      return '';
    }

    const state = this.objectiveState(index, objectiveId);
    if (state === 'done') {
      return 'Completato e chiuso.';
    }

    if (state === 'active') {
      return 'Questo è il passaggio da fare adesso.';
    }

    if (state === 'locked') {
      return 'Si sblocca dopo il passaggio precedente.';
    }

    return 'Pronto da affrontare.';
  }

  shouldRevealObjective(index: number): boolean {
    const mission = this.mission();
    if (!mission || !mission.isSequential) {
      return true;
    }

    return index <= this.activeObjectiveIndex();
  }

  hiddenObjectiveCount(): number {
    const mission = this.mission();
    if (!mission || !mission.isSequential) {
      return 0;
    }

    return Math.max(mission.objectiveCount - (this.activeObjectiveIndex() + 1), 0);
  }

  hiddenObjectiveTitle(): string {
    const mission = this.mission();
    if (!mission || !mission.isSequential) {
      return '';
    }

    const nextIndex = this.activeObjectiveIndex() + 1;
    return `Obiettivo ${nextIndex + 1}`;
  }

  hiddenObjectiveHint(): string {
    const mission = this.mission();
    if (!mission || !mission.isSequential) {
      return '';
    }

    const remainingHidden = this.hiddenObjectiveCount();
    if (remainingHidden <= 0) {
      return '';
    }

    if (remainingHidden === 1) {
      return `Completa prima l'obiettivo ${this.activeObjectiveIndex() + 1} per rivelare il passaggio successivo.`;
    }

    return `Completa prima l'obiettivo ${this.activeObjectiveIndex() + 1} per sbloccare altri ${remainingHidden} passaggi del percorso.`;
  }

  objectiveOnSiteSteps(index: number): OnSiteStep[] {
    const mission = this.mission();
    if (!mission) {
      return [];
    }

    const objective = mission.objectives[index] ?? mission.objectives[0];
    if (!objective) {
      return [];
    }

    const criteria = objective.validationCriteria ?? [];
    const whereText =
      mission.locationLabel === 'Ovunque'
        ? 'Parti da una zona coerente con il tema della missione e tieni il contesto nello sguardo.'
        : `Muoviti verso ${mission.locationLabel} e verifica di essere nel punto utile per completarlo.`;

    return [
      {
        title: 'Osserva',
        text: whereText
      },
      {
        title: 'Cerca il dettaglio chiave',
        text: criteria[0] ?? objective.description ?? mission.description
      },
      {
        title: 'Verifica',
        text: criteria[1] ?? `Controlla che il risultato sia coerente con ${objective.completionLabel.toLowerCase()}.`
      },
      {
        title: 'Chiudi',
        text: mission.isSequential
          ? 'Segna questo passaggio come completato prima di passare al successivo.'
          : 'Segna la missione come fatta quando hai una prova valida.'
      }
    ];
  }

  toggleSaved(): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }

    const wasSaved = this.isSaved();
    this.catalog.toggleSaved(mission);
    this.feedback.show(wasSaved ? 'Missione rimossa dai salvati.' : 'Missione salvata tra i preferiti.', 'success');
  }

  handlePrimaryAction(): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }

    if (this.isCompleted()) {
      this.catalog.toggleCompleted(mission);
      this.feedback.show('Missione riaperta.', 'success');
      return;
    }

    const objective = mission.objectives[this.activeObjectiveIndex()];
    if (!objective) {
      return;
    }

    this.toggleObjective(objective.id);
  }

  toggleObjective(objectiveId: string): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }

    const objectiveIndex = mission.objectives.findIndex((objective) => objective.id === objectiveId);
    if (objectiveIndex === -1) {
      return;
    }

    const state = this.objectiveState(objectiveIndex, objectiveId);
    if (state === 'locked') {
      this.feedback.show('Completa prima l’obiettivo attivo.', 'default');
      return;
    }

    const completedIds = this.completedIds();
    const shouldComplete = !completedIds.has(objectiveId);
    this.missionState.setCompletedForMissionIds([objectiveId], shouldComplete);

    if (shouldComplete) {
      const remainingObjectives = mission.objectives.filter((objective) => !completedIds.has(objective.id) && objective.id !== objectiveId);
      if (remainingObjectives.length) {
        this.feedback.show(`Obiettivo completato. Puoi passare al successivo.`, 'success');
      } else {
        this.feedback.show('Missione completata.', 'success');
      }
      return;
    }

    this.feedback.show('Obiettivo riaperto.', 'success');
  }

  private getContextPreview(context: string): string {
    const [firstParagraph = ''] = String(context || '')
      .split('\n\n')
      .map((part) => part.trim())
      .filter(Boolean);

    return firstParagraph;
  }

  private normalizeComparableText(value: string): string {
    return String(value || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
}

type MissionObjectiveLike = {
  description: string;
};
