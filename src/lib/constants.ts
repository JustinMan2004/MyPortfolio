import type { EvidenceType, LuCode, LuLevel, SprintStatus, StoryType } from './types';

export interface LearningOutcomeDef {
  code: LuCode;
  short: string;
  title: string;
  description: string;
  required: number;
}

/** De vijf leeruitkomsten van de minor Futureproof met AI, met het minimum aantal voldoendes voor "Op niveau". */
export const LEARNING_OUTCOMES: LearningOutcomeDef[] = [
  {
    code: 'LU1',
    short: 'Impact',
    title: 'AI-impact op de beroepspraktijk analyseren en evalueren',
    description:
      'Je kunt zelfstandig onderzoek doen naar de impact van AI in jouw toekomstig beroep en vaststellen welke nieuwe AI en digitale vaardigheden daarvoor nodig zijn.',
    required: 2,
  },
  {
    code: 'LU2',
    short: 'Oplossing',
    title: 'Praktijkgerichte AI-oplossing ontwerpen, realiseren en presenteren',
    description:
      'Je kunt zelfstandig een AI-oplossing ontwerpen, realiseren en presenteren die een specifieke beroepspraktijk radicaal transformeert (verandert).',
    required: 4,
  },
  {
    code: 'LU3',
    short: 'Ethiek',
    title: 'Ethiek en verantwoordelijk AI-gebruik beoordelen',
    description:
      'Je kunt zelfstandig de ethische vraagstukken en uitdagingen van AI in je vakgebied identificeren en aanbevelingen formuleren voor verantwoord AI-gebruik, rekening houdend met privacy, bias en transparantie.',
    required: 2,
  },
  {
    code: 'LU4',
    short: 'Tools',
    title: 'AI-tools en technieken gebruiken',
    description:
      'Je kunt zelfstandig verschillende AI-tools en platforms toepassen (zoals machine learning-technieken, chatbots, agents en prompts) en deze gebruiken om specifieke taken binnen je vakgebied op te lossen.',
    required: 4,
  },
  {
    code: 'LU5',
    short: 'Zelfsturing',
    title: 'Zelfstandig en zelfsturend werken',
    description:
      'Je kunt een eigen leerroute vaststellen en uitvoeren waarbij je zelfstandig je leervragen stelt, relevante bronnen en tools selecteert, je eigen voortgang monitort en kritisch reflecteert op je leerproces.',
    required: 6,
  },
];

export const LU_CODES: LuCode[] = LEARNING_OUTCOMES.map((lu) => lu.code);
/** Voor "Op niveau" zijn minimaal 24 voldoende beoordelingen nodig (naast het minimum per LU). */
export const TOTAL_REQUIRED = 24;
export const SPRINT_COUNT = 8;

export const luDef = (code: LuCode) => LEARNING_OUTCOMES.find((lu) => lu.code === code)!;

export const SPRINT_STATUS: Record<SprintStatus, { label: string; className: string; dot: string }> = {
  'niet-gestart': {
    label: 'Nog niet gestart',
    className: 'bg-stone-100 text-stone-600 ring-stone-200',
    dot: 'bg-stone-400',
  },
  bezig: {
    label: 'Bezig',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
    dot: 'bg-amber-500',
  },
  voltooid: {
    label: 'Voltooid',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-600',
  },
};

export const SPRINT_STATUS_ORDER: SprintStatus[] = ['niet-gestart', 'bezig', 'voltooid'];

export const LU_LEVEL: Record<LuLevel, { label: string; className: string }> = {
  '-': { label: 'Niet beoordeeld', className: 'bg-stone-100 text-stone-600 ring-stone-200' },
  O: { label: 'Onvoldoende', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  V: { label: 'Voldoende', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
};

export const STORY_TYPES: Record<
  StoryType,
  { label: string; long: string; explain: string; className: string; accent: string }
> = {
  RS: {
    label: 'RS',
    long: 'Research Story',
    explain: 'Wat heb ik onderzocht?',
    className: 'bg-sky-50 text-sky-800 ring-sky-200',
    accent: 'border-l-sky-600',
  },
  US: {
    label: 'US',
    long: 'User Story',
    explain: 'Wat heb ik gemaakt?',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    accent: 'border-l-emerald-600',
  },
  LS: {
    label: 'LS',
    long: 'Learning Story',
    explain: 'Wat heb ik geleerd?',
    className: 'bg-violet-50 text-violet-800 ring-violet-200',
    accent: 'border-l-violet-600',
  },
};

export const STORY_TYPE_ORDER: StoryType[] = ['RS', 'US', 'LS'];

export const EVIDENCE_TYPES: Record<EvidenceType, { label: string; action: string }> = {
  pdf: { label: 'PDF', action: 'Bekijk bewijs' },
  document: { label: 'Word / document', action: 'Download bestand' },
  excel: { label: 'Excel', action: 'Download bestand' },
  powerpoint: { label: 'PowerPoint', action: 'Download bestand' },
  afbeelding: { label: 'Afbeelding', action: 'Bekijk afbeelding' },
  screenshot: { label: 'Screenshot', action: 'Bekijk screenshot' },
  video: { label: 'Video', action: 'Bekijk video' },
  website: { label: 'Website', action: 'Bekijk website' },
  onedrive: { label: 'OneDrive-link', action: 'Open in OneDrive' },
  url: { label: 'Externe link', action: 'Open link' },
  bestand: { label: 'Ander bestand', action: 'Download bestand' },
  tekst: { label: 'Tekst', action: 'Lees tekst' },
};

export const EVIDENCE_TYPE_ORDER = Object.keys(EVIDENCE_TYPES) as EvidenceType[];
