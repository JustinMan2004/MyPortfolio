import { useState, type ReactNode } from 'react';
import { Award, BookOpen, FolderOpen, Home, Layers, Plus, Settings2, Sparkles, User } from 'lucide-react';
import { href, type Route } from '../lib/router';
import { useStore } from '../lib/store';
import { EvidenceForm, blankEvidence } from './EvidenceForm';
import { cx } from './ui';

const NAV = [
  { key: 'home', label: 'Home', to: href.home, icon: Home, match: ['home'] },
  { key: 'sprints', label: 'Sprints', to: href.sprints, icon: Layers, match: ['sprints', 'sprint'] },
  { key: 'stories', label: 'Stories', to: href.stories(), icon: BookOpen, match: ['stories'] },
  { key: 'lu', label: 'Leeruitkomsten', to: href.leeruitkomsten(), icon: Award, match: ['leeruitkomsten'] },
  { key: 'bewijs', label: 'Bewijs', to: href.bewijs(), icon: FolderOpen, match: ['bewijs'] },
  { key: 'tools', label: 'AI-tools', to: href.tools, icon: Sparkles, match: ['tools'] },
  { key: 'over', label: 'Over mij', to: href.overMij, icon: User, match: ['over-mij'] },
];

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const { data, editMode, hasLocalChanges, setEditMode } = useStore();
  const [adding, setAdding] = useState(false);
  const { profile } = data;
  const current = data.sprints.find((s) => s.status === 'bezig') ?? data.sprints[0];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-3 sm:px-6">
          <a href={href.home} className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-display text-base font-semibold text-white">
              {profile.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold leading-tight">{profile.name}</span>
              <span className="block truncate text-xs font-semibold text-accent">Portfolio · Minor {profile.minor}</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            {editMode && (
              <button
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Bewijs toevoegen</span>
                <span className="sm:hidden">Bewijs</span>
              </button>
            )}
            <a
              href={href.bewijs()}
              className="hidden items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold hover:border-stone-400 md:inline-flex"
            >
              <FolderOpen size={16} className="text-accent" /> Alle bewijzen ({data.evidence.length})
            </a>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-2 sm:px-4" aria-label="Hoofdmenu">
          <ul className="scrollbar-none flex gap-1 overflow-x-auto py-2">
            {NAV.map((item) => {
              const active = item.match.includes(route.page);
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <a
                    href={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition',
                      active ? 'bg-ink text-white' : 'text-muted hover:bg-stone-200/60 hover:text-ink',
                    )}
                  >
                    <Icon size={16} /> {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {editMode && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm text-amber-900 sm:px-6">
            <span>
              <strong>Beheermodus aan.</strong>{' '}
              {hasLocalChanges
                ? 'Je wijzigingen staan in deze browser. Publiceer ze via Beheer zodat je docent ze ook ziet.'
                : 'Gebruik de potlood- en plusknoppen om je portfolio aan te vullen.'}
            </span>
            <span className="flex gap-3">
              <a href={href.beheer} className="font-semibold underline underline-offset-2">
                Naar Beheer
              </a>
              <button onClick={() => setEditMode(false)} className="font-semibold underline underline-offset-2">
                Beheermodus uit
              </button>
            </span>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 md:py-12">{children}</main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:px-6">
          <span>
            {profile.name} · {profile.study} · Minor {profile.minor}
            {profile.schoolYear && ` · ${profile.schoolYear}`}
          </span>
          <a href={href.beheer} className="inline-flex items-center gap-1.5 hover:text-ink">
            <Settings2 size={14} /> Beheer
          </a>
        </div>
      </footer>

      {adding && <EvidenceForm initial={blankEvidence(current.number)} onClose={() => setAdding(false)} />}
    </div>
  );
}
