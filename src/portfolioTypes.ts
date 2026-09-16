export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetSprint: string;
  category: 'Technisch' | 'Design & UX' | 'Ethiek & Impact' | 'Methodologie';
}

export interface LearningOutcome {
  id: number;
  code: string;
  title: string;
  officialDescription: string;
  status: 'In ontwikkeling' | 'Aangetoond' | 'Bewezen';
  progressPercentage: number;
  linkedEvidenceCount: number;
  criteria: string[];
  requiredMinPass?: number;
}

export type StoryType = 'Research Story' | 'User Story' | 'Learning Story';

export interface StoryItem {
  id: string;
  sprintNumber: number;
  type: StoryType;
  title: string;
  context: string;
  approachOrUserStory: string;
  outcomeOrConclusion: string;
  tags: string[];
  date: string;
  linkedOutcomeIds: number[];
  acceptanceCriteria?: string[];
  qualityCriteria?: string[];
  status?: 'Gepland' | 'In uitvoering' | 'Afgerond';
}

export interface ProjectSolution {
  id: string;
  sprintNumber: number;
  title: string;
  problemStatement: string;
  aiSolution: string;
  myRole: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: string[];
  imageUrl?: string;
  highlights: string[];
}

export interface AIToolItem {
  id: string;
  name: string;
  category: 'LLM & API' | 'AI Coding & Agents' | 'Design & Prompts' | 'Data & ML';
  description: string;
  howApplied: string;
  usedInSprints: number[];
  promptOrCodeSnippet?: string;
  iconName?: string;
}

export interface FeedbackReflectionItem {
  id: string;
  sprintNumber: number;
  source: 'Docent' | 'Peer / Student' | 'Expert / Opdrachtgever';
  sourcePerson: string;
  receivedFeedback: string;
  reflectionWentWell: string;
  reflectionToImprove: string;
  reflectionAction: string;
  evidenceItems: {
    title: string;
    type: 'Code' | 'Document' | 'Screenshot' | 'Testresultaat';
    url?: string;
    description: string;
  }[];
}

export interface SprintData {
  number: number;
  title: string;
  theme: string;
  period: string;
  summary: string;
  focusAreas: string[];
  status: 'Afgerond' | 'In uitvoering' | 'Gepland';
}

export type WorkItemType =
  | 'Werkend Prototype'
  | 'Code Repository'
  | 'Onderzoeksverslag'
  | 'Show & Tell Presentatie'
  | 'Figma / Design'
  | 'Prompt Systeem'
  | 'Overig'
  | 'PDF'
  | 'Downloadbaar document'
  | 'Excel-bestand'
  | 'Word-bestand'
  | 'Afbeelding / screenshot'
  | 'Video'
  | 'GitHub-link'
  | 'Externe website'
  | 'Portfoliolink'
  | 'Andere URL';

export interface WorkItem {
  id: string;
  title: string;
  sprintNumber: number; // 1 t/m 8
  type: WorkItemType;
  whatMade: string; // Wat heb je gemaakt?
  howMadeOrTech?: string; // Waarmee / hoe gemaakt (tools/technieken)
  learningOutcomeCodes: string[]; // e.g. ['LU-1', 'LU-2', 'LU-4'] -> gekoppeld aan 1 of meer leeruitkomsten
  learningOutcomeCode?: string; // voor backward compatibility met oudere opgeslagen data
  url?: string;
  githubUrl?: string;
  description?: string; // alias/fallback voor whatMade
  dateAdded: string;
  status: 'Opgeleverd' | 'In ontwikkeling' | 'Gepresenteerd';
}

export type EvidenceLink = WorkItem;

export interface StudentProfile {
  name: string;
  title: string;
  institution: string;
  program: string;
  minor: string;
  academicYear: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  location: string;
  avatarUrl?: string;
  personalStory: {
    whoAmI: string;
    passionsAndJoy: string; // waar ik blij van word
    whyThisMinor: string;
    photoUrl?: string;
    funFacts: string[];
  };
  learningGoals: LearningGoal[];
}
