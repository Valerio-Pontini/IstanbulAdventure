import { Injectable } from '@angular/core';
import { FilterOption, MissionBundle, MissionFilterState, MissionItem, MissionObjective, SectionKey } from '../models/app.models';
import { LegacyContentService } from './legacy-content.service';
import { MissionStateService } from './mission-state.service';

const LAST_SUGGESTED_MISSION_KEY = 'istanbulAdventure.lastSuggestedMissionId';

@Injectable({ providedIn: 'root' })
export class MissionCatalogService {
  private readonly bundleIndex: Record<string, MissionBundle>;

  constructor(
    private readonly content: LegacyContentService,
    private readonly state: MissionStateService
  ) {
    this.bundleIndex = this.buildBundleIndex();
  }

  getSectionMissions(section: SectionKey, categoryId: string | null): MissionBundle[] {
    const source =
      section === 'personal'
        ? this.content.missions.byCategory[categoryId ?? ''] ?? []
        : section === 'locations'
          ? this.content.missions.locations
          : this.content.missions.general;

    return this.sortBundles(this.createBundles(source).filter((mission) => this.isVisibleForCategory(mission, categoryId)), categoryId);
  }

  getMissionById(missionId: string): MissionBundle | null {
    return this.bundleIndex[missionId] ?? null;
  }

  getRecommended(section: SectionKey, categoryId: string | null, limit = 3): MissionBundle[] {
    return this.getSectionMissions(section, categoryId).slice(0, limit);
  }

  getSuggestedMission(categoryId: string | null): MissionBundle | null {
    const personal = this.getSectionMissions('personal', categoryId);
    const general = this.getSectionMissions('general', categoryId);
    const locations = this.getSectionMissions('locations', categoryId);
    const candidates = [...personal, ...general, ...locations].filter((mission) => !this.isCompleted(mission));

    if (!candidates.length) {
      return [...personal, ...general, ...locations][0] ?? null;
    }

    const lastSuggestedMissionId = window.localStorage.getItem(LAST_SUGGESTED_MISSION_KEY);
    const bestCandidate = [...candidates].sort((left, right) => this.getSuggestedScore(right, categoryId) - this.getSuggestedScore(left, categoryId))[0];
    const alternativeCandidate = [...candidates]
      .filter((mission) => mission.id !== bestCandidate?.id)
      .sort((left, right) => this.getSuggestedScore(right, categoryId) - this.getSuggestedScore(left, categoryId))
      .find((mission) => {
        if (!bestCandidate) {
          return true;
        }

        return mission.typeLabel !== bestCandidate.typeLabel || mission.themeLabel !== bestCandidate.themeLabel;
      });

    const suggestedMission =
      lastSuggestedMissionId && bestCandidate?.id === lastSuggestedMissionId && alternativeCandidate ? alternativeCandidate : bestCandidate;

    if (suggestedMission) {
      window.localStorage.setItem(LAST_SUGGESTED_MISSION_KEY, suggestedMission.id);
    }

    return suggestedMission ?? null;
  }

  getFilterOptions(missions: MissionBundle[], filterKey: keyof Omit<MissionFilterState, 'search'>): FilterOption[] {
    const counts = new Map<string, FilterOption>();

    missions.forEach((mission) => {
      const value = mission.filterValues[filterKey];
      const label = mission.filterLabels[filterKey];
      const current = counts.get(value);
      counts.set(value, {
        value,
        label,
        count: (current?.count ?? 0) + 1
      });
    });

    return [...counts.values()].sort((left, right) => left.label.localeCompare(right.label, 'it'));
  }

  filterMissions(missions: MissionBundle[], filters: MissionFilterState): MissionBundle[] {
    const queryTokens = this.normalize(filters.search).split(/\s+/).filter(Boolean);

    return missions.filter((mission) => {
      const matchesSearch = !queryTokens.length || queryTokens.every((token) => mission.searchIndex.includes(token));
      if (!matchesSearch) {
        return false;
      }

      return (Object.entries(filters) as [keyof MissionFilterState, string][])
        .filter(([key]) => key !== 'search')
        .every(([key, value]) => {
          if (value === 'all') {
            return true;
          }

          return this.matchesFilterValue(mission, key, value);
        });
    });
  }

