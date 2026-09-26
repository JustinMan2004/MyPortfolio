/**
 * OVERZICHT VAN ALLE SPRINTS
 *
 * Iedere sprint heeft een eigen bestand in deze map. Wil je ooit een extra
 * sprint toevoegen (bijv. Sprint 9)? Maak sprint-9.ts aan (kopie van
 * sprint-8.ts), importeer hem hieronder en zet hem in de lijst.
 */
import type { Sprint } from '../types';
import { sprint1 } from './sprint-1';
import { sprint2 } from './sprint-2';
import { sprint3 } from './sprint-3';
import { sprint4 } from './sprint-4';
import { sprint5 } from './sprint-5';
import { sprint6 } from './sprint-6';
import { sprint7 } from './sprint-7';
import { sprint8 } from './sprint-8';

export const sprints: Sprint[] = [sprint1, sprint2, sprint3, sprint4, sprint5, sprint6, sprint7, sprint8];
