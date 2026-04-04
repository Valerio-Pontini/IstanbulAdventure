import { Injectable, computed, signal } from '@angular/core';
import { UserMissionState } from '../models/app.models';

const STORAGE_KEYS = {
  homeUnlocked: 'istanbulAdventure.homeUnlocked',
  categoryId: 'istanbulAdventure.categoryId',
  userMissionState: 'istanbulAdventure.userMissionState'
};

@Injectable({ providedIn: 'root' })
export class MissionStateService {
  private readonly userStateSignal = signal<UserMissionState>(this.readUserState());
  private readonly homeUnlockedSignal = signal<boolean>(window.localStorage.getItem(STORAGE_KEYS.homeUnlocked) === 'true');
  private readonly categoryIdSignal = signal<string | null>(window.localStorage.getItem(STORAGE_KEYS.categoryId) || null);

  readonly userState = this.userStateSignal.asReadonly();
  readonly homeUnlocked = this.homeUnlockedSignal.asReadonly();
  readonly categoryId = computed(() => this.categoryIdSignal() || this.userStateSignal().personality || null);

  markHomeUnlocked(categoryId: string | null): void {
    this.homeUnlockedSignal.set(true);
    window.localStorage.setItem(STORAGE_KEYS.homeUnlocked, 'true');
    window.localStorage.setItem(STORAGE_KEYS.categoryId, categoryId ?? '');
    this.categoryIdSignal.set(categoryId);
    this.updateState((state) => ({ ...state, personality: categoryId ?? state.personality }));
  }

  toggleSaved(missionId: string): void {
    this.toggleListValue('savedMissionIds', missionId);
  }

  toggleCompleted(missionId: string): void {
    this.toggleListValue('completedMissionIds', missionId);
  }

  setSavedForMissionIds(missionIds: string[], saved: boolean): void {
    this.setListValues('savedMissionIds', missionIds, saved);
  }

  setCompletedForMissionIds(missionIds: string[], completed: boolean): void {
    this.setListValues('completedMissionIds', missionIds, completed);
  }

  private toggleListValue(key: 'savedMissionIds' | 'completedMissionIds', missionId: string): void {
    this.updateState((state) => {
      const values = new Set(state[key]);
      if (values.has(missionId)) {
        values.delete(missionId);
      } else {
        values.add(missionId);
      }

      return {
        ...state,
        [key]: [...values]
      };
    });
  }

  private setListValues(key: 'savedMissionIds' | 'completedMissionIds', missionIds: string[], enabled: boolean): void {
    this.updateState((state) => {
      const values = new Set(state[key]);

      missionIds.forEach((missionId) => {
        if (enabled) {
          values.add(missionId);
        } else {
          values.delete(missionId);
        }
      });

      return {
        ...state,
        [key]: [...values]
      };
    });
  }

  private updateState(updater: (state: UserMissionState) => UserMissionState): void {
    const nextState = updater(this.userStateSignal());
    this.userStateSignal.set(nextState);
    window.localStorage.setItem(STORAGE_KEYS.userMissionState, JSON.stringify(nextState));
  }

  private readUserState(): UserMissionState {
    const fallback: UserMissionState = {
      completedMissionIds: [],
      savedMissionIds: [],
      hiddenMissionIds: [],
      personality: window.localStorage.getItem(STORAGE_KEYS.categoryId) || undefined
    };

    const rawState = window.localStorage.getItem(STORAGE_KEYS.userMissionState);
    if (!rawState) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(rawState) as Partial<UserMissionState>;
      return {
        completedMissionIds: Array.isArray(parsed.completedMissionIds) ? parsed.completedMissionIds : [],
        savedMissionIds: Array.isArray(parsed.savedMissionIds) ? parsed.savedMissionIds : [],
        hiddenMissionIds: Array.isArray(parsed.hiddenMissionIds) ? parsed.hiddenMissionIds : [],
        personality: parsed.personality || fallback.personality
      };
    } catch {
      return fallback;
    }
  }
}