  isSaved(bundle: MissionBundle): boolean {
    const saved = new Set(this.state.userState().savedMissionIds);
    return bundle.missionIds.some((missionId) => saved.has(missionId));
  }

  isCompleted(bundle: MissionBundle): boolean {
    const completed = new Set(this.state.userState().completedMissionIds);
    return bundle.missionIds.every((missionId) => completed.has(missionId));
  }

  isInProgress(bundle: MissionBundle): boolean {
    const completed = new Set(this.state.userState().completedMissionIds);
    const completedCount = bundle.missionIds.filter((missionId) => completed.has(missionId)).length;
    return completedCount > 0 && completedCount < bundle.missionIds.length;
  }

  toggleSaved(bundle: MissionBundle): void {
    const shouldSave = !this.isSaved(bundle);
    this.state.setSavedForMissionIds(bundle.missionIds, shouldSave);
  }

  toggleCompleted(bundle: MissionBundle): void {
    const shouldComplete = !this.isCompleted(bundle);
    this.state.setCompletedForMissionIds(bundle.missionIds, shouldComplete);
  }

  private buildBundleIndex(): Record<string, MissionBundle> {
    return Object.fromEntries(this.createBundles(this.content.missions.all).map((bundle) => [bundle.id, bundle]));
  }

  private createBundles(missions: MissionItem[]): MissionBundle[] {
    const sourceIndex = Object.fromEntries(missions.map((mission) => [mission.id, mission]));
    const consumed = new Set<string>();
    const bundles: MissionBundle[] = [];

    missions.forEach((mission) => {
      if (consumed.has(mission.id)) {
        return;
      }

      if (mission.sequence.isSequential && mission.sequence.isStart) {
        const chain = this.collectSequence(mission, sourceIndex);
        chain.forEach((item) => consumed.add(item.id));
        bundles.push(this.createBundle(chain));
        return;
      }

      if (mission.sequence.isSequential && !mission.sequence.isStart) {
        return;
      }

      consumed.add(mission.id);
      bundles.push(this.createBundle([mission]));
    });

    return bundles;
  }

  private collectSequence(startMission: MissionItem, sourceIndex: Record<string, MissionItem>): MissionItem[] {
    const chain: MissionItem[] = [];
    const visited = new Set<string>();
    let current: MissionItem | null = startMission;

    while (current && !visited.has(current.id)) {
      chain.push(current);
      visited.add(current.id);
      current = current.sequence.nextMissionId ? sourceIndex[current.sequence.nextMissionId] ?? null : null;
    }

    return chain;
  }

  private createBundle(missions: MissionItem[]): MissionBundle {
    const first = missions[0];
    const totalDuration = missions.reduce((sum, mission) => sum + (Number.isFinite(mission.durationMin) ? mission.durationMin : 0), 0);
    const totalBudget = missions.reduce((sum, mission) => sum + (Number.isFinite(mission.budgetTry) ? mission.budgetTry : 0), 0);
    const maxDifficulty = Math.max(...missions.map((mission) => mission.difficulty));
    const objectives = missions.map((mission) => this.createObjective(mission));
    const title = missions.length > 1 ? first.sequence.name || first.title : first.title;
    const description =
      missions.length > 1
        ? `${first.description} Questo percorso include ${missions.length} obiettivi da completare in sequenza.`
        : first.description;

    return {
      id: first.id,
      slug: first.slug,
      title,
      description,
      context: this.buildBundleContext(missions),
      locationLabel: first.locationLabel,
      typeLabel: missions.length > 1 ? 'Percorso sequenziale' : first.typeLabel,
      themeLabel: first.themeLabel,
      secondaryThemeLabels: first.secondaryThemeLabels,
      difficulty: maxDifficulty,
      difficultyLabel: missions.length > 1 ? `Fino a ${maxDifficulty}/5` : first.difficultyLabel,
      durationMin: totalDuration > 0 ? totalDuration : first.durationMin,
      durationLabel: totalDuration > 0 ? `${totalDuration} min` : first.durationLabel,
      budgetTry: totalBudget > 0 ? totalBudget : first.budgetTry,
      budgetLabel: totalBudget > 0 ? `~${totalBudget} TRY` : first.budgetLabel,
      meta: missions.length > 1 ? `${first.locationLabel} • ${missions.length} obiettivi` : first.meta,
      iconSrc: first.iconSrc,
      iconAlt: first.iconAlt,
      searchIndex: this.normalize(missions.map((mission) => mission.searchIndex).join(' ')),
      filterValues: first.filterValues,
      filterLabels: {
        ...first.filterLabels,
        difficulty: missions.length > 1 ? `Percorso fino a ${maxDifficulty}/5` : first.filterLabels.difficulty,
        duration: totalDuration > 0 ? `${totalDuration} min` : first.filterLabels.duration,
        budget: totalBudget > 0 ? `~${totalBudget} TRY` : first.filterLabels.budget
      },
      availableForCategoryIds: [...new Set(missions.flatMap((mission) => mission.availableForCategoryIds))],
      highlightForCategoryIds: [...new Set(missions.flatMap((mission) => mission.highlightForCategoryIds))],
      sortPriority: Math.min(...missions.map((mission) => mission.sortPriority)),
      isSequential: missions.length > 1,
      isStandalone: first.sequence.isStandalone,
      sequenceName: first.sequence.name,
      objectiveCount: objectives.length,
      missionIds: missions.map((mission) => mission.id),
      objectives
    };
  }

