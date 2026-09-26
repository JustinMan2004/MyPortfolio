import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import published from '../data/portfolio.json';
import type { Evidence, PortfolioData, Profile, Sprint, SprintStatus, Story, Tool } from './types';

/**
 * Gegevensbron van het portfolio.
 *
 * - `src/data/portfolio.json` is de gepubliceerde versie die iedere bezoeker ziet.
 * - In beheermodus worden wijzigingen direct in deze browser opgeslagen (localStorage).
 * - Via Beheer → "Download portfolio.json" zet je je wijzigingen online: vervang
 *   `src/data/portfolio.json` door het gedownloade bestand en publiceer opnieuw.
 */

const PUBLISHED = published as PortfolioData;
const DATA_KEY = 'portfolio-futureproof:data';
const EDIT_KEY = 'portfolio-futureproof:edit';

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* opslag niet beschikbaar (privévenster) — wijzigingen blijven alleen in geheugen */
  }
}

interface Store {
  data: PortfolioData;
  editMode: boolean;
  hasLocalChanges: boolean;
  setEditMode: (on: boolean) => void;
  setSprintStatus: (sprint: number, status: SprintStatus) => void;
  saveSprint: (sprint: Sprint) => void;
  saveStory: (story: Story) => void;
  deleteStory: (id: string) => void;
  saveEvidence: (evidence: Evidence) => void;
  deleteEvidence: (id: string) => void;
  saveTool: (tool: Tool) => void;
  deleteTool: (id: string) => void;
  saveProfile: (profile: Profile) => void;
  importData: (data: PortfolioData) => void;
  resetToPublished: () => void;
}

const StoreContext = createContext<Store | null>(null);

const upsert = <T extends { id: string }>(list: T[], item: T) =>
  list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [local, setLocal] = useState<PortfolioData | null>(() => readLocal<PortfolioData>(DATA_KEY));
  const [editMode, setEditModeState] = useState<boolean>(() => readLocal<boolean>(EDIT_KEY) ?? false);

  const data = local ?? PUBLISHED;

  useEffect(() => writeLocal(DATA_KEY, local), [local]);

  const setEditMode = useCallback((on: boolean) => {
    setEditModeState(on);
    writeLocal(EDIT_KEY, on ? true : null);
  }, []);

  const update = useCallback((fn: (d: PortfolioData) => PortfolioData) => {
    setLocal((prev) => fn(prev ?? PUBLISHED));
  }, []);

  const store = useMemo<Store>(
    () => ({
      data,
      editMode,
      hasLocalChanges: local !== null,
      setEditMode,
      setSprintStatus: (n, status) =>
        update((d) => ({ ...d, sprints: d.sprints.map((s) => (s.number === n ? { ...s, status } : s)) })),
      saveSprint: (sprint) =>
        update((d) => ({ ...d, sprints: d.sprints.map((s) => (s.number === sprint.number ? sprint : s)) })),
      saveStory: (story) => update((d) => ({ ...d, stories: upsert(d.stories, story) })),
      deleteStory: (id) =>
        update((d) => ({
          ...d,
          stories: d.stories.filter((s) => s.id !== id),
          evidence: d.evidence.map((e) => ({ ...e, storyIds: e.storyIds.filter((s) => s !== id) })),
        })),
      saveEvidence: (evidence) => update((d) => ({ ...d, evidence: upsert(d.evidence, evidence) })),
      deleteEvidence: (id) => update((d) => ({ ...d, evidence: d.evidence.filter((e) => e.id !== id) })),
      saveTool: (tool) => update((d) => ({ ...d, tools: upsert(d.tools, tool) })),
      deleteTool: (id) => update((d) => ({ ...d, tools: d.tools.filter((t) => t.id !== id) })),
      saveProfile: (profile) => update((d) => ({ ...d, profile })),
      importData: (imported) => setLocal(imported),
      resetToPublished: () => setLocal(null),
    }),
    [data, editMode, local, setEditMode, update],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore moet binnen StoreProvider gebruikt worden');
  return ctx;
}

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function isValidPortfolioData(value: unknown): value is PortfolioData {
  const d = value as PortfolioData;
  return (
    !!d &&
    typeof d === 'object' &&
    !!d.profile &&
    Array.isArray(d.sprints) &&
    Array.isArray(d.stories) &&
    Array.isArray(d.evidence) &&
    Array.isArray(d.tools)
  );
}
