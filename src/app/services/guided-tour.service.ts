import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MissionCatalogService } from './mission-catalog.service';
import { MissionStateService } from './mission-state.service';
import { OnboardingService } from './onboarding.service';

type GuidedTourStep = {
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

  private readonly activeSignal = signal(false);
  private readonly stepIndexSignal = signal(0);

  readonly active = this.activeSignal.asReadonly();
  readonly stepIndex = this.stepIndexSignal.asReadonly();
  readonly steps = computed(() => this.buildSteps());
  readonly currentStep = computed(() => this.steps()[this.stepIndexSignal()] ?? null);
  readonly totalSteps = computed(() => this.steps().length);

  async startIfNeeded(): Promise<void> {
    if (!this.onboarding.showHomeTutorial() || this.activeSignal()) {
      return;
    }

    this.activeSignal.set(true);
    this.stepIndexSignal.set(0);
    await this.ensureCurrentRoute();
  }

  async next(): Promise<void> {
    const lastIndex = this.steps().length - 1;
    if (this.stepIndexSignal() >= lastIndex) {
      this.complete();
      return;
    }

    this.stepIndexSignal.update((index) => Math.min(lastIndex, index + 1));
    await this.ensureCurrentRoute();
  }

  async previous(): Promise<void> {
    this.stepIndexSignal.update((index) => Math.max(0, index - 1));
    await this.ensureCurrentRoute();
  }

  skip(): void {
    this.complete();
  }

  complete(): void {
    this.activeSignal.set(false);
    this.onboarding.dismissHomeTutorial();
  }

  private async ensureCurrentRoute(): Promise<void> {
    const step = this.currentStep();
    if (!step || this.router.url === step.route) {
      return;
    }

    await this.router.navigateByUrl(step.route);
  }

  private buildSteps(): GuidedTourStep[] {
    const categoryId = this.missionState.categoryId();
    const personalMission = this.catalog.getSectionMissions('personal', categoryId)[0]
      ?? this.catalog.getSectionMissions('general', categoryId)[0]
      ?? this.catalog.getSectionMissions('locations', categoryId)[0]
      ?? null;
    const archiveRoute = categoryId ? '/archive/personal' : '/archive/general';
    const detailRoute = personalMission ? `/mission/${personalMission.id}` : '/home';

    const steps: GuidedTourStep[] = [
      {
        route: '/home',
        selector: '#tutorial-home-archives',
        title: 'Da qui apri i tre archivi principali',
        text: 'Questi pulsanti ti portano subito nell’archivio generale, nei luoghi oppure nella selezione personale costruita per il tuo profilo.',
        accent: 'Archivi'
      },
      {
        route: archiveRoute,
        selector: '#tutorial-archive-filters',
        title: 'Qui filtri l’archivio in base al momento',
        text: 'Ricerca, luogo, tipologia, tema e budget servono per restringere rapidamente le missioni più adatte a dove sei e a quanto tempo hai.',
        accent: 'Filtri'
      },
      {
        route: archiveRoute,
        selector: '#tutorial-archive-actions',
        title: 'Qui pulisci i filtri e controlli i risultati',
        text: 'Con "Pulisci filtri" torni all’elenco completo; accanto vedi subito quante missioni restano disponibili dopo la selezione.',
        accent: 'Controllo risultati'
      },
      {
        route: archiveRoute,
        selector: 'ia-mission-card:first-of-type .mission-card__actions',
        title: 'Ogni card ha due azioni rapide',
        text: 'Con "Apri missione" entri nel dettaglio della missione. Con "Salva" la tieni tra i preferiti per ritrovarla al volo.',
        accent: 'Azioni rapide'
      }
    ];

    if (personalMission) {
      steps.push({
        route: detailRoute,
        selector: '#tutorial-mission-actions',
        title: 'Nel dettaglio gestisci il tuo avanzamento',
        text: 'Qui puoi salvare la missione per recuperarla dopo oppure segnarla come fatta quando l’hai completata davvero.',
        accent: 'Salva e completato'
      });
    }

    return steps;
  }
}
