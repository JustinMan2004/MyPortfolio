/**
 * PROFIEL — jouw persoonlijke gegevens en teksten voor "Home" en "Over mij".
 *
 * Tip: tekst tussen [vierkante haken] wordt op de site als placeholder
 * (gele markering) getoond, zodat je ziet wat je nog moet invullen.
 */
import type { Profile } from './types';

export const profile: Profile = {
  name: 'Justin Man',
  age: 22,
  study: 'Commerciële Economie',
  school: 'HAN',
  city: 'Arnhem',
  residence: 'Rhenen',
  minor: 'Futureproof met AI',

  intro:
    'Dit is mijn bewijsportfolio voor de minor Futureproof met AI. Per sprint laat ik zien wat ik heb onderzocht, gemaakt en geleerd, welke AI-tools ik heb gebruikt en met welk bewijs ik de vijf leeruitkomsten aantoon.',

  // Zet je foto in public/images/ en vul hier het pad in, bijv. 'images/profiel.jpg'.
  // Leeg laten = er worden initialen getoond.
  photo: '',

  interests: [
    'Ondernemen',
    'AI en technologie',
    'Sport en voetbal',
    'Reizen en nieuwe culturen',
    'Investeren',
    'E-commerce',
  ],

  about: [
    'Mijn naam is Justin Man, ik ben 22 jaar oud en studeer Commerciële Economie aan de HAN in Arnhem. Ik woon in Rhenen en ben iemand die graag nieuwe dingen ontdekt en uitprobeert.',
    'Ik ben geïnteresseerd in ondernemen, AI en technologie en vind het interessant om kansen te herkennen en ideeën om te zetten in iets concreets.',
    'In mijn vrije tijd ben ik veel bezig met sport en voetbal en houd ik van reizen en het ontdekken van nieuwe landen en culturen.',
    'Daarnaast interesseren onderwerpen als investeren, e-commerce en nieuwe ontwikkelingen binnen technologie mij.',
  ],

  whyMinor: [
    'Ik heb voor de minor Futureproof met AI gekozen vanwege de vrijheid en creativiteit die de minor biedt. Ik kende de basis van AI al en gebruikte verschillende AI-tools, maar ik wil ontdekken wat er nog meer mogelijk is en hoe ik AI slimmer en praktischer kan inzetten.',
    'Vooral de combinatie van zelf onderzoeken, experimenteren en daadwerkelijk dingen maken spreekt mij aan. Zo wil ik mijn kennis verbreden en ontdekken hoe ik AI later kan toepassen binnen mijn werk en eigen ideeën.',
  ],

  links: [
    { label: 'GitHub', url: 'https://github.com/JustinMan2004' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/...' },
  ],
};
