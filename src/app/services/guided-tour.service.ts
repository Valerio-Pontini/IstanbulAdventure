import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MissionCatalogService } from './mission-catalog.service';
import { MissionStateService } from './mission-state.service';
import { LegacyContentService } from './legacy-content.service';
import { OnboardingService } from './onboarding.service';

type GuidedTourStep = {
  id: string;
  route: string;
  selector: string;
  title: string;
  text: string;
  accent: string;
};

@Injectable({ providedIn: 'root' })
export class GuidedTourService {
  private readonly router = inject(Router);
  private readonly catalog = inject(MissionCatalogService);
  private readonly missionState = inject(MissionStateService);
  private readonly onboarding = inject(OnboardingService);
  private readonly content = inject(LegacyContentService);

  private readonly activeSignal = signal(false);
  private readonly pendingSignal = signal(false);
  private readonly stepIndexSignal = signal(0);
  private readonly stepsSignal = signal<GuidedTourStep[]>([]);

  readonly active = this.activeSignal.asReadonly();
  readonly pending = this.pendingSignal.asReadonly();
  readonly stepIndex = this.stepIndexSignal.asReadonly();
  readonly steps = this.stepsSignal.asReadonly();
  readonly currentStep = computed(() => this.stepsSignal()[this.stepIndexSignal()] ?? null);
  readonly currentStepId = computed(() => this.currentStep()?.id ?? null);
  readonly totalSteps = computed(() => this.stepsSignal().length);

  async startIfNeeded(): Promise<void> {
    if (!this.onboarding.showHomeTutorial() || this.activeSignal()) {
      return;
    }

    const steps = this.buildSteps();
    if (!steps.length) {
      return;
    }

    this.stepsSignal.set(steps);
    this.activeSignal.set(true);
    this.stepIndexSignal.set(0);
    this.pendingSignal.set(true);
    try {
      await this.ensureCurrentRoute();
    } finally {
      this.pendingSignal.set(false);
    }
  }

  async next(): Promise<void> {
    if (this.pendingSignal()) {
      return;
    }

    const lastIndex = this.steps().length - 1;
    if (this.stepIndexSignal() >= lastIndex) {
      this.complete();
      return;
    }

    this.pendingSignal.set(true);
    this.stepIndexSignal.update((index) => Math.min(lastIndex, index + 1));
    try {
      await this.ensureCurrentRoute();
    } finally {
      this.pendingSignal.set(false);
    }
  }

  async previous(): Promise<void> {
    if (this.pendingSignal()) {
      return;
    }

    this.pendingSignal.set(true);
    this.stepIndexSignal.update((index) => Math.max(0, index - 1));
    try {
      await this.ensureCurrentRoute();
    } finally {
      this.pendingSignal.set(false);
    }
  }

  skip(): void {
    this.complete();
  }

  complete(): void {
    this.pendingSignal.set(false);
    this.activeSignal.set(false);
    this.stepIndexSignal.set(0);
    this.stepsSignal.set([]);
    this.onboarding.dismissHomeTutorial();
  }

  private async ensureCurrentRoute(): Promise<void> {
    const step = this.currentStep();
    if (!step || this.router.url === step.route) {
      return;
    }

    // Safeguard: never leave the tutorial in a pending state if navigation hangs.
    await Promise.race([
      this.router.navigateByUrl(step.route, { replaceUrl: true }),
      new Promise<void>((resolve) => setTimeout(resolve, 1600))
    ]);
  }

  private buildSteps(): GuidedTourStep[] {
    const categoryId = this.missionState.categoryId();
    const personalMission = this.catalog.getSectionMissions('personal', categoryId)[0] ?? null;
    const archiveRoute = categoryId ? '/archive/personal' : '/archive/general';
    const detailRoute = personalMission ? `/mission/${personalMission.id}` : null;

    const steps: GuidedTourStep[] = [
      {
        id: 'home_paths',
        route: '/home',
        selector: '#tutorial-home-archives',
        title: this.content.t('angular.guidedTour.homePathsTitle', 'Parti dai tre archivi principali'),
        text: this.content.t('angular.guidedTour.homePathsText', 'Da qui scegli subito il tipo di esplorazione: generale, luoghi o percorso personale. Tocca una card e continui in un tap.'),
        accent: this.content.t('angular.guidedTour.homePathsAccent', 'Hub')
      },
      {
        id: 'archive_filters_toggle',
        route: archiveRoute,
        selector: '#tutorial-archive-filter-toggle',
        title: this.content.t('angular.guidedTour.archiveFiltersToggleTitle', 'Apri o chiudi i filtri quando serve'),
        text: this.content.t('angular.guidedTour.archiveFiltersToggleText', 'Il pulsante filtri mantiene la pagina pulita su mobile. Aprili solo quando devi affinare la ricerca.'),
        accent: this.content.t('angular.guidedTour.archiveFiltersToggleAccent', 'Filtro rapido')
      },
      {
        id: 'archive_filters',
        route: archiveRoute,
        selector: '#tutorial-archive-filters',
        title: this.content.t('angular.guidedTour.archiveFiltersTitle', 'Scegli i filtri con pochi tocchi'),
        text: this.content.t('angular.guidedTour.archiveFiltersText', 'Ricerca, luogo, tipo, tema e budget riducono l’elenco in tempo reale. Cosi trovi subito missioni fattibili nel momento giusto.'),
        accent: this.content.t('angular.guidedTour.archiveFiltersAccent', 'Selezione')
      },
      {
        id: 'archive_results',
        route: archiveRoute,
        selector: '#tutorial-archive-actions, #tutorial-archive-cards .mission-card',
        title: this.content.t('angular.guidedTour.archiveResultsTitle', 'Controlla risultati e apri la missione'),
        text: this.content.t('angular.guidedTour.archiveResultsText', 'In alto vedi quante missioni restano. Poi apri la card migliore o salvala per dopo, senza perdere il contesto.'),
        accent: this.content.t('angular.guidedTour.archiveResultsAccent', 'Risultati')
      }
    ];

    if (personalMission && detailRoute) {
      steps.push({
        id: 'mission_actions',
        route: detailRoute,
        selector: '#tutorial-mission-actions',
        title: this.content.t('angular.guidedTour.missionActionsTitle', 'Nel dettaglio gestisci il progresso'),
        text: this.content.t('angular.guidedTour.missionActionsText', 'Qui fai avanzare la scena, salvi la missione o la segni completata. Tutte le azioni chiave sono a portata di pollice.'),
        accent: this.content.t('angular.guidedTour.missionActionsAccent', 'Avanzamento')
      });
    }

    return steps;
  }
}
