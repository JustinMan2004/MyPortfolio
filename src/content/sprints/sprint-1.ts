/**
 * SPRINT 1
 *
 * Alles van Sprint 1 staat in dit ene bestand: overzicht, stories, bewijs,
 * feedback, zelfevaluatie en reflectie.
 *
 * Tekst tussen [vierkante haken] is een placeholder: die wordt op de site geel
 * gemarkeerd, zodat jij (en niemand anders) ziet wat nog ingevuld moet worden.
 *
 * Koppelingen:
 *  - Bewijs aan een story koppelen:  storyId: 's1-rs1'
 *  - Bewijs aan leeruitkomsten:      learningOutcomes: ['LU1', 'LU4']
 *  - Bewijs in de zelfevaluatie:     evidenceIds: ['s1-b1']
 */
import type { Sprint } from '../types';

export const sprint1: Sprint = {
  number: 1,
  title: 'Oriëntatie: AI in mijn beroep en mijn portfolio',
  status: 'bezig', // 'gepland' | 'bezig' | 'afgerond'
  period: '[Invullen: periode, bijv. 1 sep – 19 sep 2026]',
  summary:
    'Onderzoek naar de impact van AI op het beroep accountmanager en naar AI-tools voor klantonderzoek, en het bouwen van dit portfolio met AI.',

  overview: [
    'In Sprint 1 heb ik mij georiënteerd op wat AI betekent voor mijn toekomstige beroepspraktijk. Ik heb onderzoek gedaan naar de impact van AI op het beroep accountmanager en naar AI-tools die ingezet kunnen worden voor klantonderzoek.',
    'Daarnaast heb ik dit portfolio gebouwd met behulp van AI. Daarbij heb ik gewerkt met Google AI Studio, ChatGPT, Gemini, Perplexity, GitHub en Visual Studio Code.',
    '[Invullen: vul aan met je belangrijkste inzicht of resultaat van deze sprint.]',
  ],

  topics: [
    'AI-impact accountmanager',
    'AI voor klantonderzoek',
    'Portfolio bouwen met AI',
    'Google AI Studio',
    'ChatGPT',
    'Gemini',
    'Perplexity',
    'GitHub',
    'Visual Studio Code',
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // STORIES
  // ─────────────────────────────────────────────────────────────────────────
  stories: [
    {
      id: 's1-rs1',
      type: 'RS',
      title: 'Impact van AI op het beroep accountmanager',
      description:
        'Als toekomstig accountmanager wil ik onderzoeken hoe AI mijn beroep verandert, zodat ik weet welke AI- en digitale vaardigheden ik moet ontwikkelen.',
      context:
        '[Invullen: waarom is dit onderzoek relevant? Bijv. welke rol speelt een accountmanager binnen Commerciële Economie en waarom is AI daarbij belangrijk?]',
      approach: [
        '[Invullen: welke onderzoeksvragen heb je gesteld?]',
        '[Invullen: welke bronnen en methoden heb je gebruikt (literatuur, artikelen, interviews, AI-tools zoals Perplexity)?]',
        '[Invullen: hoe heb je de informatie geanalyseerd en gecontroleerd?]',
      ],
      result: [
        '[Invullen: wat zijn je belangrijkste conclusies over de impact van AI op het beroep accountmanager?]',
        '[Invullen: welke nieuwe vaardigheden heb je vastgesteld?]',
      ],
      acceptanceCriteria: [
        '[Invullen: bijv. "Er is een onderzoeksdocument met een duidelijke hoofdvraag en conclusie."]',
      ],
      qualityCriteria: [
        '[Invullen: bijv. "Bronnen zijn actueel, betrouwbaar en correct vermeld."]',
      ],
      learningOutcomes: ['LU1'],
      status: 'bezig',
    },
    {
      id: 's1-rs2',
      type: 'RS',
      title: 'AI-tools voor klantonderzoek',
      description:
        'Als student Commerciële Economie wil ik onderzoeken welke AI-tools geschikt zijn voor klantonderzoek, zodat ik weet hoe ik AI praktisch kan inzetten om klanten beter te begrijpen.',
      context:
        '[Invullen: welk probleem of welke vraag uit de praktijk van klantonderzoek wilde je oplossen?]',
      approach: [
        '[Invullen: welke AI-tools heb je bekeken of getest?]',
        '[Invullen: op basis van welke criteria heb je de tools vergeleken?]',
      ],
      result: [
        '[Invullen: welke tools zijn (niet) geschikt en waarom?]',
        '[Invullen: welk advies of welke conclusie volgt uit je onderzoek?]',
      ],
      acceptanceCriteria: [
        '[Invullen: bijv. "Minimaal X AI-tools zijn vergeleken op vooraf opgestelde criteria."]',
      ],
      qualityCriteria: [
        '[Invullen: bijv. "De vergelijking is onderbouwd met eigen tests en bronnen."]',
      ],
      learningOutcomes: ['LU1', 'LU4'],
      status: 'bezig',
    },
    {
      id: 's1-us1',
      type: 'US',
      title: 'Mijn portfolio bouwen met AI',
      description:
        'Als student van de minor Futureproof met AI wil ik een overzichtelijke portfoliowebsite, zodat docenten binnen enkele klikken kunnen zien wat ik heb gedaan, wat ik heb geleerd en welk bewijs bij welke leeruitkomst hoort.',
      context:
        'Het portfolio is de centrale plek waar ik gedurende de hele minor mijn bewijs verzamel. Het moet makkelijk uit te breiden zijn voor Sprint 2 t/m 8.',
      approach: [
        '[Invullen: hoe ben je begonnen? Bijv. een eerste versie in Google AI Studio.]',
        '[Invullen: hoe heb je de website verder ontwikkeld met GitHub, Visual Studio Code en AI-assistentie?]',
        '[Invullen: welke keuzes heb je gemaakt in structuur en ontwerp, en waarom?]',
      ],
      result: [
        'Een responsive portfoliowebsite met pagina’s voor de 8 sprints, de 5 leeruitkomsten, een bewijsoverzicht en een “Over mij”-pagina.',
        'Alle content staat centraal in databestanden, zodat nieuwe sprints en bewijsstukken toegevoegd kunnen worden zonder de website opnieuw te bouwen.',
        '[Invullen: wat heb je zelf geleerd van het bouwen van dit portfolio?]',
      ],
      acceptanceCriteria: [
        'De website bevat de pagina’s Home, Sprints, Leeruitkomsten, Bewijs en Over mij.',
        'Iedere sprint heeft een eigen pagina met overzicht, stories, bewijs, leeruitkomsten, feedback, zelfevaluatie en reflectie.',
        'Per leeruitkomst zijn alle gekoppelde bewijsstukken uit alle sprints zichtbaar.',
        'Bij ieder bewijsstuk is zichtbaar bij welke story het hoort en welke leeruitkomst het aantoont.',
      ],
      qualityCriteria: [
        'De website is responsive op desktop, laptop, tablet en mobiel.',
        'De vormgeving is rustig en professioneel.',
        'Nieuwe content kan worden toegevoegd zonder componenten aan te passen.',
      ],
      learningOutcomes: ['LU2', 'LU4', 'LU5'],
      status: 'bezig',
    },
    {
      id: 's1-ls1',
      type: 'LS',
      title: 'Werken met AI-tools: Google AI Studio, ChatGPT, Gemini en Perplexity',
      description:
        'Als student wil ik leren hoe ik verschillende AI-tools doelgericht inzet, zodat ik per taak de juiste tool kies en betere resultaten krijg.',
      context:
        '[Invullen: welke tools kende je al en wat wilde je nieuw leren?]',
      approach: [
        '[Invullen: Google AI Studio — waarvoor heb je het gebruikt?]',
        '[Invullen: ChatGPT — waarvoor heb je het gebruikt?]',
        '[Invullen: Gemini — waarvoor heb je het gebruikt?]',
        '[Invullen: Perplexity — waarvoor heb je het gebruikt?]',
      ],
      result: [
        '[Invullen: welke verschillen heb je gemerkt tussen de tools?]',
        '[Invullen: wat heb je geleerd over goed prompten?]',
      ],
      acceptanceCriteria: [
        '[Invullen: bijv. "Per tool is vastgelegd waarvoor ik het heb gebruikt, met een voorbeeld."]',
      ],
      qualityCriteria: [
        '[Invullen: bijv. "Ik onderbouw kritisch wat de sterke en zwakke punten van iedere tool zijn."]',
      ],
      learningOutcomes: ['LU4'],
      status: 'bezig',
    },
    {
      id: 's1-ls2',
      type: 'LS',
      title: 'Werken met GitHub en Visual Studio Code',
      description:
        'Als student wil ik leren werken met GitHub en Visual Studio Code, zodat ik mijn portfolio zelfstandig kan beheren, bijwerken en publiceren.',
      context:
        '[Invullen: welke ervaring had je hier al mee?]',
      approach: [
        '[Invullen: wat heb je gedaan om GitHub en VS Code te leren gebruiken (tutorials, AI-hulp, uitproberen)?]',
      ],
      result: [
        '[Invullen: wat kun je nu wat je eerst niet kon?]',
      ],
      acceptanceCriteria: [
        '[Invullen: bijv. "Mijn portfolio staat in een GitHub-repository en ik kan wijzigingen zelf committen en pushen."]',
      ],
      qualityCriteria: [
        '[Invullen]',
      ],
      learningOutcomes: ['LU4', 'LU5'],
      status: 'bezig',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // BEWIJS
  // ─────────────────────────────────────────────────────────────────────────
  evidence: [
    {
      id: 's1-b1',
      title: 'Onderzoek: impact van AI op het beroep accountmanager',
      description: '[Invullen: korte omschrijving van je onderzoeksdocument.]',
      type: 'pdf',
      storyId: 's1-rs1',
      learningOutcomes: ['LU1'],
      date: '',
      aiTools: [], // bijv. ['Perplexity', 'ChatGPT']
      url: '', // bijv. 'bewijs/sprint-1/onderzoek-ai-accountmanager.pdf'
      featured: true,
    },
    {
      id: 's1-b2',
      title: 'Overzicht: AI-tools voor klantonderzoek',
      description: '[Invullen: korte omschrijving, bijv. een vergelijking van tools op criteria.]',
      type: 'document',
      storyId: 's1-rs2',
      learningOutcomes: ['LU1', 'LU4'],
      date: '',
      aiTools: [],
      url: '',
      featured: true,
    },
    {
      id: 's1-b3',
      title: 'GitHub-repository van dit portfolio',
      description:
        'De broncode van deze portfoliowebsite. In de commitgeschiedenis is te zien hoe het portfolio stap voor stap is ontwikkeld.',
      type: 'github',
      storyId: 's1-us1',
      learningOutcomes: ['LU2', 'LU4', 'LU5'],
      date: '',
      aiTools: ['Google AI Studio'],
      url: 'https://github.com/JustinMan2004/MyPortfolio',
      featured: true,
    },
    {
      id: 's1-b4',
      title: 'Eerste versie van het portfolio in Google AI Studio',
      // Controleer of deze link nog werkt. Zo niet: voeg een screenshot toe en gebruik die als url.
      description: 'De eerste versie van mijn portfolio, gebouwd in Google AI Studio.',
      type: 'website',
      storyId: 's1-us1',
      learningOutcomes: ['LU2', 'LU4'],
      date: '',
      aiTools: ['Google AI Studio'],
      url: 'https://ais-pre-kicwhcuqnw6anl342wcpjj-595862977345.europe-west1.run.app',
    },
    {
      id: 's1-b5',
      title: 'Screenshots van prompts in ChatGPT, Gemini en Perplexity',
      description: '[Invullen: welke prompts laat je zien en wat tonen ze aan?]',
      type: 'screenshot',
      storyId: 's1-ls1',
      learningOutcomes: ['LU4'],
      date: '',
      aiTools: ['ChatGPT', 'Gemini', 'Perplexity'],
      url: '', // bijv. 'bewijs/sprint-1/prompts.png'
    },
    {
      id: 's1-b6',
      title: 'Werken in Visual Studio Code en GitHub',
      description: '[Invullen: bijv. een screenshot van je projectstructuur in VS Code of je commits op GitHub.]',
      type: 'screenshot',
      storyId: 's1-ls2',
      learningOutcomes: ['LU4', 'LU5'],
      date: '',
      aiTools: [],
      url: '',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // FEEDBACK
  // ─────────────────────────────────────────────────────────────────────────
  feedback: [
    {
      date: '',
      from: '[Invullen: naam en rol, bijv. docent of medestudent]',
      feedback: '[Invullen: welke feedback heb je gekregen?]',
      action: '[Invullen: wat heb je ermee gedaan?]',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // ZELFEVALUATIE (LU1 t/m LU5)
  // level: 'nog-niet-beoordeeld' | 'nog-niet-aangetoond' | 'in-ontwikkeling' | 'op-niveau' | 'boven-niveau'
  // ─────────────────────────────────────────────────────────────────────────
  selfEvaluation: [
    {
      lu: 'LU1',
      level: 'nog-niet-beoordeeld',
      argumentation: '[Invullen: waarom sta je op dit niveau voor LU1?]',
      evidenceIds: ['s1-b1', 's1-b2'],
    },
    {
      lu: 'LU2',
      level: 'nog-niet-beoordeeld',
      argumentation: '[Invullen: waarom sta je op dit niveau voor LU2?]',
      evidenceIds: ['s1-b3', 's1-b4'],
    },
    {
      lu: 'LU3',
      level: 'nog-niet-beoordeeld',
      argumentation: '[Invullen: heb je in deze sprint aan ethiek gewerkt? Zo niet, zeg dat eerlijk en geef aan wanneer je dit oppakt.]',
      evidenceIds: [],
    },
    {
      lu: 'LU4',
      level: 'nog-niet-beoordeeld',
      argumentation: '[Invullen: waarom sta je op dit niveau voor LU4?]',
      evidenceIds: ['s1-b2', 's1-b3', 's1-b5', 's1-b6'],
    },
    {
      lu: 'LU5',
      level: 'nog-niet-beoordeeld',
      argumentation: '[Invullen: waarom sta je op dit niveau voor LU5?]',
      evidenceIds: ['s1-b3', 's1-b6'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // REFLECTIE
  // ─────────────────────────────────────────────────────────────────────────
  reflection: {
    learned: ['[Invullen: wat heb ik geleerd?]'],
    keep: ['[Invullen: wat wil ik behouden?]'],
    improve: ['[Invullen: wat ga ik de volgende keer anders doen?]'],
  },
};
