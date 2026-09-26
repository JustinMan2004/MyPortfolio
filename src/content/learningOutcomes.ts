/**
 * LEERUITKOMSTEN — de vijf leeruitkomsten van de minor.
 *
 * Per LU vul je hier in:
 *  - level:         je huidige totaalniveau (werk dit bij na iedere sprint)
 *  - argumentation: je overkoepelende argumentatie (één item = één alinea)
 *
 * De gekoppelde bewijsstukken en sprints worden AUTOMATISCH verzameld uit de
 * sprintbestanden (src/content/sprints/). Daar hoef je hier niets voor te doen.
 */
import type { LearningOutcome } from './types';

export const learningOutcomes: LearningOutcome[] = [
  {
    code: 'LU1',
    title: 'AI-impact op de toekomstige beroepspraktijk analyseren en evalueren',
    description:
      'Je kunt zelfstandig onderzoek doen naar de impact van AI in jouw toekomstig beroep en vaststellen welke nieuwe AI en digitale vaardigheden daarvoor nodig zijn.',
    level: 'in-ontwikkeling',
    argumentation: [
      '[Invullen: leg uit hoe je met je onderzoek naar de impact van AI op het beroep accountmanager deze leeruitkomst aantoont. Verwijs naar je belangrijkste bewijsstukken.]',
    ],
  },
  {
    code: 'LU2',
    title: 'Praktijkgerichte AI-oplossing ontwerpen, realiseren en presenteren',
    description:
      'Je kunt zelfstandig een AI-oplossing ontwerpen, realiseren en presenteren die een specifieke beroepspraktijk radicaal transformeert (verandert).',
    level: 'in-ontwikkeling',
    argumentation: [
      '[Invullen: beschrijf welke AI-oplossing(en) je hebt ontworpen, gebouwd en gepresenteerd en waarom die aansluiten bij de beroepspraktijk.]',
    ],
  },
  {
    code: 'LU3',
    title: 'Ethiek en verantwoordelijk AI-gebruik beoordelen',
    description:
      'Je kunt zelfstandig de ethische vraagstukken en uitdagingen van AI in je vakgebied identificeren en aanbevelingen formuleren voor verantwoord AI-gebruik, rekening houdend met privacy, bias en transparantie.',
    level: 'nog-niet-aangetoond',
    argumentation: [
      '[Invullen: welke ethische vraagstukken (privacy, bias, transparantie) heb je onderzocht en welke aanbevelingen heb je geformuleerd?]',
    ],
  },
  {
    code: 'LU4',
    title: 'AI-tools en technieken gebruiken',
    description:
      'Je kunt zelfstandig verschillende AI-tools en platforms toepassen (zoals machine learning technieken, chatbots, agents en prompts) en deze gebruiken om specifieke taken binnen je vakgebied op te lossen.',
    level: 'in-ontwikkeling',
    argumentation: [
      '[Invullen: welke AI-tools heb je ingezet (bijv. ChatGPT, Gemini, Perplexity, Google AI Studio), voor welke taak, en waarom koos je voor die tool?]',
    ],
  },
  {
    code: 'LU5',
    title: 'Zelfstandig en zelfsturend werken',
    description:
      'Je kunt een eigen leerroute vaststellen en uitvoeren waarbij je zelfstandig je leervragen stelt, relevante bronnen en tools selecteert, je eigen voortgang monitort en kritisch reflecteert op je leerproces en persoonlijke ontwikkeling in het AI-landschap.',
    level: 'in-ontwikkeling',
    argumentation: [
      '[Invullen: hoe heb je je eigen leerroute gepland en bewaakt? Hoe heb je feedback verwerkt en gereflecteerd?]',
    ],
  },
];
