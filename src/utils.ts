import { DiaryEntry } from './types';
import { INITIAL_ENTRIES } from './constants';

const STORAGE_KEY_ENTRIES = 'digitaal_dagboek_notities_v1';
const STORAGE_KEY_PIN = 'digitaal_dagboek_pin_v1';
const STORAGE_KEY_LOCKED = 'digitaal_dagboek_is_locked_v1';

export function loadEntries(): DiaryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(INITIAL_ENTRIES));
      return INITIAL_ENTRIES;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // If previous session only had the single default sample-1, upgrade to the 3 diverse samples
      if (parsed.length === 1 && parsed[0].id === 'sample-1') {
        localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(INITIAL_ENTRIES));
        return INITIAL_ENTRIES;
      }
      return parsed;
    }
    return INITIAL_ENTRIES;
  } catch {
    return INITIAL_ENTRIES;
  }
}

export function saveEntries(entries: DiaryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
  } catch (err) {
    console.error('Kon notities niet opslaan:', err);
  }
}

export function loadPin(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_PIN);
  } catch {
    return null;
  }
}

export function savePin(pin: string | null): void {
  try {
    if (pin) {
      localStorage.setItem(STORAGE_KEY_PIN, pin);
    } else {
      localStorage.removeItem(STORAGE_KEY_PIN);
    }
  } catch (err) {
    console.error('Kon pincode niet opslaan:', err);
  }
}

export function loadIsLocked(): boolean {
  try {
    const hasPin = !!localStorage.getItem(STORAGE_KEY_PIN);
    if (!hasPin) return false;
    const locked = localStorage.getItem(STORAGE_KEY_LOCKED);
    // If user has a pin set, default to locked on load for privacy
    return locked === null ? true : locked === 'true';
  } catch {
    return false;
  }
}

export function saveIsLocked(locked: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOCKED, locked ? 'true' : 'false');
  } catch (err) {
    console.error('Kon vergrendelingsstatus niet opslaan:', err);
  }
}

export function formatDutchDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const STORAGE_KEY_PROFILE = 'minor_portfolio_profile_v1';
const STORAGE_KEY_STORIES = 'minor_portfolio_stories_v1';
const STORAGE_KEY_EVIDENCE = 'minor_portfolio_evidence_v1';

export function loadProfile<T>(fallback: T): T {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function saveProfile<T>(profile: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Kon profiel niet opslaan:', err);
  }
}

export function loadStoredStories<T>(fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_STORIES);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredStories<T>(stories: T[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(stories));
  } catch (err) {
    console.error('Kon stories niet opslaan:', err);
  }
}

export function loadWorkItems<T>(fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EVIDENCE);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Migrate items if needed: ensure learningOutcomeCodes and whatMade are set
      const migrated = parsed.map((item: any) => {
        const codes = Array.isArray(item.learningOutcomeCodes) && item.learningOutcomeCodes.length > 0
          ? item.learningOutcomeCodes
          : item.learningOutcomeCode
          ? [item.learningOutcomeCode]
          : ['LU-1'];
        return {
          ...item,
          learningOutcomeCodes: codes,
          whatMade: item.whatMade || item.description || 'Geen omschrijving opgegeven.',
        };
      });
      return migrated;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function saveWorkItems<T>(items: T[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(items));
  } catch (err) {
    console.error('Kon werkstukken niet opslaan:', err);
  }
}

export const loadEvidenceLinks = loadWorkItems;
export const saveEvidenceLinks = saveWorkItems;
