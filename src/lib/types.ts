export type LuCode = 'LU1' | 'LU2' | 'LU3' | 'LU4' | 'LU5';

export type SprintStatus = 'niet-gestart' | 'bezig' | 'voltooid';

/** Niveau zoals in het logboek: '-' = niet beoordeeld, 'O' = onvoldoende, 'V' = voldoende */
export type LuLevel = '-' | 'O' | 'V';

export type StoryType = 'US' | 'RS' | 'LS';

export type EvidenceType =
  | 'pdf'
  | 'document'
  | 'excel'
  | 'powerpoint'
  | 'afbeelding'
  | 'screenshot'
  | 'video'
  | 'website'
  | 'onedrive'
  | 'url'
  | 'bestand'
  | 'tekst';

export interface FeedbackItem {
  id: string;
  date: string;
  from: string;
  feedback: string;
  action: string;
}

export interface SelfEvaluation {
  level: LuLevel;
  argument: string;
}

export interface Reflection {
  date: string;
  learned: string;
  keep: string;
  change: string;
}

export interface Sprint {
  number: number;
  title: string;
  period: string;
  status: SprintStatus;
  summary: string;
  activities: string[];
  feedback: FeedbackItem[];
  selfEvaluation: Record<LuCode, SelfEvaluation>;
  reflection: Reflection;
}

export interface Story {
  id: string;
  sprint: number;
  type: StoryType;
  title: string;
  description: string;
  context: string;
  approach: string;
  result: string;
  acceptanceCriteria: string[];
  qualityCriteria: string[];
  outcomes: LuCode[];
}

export interface Evidence {
  id: string;
  sprint: number;
  title: string;
  description: string;
  date: string;
  type: EvidenceType;
  aiTools: string[];
  storyIds: string[];
  outcomes: LuCode[];
  /** Externe link (OneDrive, website, URL) of pad naar een bestand in /public, bv. /bewijs/sprint-1/verslag.pdf */
  url: string;
  /** Alleen voor type 'tekst' */
  text?: string;
}

export interface Tool {
  id: string;
  name: string;
  category: 'AI-tool' | 'Digitale tool';
  purpose: string;
  sprints: number[];
  url?: string;
}

export interface Profile {
  name: string;
  initials: string;
  study: string;
  profession: string;
  minor: string;
  schoolYear: string;
  intro: string;
  whoAmI: string;
  whyMinor: string;
  ambitions: string;
  photoUrl: string;
  contact: string;
}

export interface PortfolioData {
  profile: Profile;
  sprints: Sprint[];
  stories: Story[];
  evidence: Evidence[];
  tools: Tool[];
}