  private createObjective(mission: MissionItem): MissionObjective {
    return {
      id: mission.id,
      title: mission.title,
      description: mission.description,
      discovery: mission.discovery,
      validationCriteria: mission.validationCriteria,
      completionLabel: mission.completionLabel,
      points: mission.points
    };
  }

  private buildBundleContext(missions: MissionItem[]): string {
    const uniqueContexts = [...new Set(missions.map((mission) => mission.information).filter(Boolean))];

    if (!uniqueContexts.length) {
      return '';
    }

    if (uniqueContexts.length === 1) {
      return uniqueContexts[0];
    }

    return uniqueContexts.join('\n\n');
  }

  private sortBundles(missions: MissionBundle[], categoryId: string | null): MissionBundle[] {
    return [...missions].sort((left, right) => {
      const leftScore = this.getMissionScore(left, categoryId);
      const rightScore = this.getMissionScore(right, categoryId);

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      if (left.sortPriority !== right.sortPriority) {
        return left.sortPriority - right.sortPriority;
      }

      return left.title.localeCompare(right.title, 'it');
    });
  }

  private getMissionScore(mission: MissionBundle, categoryId: string | null): number {
    return (
      (categoryId && mission.highlightForCategoryIds.includes(categoryId) ? 40 : 0) +
      (this.isSaved(mission) ? 20 : 0) +
      (!this.isCompleted(mission) ? 10 : 0) +
      (mission.isSequential ? 5 : 0)
    );
  }

  private getSuggestedScore(mission: MissionBundle, categoryId: string | null): number {
    const isPersonalityMatch = !!categoryId && mission.highlightForCategoryIds.includes(categoryId);
    const isGenericAnywhere = mission.locationLabel.toLowerCase() === 'ovunque';
    const isShort = mission.durationMin > 0 && mission.durationMin <= 15;
    const isStandalone = mission.isStandalone;
    const isSaved = this.isSaved(mission);
    const isInProgress = this.isInProgress(mission);

    return (
      (isPersonalityMatch ? 60 : 0) +
      (mission.filterValues.place === 'ovunque' || isGenericAnywhere ? 35 : 0) +
      (isShort ? 30 : Math.max(0, 20 - mission.durationMin)) +
      (isStandalone ? 20 : 0) +
      (!mission.isSequential ? 12 : 0) +
      (isSaved ? 8 : 0) +
      (isInProgress ? 6 : 0) +
      Math.max(0, 8 - mission.difficulty) -
      mission.sortPriority / 100
    );
  }

  private isVisibleForCategory(mission: MissionBundle, categoryId: string | null): boolean {
    if (!categoryId) {
      return mission.highlightForCategoryIds.length === 0;
    }

    return mission.availableForCategoryIds.includes(categoryId);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private matchesFilterValue(mission: MissionBundle, key: keyof MissionFilterState, value: string): boolean {
    if (key === 'search') {
      return true;
    }

    return mission.filterValues[key] === value;
  }
}
