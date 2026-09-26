import { MoodOption, DiaryEntry } from './types';

export const MOOD_OPTIONS: MoodOption[] = [
  { label: 'Geweldig', emoji: '🌟' },
  { label: 'Blij', emoji: '😊' },
  { label: 'Tevreden', emoji: '🙂' },
  { label: 'Neutraal', emoji: '😐' },
  { label: 'Moe', emoji: '🥱' },
  { label: 'Verdrietig', emoji: '😔' },
  { label: 'Gestrest', emoji: '😣' },
];

export const INITIAL_ENTRIES: DiaryEntry[] = [
  {
    id: 'sample-1',
    date: '2026-09-08',
    mood: 'Geweldig',
    q1ActivitiesOrLearned: 'Vandaag een presentatie gegeven over digitale innovatie en geleerd hoe belangrijk rust en een goede voorbereiding zijn.',
    q2WentWell: 'De interactie met de groep verliep heel natuurlijk en ik kreeg veel enthousiaste reacties.',
    q3WentLessWell: 'Ik was van tevoren een beetje zenuwachtig en had wat sneller moeten lunchen.',
    q4Remember: 'Vertrouw op je eigen voorbereiding en neem de tijd om rustig te ademen.',
    createdAt: '2026-09-08T08:30:00.000Z',
    isFavorite: true,
  },
  {
    id: 'sample-2',
    date: '2026-09-07',
    mood: 'Tevreden',
    q1ActivitiesOrLearned: 'Gewerkt aan een nieuw projectplan en geleerd om prioriteiten duidelijker te stellen.',
    q2WentWell: 'Lekker gewandeld in het bos tijdens de pauze en mijn belangrijkste taak voor 15:00 uur afgerond.',
    q3WentLessWell: 'Aan het einde van de middag te lang doorgewerkt waardoor ik wat moe werd.',
    q4Remember: 'Regelmatige pauzes zorgen voor meer focus en rust in je hoofd.',
    createdAt: '2026-09-07T18:45:00.000Z',
    isFavorite: false,
    photoUrl: 'boswandeling-lunch.jpg',
  },
  {
    id: 'sample-3',
    date: '2026-09-06',
    mood: 'Blij',
    q1ActivitiesOrLearned: 'Afgesproken met vrienden in het park en een heerlijk nieuw recept voor vegetarische lasagne uitgeprobeerd.',
    q2WentWell: 'Veel gelachen en echt quality time gehad zonder constant op mijn telefoon te kijken.',
    q3WentLessWell: 'Het koken duurde iets langer dan verwacht omdat de oven voorverwarmen werd vergeten.',
    q4Remember: 'Samen eten en ontspannen met vrienden geeft de meeste energie.',
    createdAt: '2026-09-06T20:15:00.000Z',
    isFavorite: true,
    photoUrl: 'park-vrienden-lasagne.jpg',
  }
];
