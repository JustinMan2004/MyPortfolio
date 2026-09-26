/**
 * TYPES — de "vorm" van alle content.
 *
 * Deze file hoef je normaal niet aan te passen. Hij zorgt ervoor dat je editor
 * (VS Code) je waarschuwt als je bij het invullen van content iets vergeet of
 * een typefout maakt.
 */

/** Codes van de vijf leeruitkomsten. */
export type LUCode = 'LU1' | 'LU2' | 'LU3' | 'LU4' | 'LU5';

/** US = User Story, RS = Research Story, LS = Learning Story */
export type StoryType = 'US' | 'RS' | 'LS';

export type SprintStatus = 'gepland' | 'bezig' | 'afgerond';

/**
 * Niveau/status bij een leeruitkomst.
 * Pas de labels aan in src/lib/labels.ts als je minor andere termen gebruikt.
 */
export type Level =
  | 'nog-niet-beoordeeld'
  | 'nog-niet-aangetoond'
  | 'in-ontwikkeling'
  | 'op-niveau'
  | 'boven-niveau';

/** Soorten bewijs. Bepaalt het icoon en of de knop "Bekijk" of "Download" wordt. */
export type EvidenceType =
  | 'pdf'
  | 'document'
  | 'excel'
  | 'afbeelding'
  | 'screenshot'
  | 'video'
  | 'github'
  | 'website'
  | 'link'
  | 'tekst'
  | 'presentatie';

export interface Profile {
  name: string;
  age: number;
  study: string;
  school: string;
  city: string;
  residence: string;
  minor: string;
  /** Korte intro op de homepage. */
  intro: string;
  /** Pad naar je profielfoto in /public, bijv. 'images/profiel.jpg'. Leeg = initialen. */
  photo?: string;
  interests: string[];
  /** Alinea's voor de pagina "Over mij". */
  about: string[];
  /** Alinea's voor "Waarom deze minor?". */
  whyMinor: string[];
  links: { label: string; url: string }[];
}

export interface LearningOutcome {
  code: LUCode;
  title: string;
  description: string;
  /** Je huidige totaalniveau voor deze LU (werk je bij na iedere sprint). */
  level: Level;
  /** Je overkoepelende argumentatie: waarom toon je deze LU aan? Eén item = één alinea. */
  argumentation: string[];
}

export interface Story {
  /** Unieke id, bijv. 's1-rs1'. Gebruik je om bewijs aan deze story te koppelen. */
  id: string;
  type: StoryType;
  title: string;
  /** De story zelf, bijv. "Als ... wil ik ... zodat ...". */
  description: string;
  context?: string;
  /** Aanpak / wat heb ik gedaan? Eén item = één stap of alinea. */
  approach: string[];
  /** Resultaat / wat heb ik opgeleverd of geleerd? */
  result: string[];
  acceptanceCriteria: string[];
  qualityCriteria: string[];
  learningOutcomes: LUCode[];
  /** Status van de story zelf. */
  status?: 'gepland' | 'bezig' | 'afgerond';
}

export interface Evidence {
  /** Unieke id, bijv. 's1-b1'. */
  id: string;
  title: string;
  description: string;
  type: EvidenceType;
  /** Id van de story waar dit bewijs bij hoort (optioneel). */
  storyId?: string;
  learningOutcomes: LUCode[];
  /** Datum als 'JJJJ-MM-DD'. Leeg laten mag. */
  date?: string;
  /** Gebruikte AI-tool(s), bijv. ['ChatGPT', 'Perplexity']. */
  aiTools?: string[];
  /**
   * Link of bestand.
   *  - Bestand in /public: 'bewijs/sprint-1/onderzoek.pdf'
   *  - Externe link:       'https://...'
   *  - Leeg laten = bewijs volgt nog (wordt als placeholder getoond).
   */
  url?: string;
  /** Tekstbewijs dat direct op de site getoond wordt (bijv. een prompt of uitleg). */
  text?: string;
  /** Voorbeeldafbeelding op de kaart, bijv. 'bewijs/sprint-1/screenshot.png'. */
  thumbnail?: string;
  /** true = tonen bij "Belangrijk bewijs" op de homepage. */
  featured?: boolean;
}

export interface Feedback {
  date?: string;
  from: string;
  feedback: string;
  action: string;
}

export interface SelfEvaluation {
  lu: LUCode;
  level: Level;
  argumentation: string;
  /** Ids van bewijsstukken die je argumentatie onderbouwen. */
  evidenceIds: string[];
}

export interface Reflection {
  learned: string[];
  keep: string[];
  improve: string[];
}

export interface Sprint {
  number: number;
  title: string;
  status: SprintStatus;
  /** Bijv. '1 sep – 12 sep 2026'. */
  period?: string;
  /** Korte samenvatting (één zin) voor kaarten. */
  summary: string;
  /** Overzicht: alinea's met de introductie van de sprint. */
  overview: string[];
  /** Onderwerpen/tools waar je aan werkte — getoond als labels. */
  topics: string[];
  stories: Story[];
  evidence: Evidence[];
  feedback: Feedback[];
  selfEvaluation: SelfEvaluation[];
  reflection: Reflection;
}
