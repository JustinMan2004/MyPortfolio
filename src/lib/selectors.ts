import { LEARNING_OUTCOMES, LU_CODES, TOTAL_REQUIRED } from './constants';
import type { Evidence, LuCode, PortfolioData, Story } from './types';

export const sprintLabel = (n: number) => `Sprint ${n}`;

export const storyCode = (data: PortfolioData, story: Story) => {
  const sameType = data.stories.filter((s) => s.sprint === story.sprint && s.type === story.type);
  const index = sameType.findIndex((s) => s.id === story.id) + 1;
  return `${story.type}${story.sprint}.${index}`;
};

export const evidenceForStory = (data: PortfolioData, storyId: string) =>
  data.evidence.filter((e) => e.storyIds.includes(storyId));

export const evidenceForLu = (data: PortfolioData, code: LuCode) =>
  data.evidence.filter((e) => e.outcomes.includes(code));

export const storiesForLu = (data: PortfolioData, code: LuCode) =>
  data.stories.filter((s) => s.outcomes.includes(code));

export const storiesById = (data: PortfolioData, ids: string[]) =>
  ids.map((id) => data.stories.find((s) => s.id === id)).filter((s): s is Story => !!s);

/** Leeruitkomsten die in een sprint zichtbaar worden via stories, bewijs of een voldoende zelfevaluatie. */
export const outcomesInSprint = (data: PortfolioData, n: number): LuCode[] => {
  const set = new Set<LuCode>();
  data.stories.filter((s) => s.sprint === n).forEach((s) => s.outcomes.forEach((o) => set.add(o)));
  data.evidence.filter((e) => e.sprint === n).forEach((e) => e.outcomes.forEach((o) => set.add(o)));
  const sprint = data.sprints.find((s) => s.number === n);
  if (sprint) LU_CODES.forEach((c) => sprint.selfEvaluation[c]?.level === 'V' && set.add(c));
  return LU_CODES.filter((c) => set.has(c));
};

/** Aantal sprints waarin een leeruitkomst als voldoende (V) is beoordeeld — gelijk aan het logboek-dashboard. */
export const achievedCount = (data: PortfolioData, code: LuCode) =>
  data.sprints.filter((s) => s.selfEvaluation[code]?.level === 'V').length;

export const achievedPerLu = (data: PortfolioData) =>
  LEARNING_OUTCOMES.map((lu) => ({ ...lu, achieved: achievedCount(data, lu.code) }));

export const totalAchieved = (data: PortfolioData) =>
  achievedPerLu(data).reduce((sum, lu) => sum + lu.achieved, 0);

export const totalProgress = (data: PortfolioData) => Math.min(totalAchieved(data), TOTAL_REQUIRED);

export const hasContent = (value: string | undefined | null) => !!value && value.trim().length > 0;

export const evidenceHasSource = (e: Evidence) => hasContent(e.url) || (e.type === 'tekst' && hasContent(e.text));

export const formatDate = (value: string) => {
  if (!hasContent(value)) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const aiToolsInUse = (data: PortfolioData) => {
  const names = new Set<string>();
  data.tools.forEach((t) => names.add(t.name));
  data.evidence.forEach((e) => e.aiTools.forEach((t) => names.add(t)));
  return [...names];
};
