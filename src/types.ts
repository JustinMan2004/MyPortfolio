export type MoodType = 
  | 'Geweldig'
  | 'Blij'
  | 'Tevreden'
  | 'Neutraal'
  | 'Moe'
  | 'Verdrietig'
  | 'Gestrest';

export interface MoodOption {
  label: MoodType;
  emoji: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  q1ActivitiesOrLearned: string; // Wat heb je vandaag gedaan of geleerd?
  q2WentWell: string;            // Wat ging er vandaag goed?
  q3WentLessWell: string;        // Wat ging er vandaag minder goed?
  q4Remember: string;            // Wat wil je onthouden van vandaag?
  createdAt: string;
  isFavorite?: boolean;          // Belangrijke notities markeren met een ster
  photoUrl?: string;             // Eventuele fotoverwijzing / foto URL
  // Optionele velden voor backwards compatibility met eerder opgeslagen notities
  q1Activities?: string;
  q2Feelings?: string;
  q3WentWell?: string;
}
