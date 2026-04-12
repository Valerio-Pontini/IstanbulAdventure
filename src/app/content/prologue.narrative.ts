import { NarrativeScript } from '../models/narrative.models';

const OPENING_LINE = 'Lascia che Istanbul ti raggiunga prima delle risposte';

/** Linear prologue beats from legacy story slides (single scene for one progress thread). */
export function buildPrologueScript(storySlides: string[]): NarrativeScript {
  const lines = [OPENING_LINE, ...storySlides];
  return {
    id: 'prologue',
    scenes: [
      {
        id: 'prologue-main',
        backgroundTone: 'default',
        beats: lines.map((text, index) => ({
          id: `prologue-${index}`,
          kind: 'dialogue' as const,
          role: 'narrator' as const,
          speaker: 'Prologo',
          text
        }))
      }
    ]
  };
}
