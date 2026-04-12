import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { buildMissionNarrativeScript } from '../content/mission.narrative';
import { DialogueLayerComponent } from '../components/dialogue-layer.component';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { MissionHeroCardComponent } from '../components/mission-hero-card.component';
import { NarrativeOverlayComponent } from '../components/narrative-overlay.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { ProgressThreadComponent } from '../components/progress-thread.component';
import { SceneViewportComponent } from '../components/scene-viewport.component';
import { isDialogueBeat } from '../models/narrative.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { MissionCatalogService } from '../services/mission-catalog.service';
import { MissionStateService } from '../services/mission-state.service';
import { SceneRuntimeService } from '../services/scene-runtime.service';
import { UiFeedbackService } from '../services/ui-feedback.service';

type ObjectiveViewState = 'locked' | 'active' | 'done' | 'pending';

@Component({
  selector: 'ia-mission-detail-page',
  standalone: true,
  imports: [
    EditorialScreenComponent,
    RouterLink,
    MissionHeroCardComponent,
    PrimaryButtonComponent,
    SceneViewportComponent,
    ProgressThreadComponent,
    DialogueLayerComponent,
    NarrativeOverlayComponent
  ],
  templateUrl: './mission-detail-page.component.html',
  styleUrl: './mission-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(LegacyContentService);
  private readonly catalog = inject(MissionCatalogService);
  private readonly missionState = inject(MissionStateService);
  private readonly feedback = inject(UiFeedbackService);
  readonly runtime = inject(SceneRuntimeService);
  private readonly missionId = signal(this.route.snapshot.paramMap.get('id') ?? '');

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
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
  readonly activeObjectiveIndex = computed(() => {
    const mission = this.mission();
    if (!mission) {
      return 0;
    }

    const completedIds = this.completedIds();
    const firstIncompleteIndex = mission.objectives.findIndex((objective) => !completedIds.has(objective.id));
    return firstIncompleteIndex === -1 ? Math.max(mission.objectives.length - 1, 0) : firstIncompleteIndex;
  });
  readonly primaryActionLabel = computed(() => {
    const mission = this.mission();
    if (!mission) {
      return '';
    }

    if (this.isCompleted()) {
      return this.t('angular.missionDetail.reopenMission', 'Riapri missione');
    }

    if (mission.isSequential) {
      return `${this.t('angular.missionDetail.markObjectiveDonePrefix', 'Segna obiettivo')} ${this.activeObjectiveIndex() + 1} ${this.t('angular.missionDetail.markObjectiveDoneSuffix', 'completato')}`;
    }

    return this.t('angular.missionDetail.markDone', 'Segna come fatta');
  });
  readonly secondaryActionLabel = computed(() => (
    this.isSaved()
      ? this.t('angular.missionDetail.removeSaved', 'Rimuovi dai salvati')
      : this.t('angular.missionDetail.saveMission', 'Salva missione')
  ));
  readonly dialogue = computed(() => {
    const beat = this.runtime.currentBeat();
    return isDialogueBeat(beat) ? beat : null;
  });
  readonly viewportTone = computed(() => this.runtime.currentScene()?.backgroundTone ?? 'atlas');
  readonly objectiveSceneIndex = computed(() => {
    const id = this.runtime.currentScene()?.id ?? '';
    const match = /-objective-(\d+)$/.exec(id);
    return match ? Number.parseInt(match[1], 10) : null;
  });
  readonly showObjectivePrimary = computed(() => {
    const mission = this.mission();
    if (!mission || this.isCompleted()) {
      return false;
    }
    const sceneIdx = this.objectiveSceneIndex();
    if (sceneIdx === null) {
      return false;
    }
    return sceneIdx === this.activeObjectiveIndex();
  });
  readonly contextOpen = signal(false);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.missionId.set(params.get('id') ?? '');
    });

    effect(() => {
      const mission = this.mission();
      if (!mission) {
        this.runtime.loadScript(null);
        return;
      }
      const revealed = mission.isSequential ? this.activeObjectiveIndex() + 1 : mission.objectives.length;
      const script = buildMissionNarrativeScript(mission, revealed);
      const previousId = untracked(() => this.runtime.script()?.id ?? null);
      const previousFlat = untracked(() => (previousId ? this.runtime.flatBeatIndex() : 0));
      this.runtime.loadScript(script);
      if (previousId === script.id) {
        this.runtime.restoreToFlatIndex(previousFlat);
      }
    });
  }

  openContext(): void {
    this.contextOpen.set(true);
  }

  closeContext(): void {
    this.contextOpen.set(false);
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

  toggleSaved(): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }

    const wasSaved = this.isSaved();
    this.catalog.toggleSaved(mission);
    this.feedback.show(
      wasSaved
        ? this.t('angular.missionDetail.saveRemoved', 'Missione rimossa dai salvati.')
        : this.t('angular.missionDetail.saveAdded', 'Missione salvata tra i preferiti.'),
      'success'
    );
  }

  handlePrimaryAction(): void {
    const mission = this.mission();
    if (!mission) {
      return;
    }

    if (this.isCompleted()) {
      this.catalog.toggleCompleted(mission);
      this.feedback.show(this.t('angular.missionDetail.missionReopened', 'Missione riaperta.'), 'success');
      return;
    }

    if (!this.showObjectivePrimary()) {
      this.feedback.show(this.t('angular.missionDetail.advanceHint', 'Avanza nel racconto fino al passaggio attivo per segnarlo completato.'), 'default');
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
      this.feedback.show(this.t('angular.missionDetail.completeActiveFirst', 'Completa prima l’obiettivo attivo.'), 'default');
      return;
    }

    const completedIds = this.completedIds();
    const shouldComplete = !completedIds.has(objectiveId);
    this.missionState.setCompletedForMissionIds([objectiveId], shouldComplete);

    if (shouldComplete) {
      const remainingObjectives = mission.objectives.filter((objective) => !completedIds.has(objective.id) && objective.id !== objectiveId);
      if (remainingObjectives.length) {
        this.feedback.show(this.t('angular.missionDetail.objectiveDoneNext', 'Obiettivo completato. Puoi passare al successivo.'), 'success');
      } else {
        this.feedback.show(this.t('angular.missionDetail.missionCompleted', 'Missione completata.'), 'success');
      }
      return;
    }

    this.feedback.show(this.t('angular.missionDetail.objectiveReopened', 'Obiettivo riaperto.'), 'success');
  }

  scenePrev(): void {
    this.runtime.previous();
  }

  sceneNext(): void {
    this.runtime.next();
  }
}
