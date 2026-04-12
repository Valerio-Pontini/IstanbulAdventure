import { Injectable, computed, signal } from '@angular/core';
import { isChoiceBeat, isDialogueBeat, NarrativeBeat, NarrativeScript } from '../models/narrative.models';

@Injectable({ providedIn: 'root' })
export class SceneRuntimeService {
  private readonly scriptSignal = signal<NarrativeScript | null>(null);
  private readonly sceneIndexSignal = signal(0);
  private readonly beatIndexSignal = signal(0);

  readonly script = this.scriptSignal.asReadonly();
  readonly sceneIndex = this.sceneIndexSignal.asReadonly();
  readonly beatIndex = this.beatIndexSignal.asReadonly();

  readonly currentScene = computed(() => {
    const script = this.scriptSignal();
    const si = this.sceneIndexSignal();
    return script?.scenes[si] ?? null;
  });

  readonly currentBeat = computed<NarrativeBeat | null>(() => {
    const scene = this.currentScene();
    const bi = this.beatIndexSignal();
    return scene?.beats[bi] ?? null;
  });

  readonly totalBeats = computed(() => {
    const script = this.scriptSignal();
    if (!script) {
      return 0;
    }
    return script.scenes.reduce((sum, scene) => sum + scene.beats.length, 0);
  });

  readonly flatBeatIndex = computed(() => {
    const script = this.scriptSignal();
    if (!script) {
      return 0;
    }
    let si = this.sceneIndexSignal();
    let bi = this.beatIndexSignal();
    let flat = 0;
    for (let i = 0; i < si; i += 1) {
      flat += script.scenes[i]?.beats.length ?? 0;
    }
    flat += bi;
    return flat;
  });

  readonly isAtStart = computed(() => this.sceneIndexSignal() === 0 && this.beatIndexSignal() === 0);

  readonly isAtEnd = computed(() => {
    const script = this.scriptSignal();
    if (!script || !script.scenes.length) {
      return true;
    }
    const si = this.sceneIndexSignal();
    const bi = this.beatIndexSignal();
    const lastScene = script.scenes[script.scenes.length - 1];
    const lastBeat = lastScene ? lastScene.beats.length - 1 : -1;
    return si === script.scenes.length - 1 && bi >= lastBeat && lastBeat >= 0;
  });

  readonly progressLabel = computed(() => {
    const total = this.totalBeats();
    if (total < 1) {
      return '';
    }
    return `${this.flatBeatIndex() + 1} / ${total}`;
  });

  readonly progressPercent = computed(() => {
    const total = this.totalBeats();
    if (total < 1) {
      return 0;
    }
    return Math.min(100, ((this.flatBeatIndex() + 1) / total) * 100);
  });

  loadScript(script: NarrativeScript | null): void {
    this.scriptSignal.set(script);
    this.sceneIndexSignal.set(0);
    this.beatIndexSignal.set(0);
  }

  /** Move to a linear index across all beats (0-based). Clamps to last beat. */
  restoreToFlatIndex(targetFlat: number): void {
    const script = this.scriptSignal();
    if (!script?.scenes.length) {
      return;
    }

    let remaining = Math.max(0, targetFlat);
    for (let si = 0; si < script.scenes.length; si += 1) {
      const scene = script.scenes[si];
      const len = scene.beats.length;
      if (remaining < len) {
        this.sceneIndexSignal.set(si);
        this.beatIndexSignal.set(remaining);
        return;
      }
      remaining -= len;
    }

    const lastSi = script.scenes.length - 1;
    const lastScene = script.scenes[lastSi];
    this.sceneIndexSignal.set(Math.max(0, lastSi));
    this.beatIndexSignal.set(lastScene.beats.length ? lastScene.beats.length - 1 : 0);
  }

  /** Jump without resetting beat (e.g. after rebuilding mission script). */
  restorePosition(sceneIndex: number, beatIndex: number): void {
    const script = this.scriptSignal();
    if (!script) {
      return;
    }
    const safeScene = Math.max(0, Math.min(sceneIndex, script.scenes.length - 1));
    const scene = script.scenes[safeScene];
    const maxBeat = scene ? scene.beats.length - 1 : 0;
    const safeBeat = Math.max(0, Math.min(beatIndex, maxBeat));
    this.sceneIndexSignal.set(safeScene);
    this.beatIndexSignal.set(safeBeat);
  }

  next(): boolean {
    const script = this.scriptSignal();
    if (!script) {
      return false;
    }
    let si = this.sceneIndexSignal();
    let bi = this.beatIndexSignal();
    const scene = script.scenes[si];
    if (!scene) {
      return false;
    }
    if (bi + 1 < scene.beats.length) {
      this.beatIndexSignal.set(bi + 1);
      return true;
    }
    if (si + 1 < script.scenes.length) {
      this.sceneIndexSignal.set(si + 1);
      this.beatIndexSignal.set(0);
      return true;
    }
    return false;
  }

  previous(): boolean {
    const script = this.scriptSignal();
    if (!script) {
      return false;
    }
    let si = this.sceneIndexSignal();
    let bi = this.beatIndexSignal();
    if (bi > 0) {
      this.beatIndexSignal.set(bi - 1);
      return true;
    }
    if (si > 0) {
      const prevScene = script.scenes[si - 1];
      const lastBeat = prevScene ? prevScene.beats.length - 1 : 0;
      this.sceneIndexSignal.set(si - 1);
      this.beatIndexSignal.set(Math.max(0, lastBeat));
      return true;
    }
    return false;
  }

  /** Advance from a choice beat (linear: same as next). */
  choose(_optionId: string): boolean {
    const beat = this.currentBeat();
    if (!isChoiceBeat(beat)) {
      return false;
    }
    return this.next();
  }

  currentDialogueText(): string {
    const beat = this.currentBeat();
    return isDialogueBeat(beat) || isChoiceBeat(beat) ? beat.text : '';
  }

  currentDialogueSpeaker(): string | undefined {
    const beat = this.currentBeat();
    if (isDialogueBeat(beat) || isChoiceBeat(beat)) {
      return beat.speaker;
    }
    return undefined;
  }

  currentDialogueRole() {
    const beat = this.currentBeat();
    if (isDialogueBeat(beat)) {
      return beat.role;
    }
    if (isChoiceBeat(beat)) {
      return beat.role ?? 'narrator';
    }
    return 'narrator' as const;
  }
}
