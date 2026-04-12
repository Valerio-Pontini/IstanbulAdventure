import { MissionBundle, MissionObjective } from '../models/app.models';
import { GameScene, NarrativeBeat, NarrativeScript } from '../models/narrative.models';

function dialogue(id: string, text: string, speaker?: string): NarrativeBeat {
  return {
    id,
    kind: 'dialogue',
    role: 'narrator',
    speaker: speaker ?? 'Missione',
    text
  };
}

function splitContextBeats(prefix: string, context: string): NarrativeBeat[] {
  const parts = String(context || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) {
    return [];
  }
  return parts.map((text, i) => dialogue(`${prefix}-ctx-${i}`, text, 'Contesto'));
}

/** Builds a sequential narrative script for the mission detail scene runner. */
export function buildMissionNarrativeScript(mission: MissionBundle, revealedObjectiveCount: number): NarrativeScript {
  const scenes: GameScene[] = [];

  const briefingBeats: NarrativeBeat[] = [dialogue('brief-title', mission.title, 'Briefing')];
  if (mission.description?.trim()) {
    briefingBeats.push(dialogue('brief-desc', mission.description.trim()));
  }
  briefingBeats.push(...splitContextBeats('brief', mission.context));

  scenes.push({
    id: 'mission-briefing',
    backgroundTone: 'atlas',
    beats: briefingBeats.length ? briefingBeats : [dialogue('brief-empty', mission.title)]
  });

  const objectives = mission.objectives;
  const limit = mission.isSequential
    ? Math.min(objectives.length, objectives.length ? Math.max(1, revealedObjectiveCount) : 0)
    : objectives.length;

  for (let i = 0; i < limit; i += 1) {
    const objective = objectives[i];
    if (!objective) {
      continue;
    }
    scenes.push(objectiveToScene(mission.id, i, objective));
  }

  scenes.push({
    id: 'mission-outro',
    backgroundTone: 'atlas',
    beats: [
      dialogue(
        'outro',
        'Quando hai completato gli obiettivi, segna il passaggio qui sotto. Istanbul resta aperta al tuo ritorno.',
        'Chiusura'
      )
    ]
  });

  return {
    id: `mission-${mission.id}`,
    scenes
  };
}

function objectiveToScene(missionId: string, index: number, objective: MissionObjective): GameScene {
  const beats: NarrativeBeat[] = [
    dialogue(`obj-${index}-title`, `Obiettivo ${index + 1}: ${objective.title}`, 'Passaggio'),
    dialogue(`obj-${index}-body`, objective.description, 'Istruzione')
  ];
  if (objective.discovery?.trim()) {
    beats.push(dialogue(`obj-${index}-discovery`, objective.discovery.trim(), 'Indizio'));
  }
  for (let c = 0; c < objective.validationCriteria.length; c += 1) {
    const line = objective.validationCriteria[c]?.trim();
    if (line) {
      beats.push(dialogue(`obj-${index}-crit-${c}`, line, 'Criterio'));
    }
  }
  return {
    id: `${missionId}-objective-${index}`,
    backgroundTone: 'atlas',
    beats
  };
}
