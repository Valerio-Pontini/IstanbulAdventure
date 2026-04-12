export type DialogueRole = 'narrator' | 'player' | 'npc';

export type DialogueBeat = {
  id: string;
  kind: 'dialogue';
  role: DialogueRole;
  speaker?: string;
  text: string;
};

export type ChoiceOption = {
  id: string;
  label: string;
};

export type ChoiceBeat = {
  id: string;
  kind: 'choice';
  role?: DialogueRole;
  speaker?: string;
  text: string;
  options: ChoiceOption[];
};

export type NarrativeBeat = DialogueBeat | ChoiceBeat;

export type GameScene = {
  id: string;
  backgroundTone?: 'default' | 'atlas' | 'reveal';
  beats: NarrativeBeat[];
};

export type NarrativeScript = {
  id: string;
  scenes: GameScene[];
};

export type OverlayRef = {
  id: string;
  title?: string;
  text: string;
  primaryLabel?: string;
};

export function isDialogueBeat(beat: NarrativeBeat | null | undefined): beat is DialogueBeat {
  return beat?.kind === 'dialogue';
}

export function isChoiceBeat(beat: NarrativeBeat | null | undefined): beat is ChoiceBeat {
  return beat?.kind === 'choice';
}
