/**
 * Hulpfuncties die de centrale content aan elkaar koppelen.
 * Hier hoef je als contentbeheerder niets aan te veranderen.
 */
import { learningOutcomes } from '../content/learningOutcomes';
import { sprints } from '../content/sprints';
import type { Evidence, LUCode, Sprint, Story } from '../content/types';

export interface EvidenceWithSprint extends Evidence {
  sprint: number;
}

export const allEvidence: EvidenceWithSprint[] = sprints.flatMap((s) =>
  s.evidence.map((e) => ({ ...e, sprint: s.number })),
);

export const allStories: (Story & { sprint: number })[] = sprints.flatMap((s) =>
  s.stories.map((st) => ({ ...st, sprint: s.number })),
);

export const getSprint = (n: number): Sprint | undefined => sprints.find((s) => s.number === n);

export const getStory = (id?: string) => (id ? allStories.find((s) => s.id === id) : undefined);

export const getEvidence = (id: string) => allEvidence.find((e) => e.id === id);

export const getLU = (code: string) => learningOutcomes.find((lu) => lu.code === code.toUpperCase());

export const evidenceForLU = (code: LUCode) => allEvidence.filter((e) => e.learningOutcomes.includes(code));

export const evidenceForStory = (id: string) => allEvidence.filter((e) => e.storyId === id);

/** Sprints waarin aan een LU is gewerkt (via stories, bewijs of een ingevulde zelfevaluatie). */
export const sprintsForLU = (code: LUCode): number[] =>
  sprints
    .filter(
      (s) =>
        s.stories.some((st) => st.learningOutcomes.includes(code)) ||
        s.evidence.some((e) => e.learningOutcomes.includes(code)),
    )
    .map((s) => s.number);

/** Alle LU's die in een sprint voorkomen, met het aantal bewijsstukken. */
export const lusForSprint = (sprint: Sprint) =>
  learningOutcomes
    .map((lu) => ({
      lu,
      stories: sprint.stories.filter((st) => st.learningOutcomes.includes(lu.code)),
      evidence: sprint.evidence.filter((e) => e.learningOutcomes.includes(lu.code)),
    }))
    .filter((x) => x.stories.length > 0 || x.evidence.length > 0);

/** Een tekst tussen [vierkante haken] geldt als placeholder. */
export const isPlaceholder = (text?: string) => !text || /^\s*\[.*\]\s*$/s.test(text);

/** Bewijs met een echte link of een tekst telt als "aanwezig". */
export const hasEvidenceContent = (e: Evidence) => Boolean(e.url || e.text);

/** Zet een pad uit /public om naar een werkende URL (ook bij hosting in een submap). */
export const assetUrl = (path: string) =>
  /^(https?:|mailto:|data:)/.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const formatDate = (date?: string) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
};
