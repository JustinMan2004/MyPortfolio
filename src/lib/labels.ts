import type { EvidenceType, Level, SprintStatus, StoryType } from '../content/types';

export const STORY_TYPE_LABEL: Record<StoryType, string> = {
  US: 'User Story',
  RS: 'Research Story',
  LS: 'Learning Story',
};

export const SPRINT_STATUS_LABEL: Record<SprintStatus, string> = {
  gepland: 'Gepland',
  bezig: 'Bezig',
  afgerond: 'Afgerond',
};

/** Labels en volgorde van de niveaus. `step` bepaalt hoeveel blokjes gevuld zijn (0–4). */
export const LEVELS: Record<Level, { label: string; step: number }> = {
  'nog-niet-beoordeeld': { label: 'Nog niet beoordeeld', step: 0 },
  'nog-niet-aangetoond': { label: 'Nog niet aangetoond', step: 1 },
  'in-ontwikkeling': { label: 'In ontwikkeling', step: 2 },
  'op-niveau': { label: 'Op niveau', step: 3 },
  'boven-niveau': { label: 'Boven niveau', step: 4 },
};

export const EVIDENCE_TYPE_LABEL: Record<EvidenceType, string> = {
  pdf: 'PDF',
  document: 'Document',
  excel: 'Excel',
  afbeelding: 'Afbeelding',
  screenshot: 'Screenshot',
  video: 'Video',
  github: 'GitHub',
  website: 'Website',
  link: 'Externe link',
  tekst: 'Tekst',
  presentatie: 'Presentatie',
};
