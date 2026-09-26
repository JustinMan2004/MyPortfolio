import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { profile } from '../content/profile';
import { sprints } from '../content/sprints';
import { href } from '../lib/router';
import { StatusBadge } from './ui';

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'Sprints', path: '/sprints' },
  { label: 'Leeruitkomsten', path: '/leeruitkomsten' },
  { label: 'Bewijs', path: '/bewijs' },
  { label: 'Over mij', path: '/over-mij' },
];

function isActive(current: string, path: string) {
  return path === '/' ? current === '' : current === path.slice(1);
}

function SprintsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const closeOnNav = () => setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('hashchange', closeOnNav);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('hashchange', closeOnNav);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${
          active ? 'text-accent' : 'text-muted hover:text-ink'
        }`}
      >
        Sprints <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open && (
        <div className="card absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 p-2">
          <a href={href('/sprints')} className="block rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-page">
            Alle sprints
          </a>
          <div className="my-1 border-t border-line" />
          {sprints.map((s) => (
            <a
              key={s.number}
              href={href(`/sprints/${s.number}`)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink hover:bg-page"
            >
              Sprint {s.number}
              <StatusBadge status={s.status} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Layout({ current, children }: { current: string; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const top = current.split('/')[0];

  useEffect(() => setMobileOpen(false), [current]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <a href={href('/')} className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
              JM
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-ink">{profile.name}</span>
              <span className="block text-xs text-muted">{profile.minor}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Hoofdnavigatie">
            {NAV.map((item) =>
              item.path === '/sprints' ? (
                <SprintsMenu key={item.path} active={top === 'sprints'} />
              ) : (
                <a
                  key={item.path}
                  href={href(item.path)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive(top, item.path) ? 'text-accent' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <button
            type="button"
            className="rounded-lg p-2 text-ink md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-line bg-white md:hidden" aria-label="Mobiele navigatie">
            <div className="container-page space-y-1 py-3">
              {NAV.map((item) => (
                <a
                  key={item.path}
                  href={href(item.path)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(top, item.path) ? 'bg-accent-soft text-accent-dark' : 'text-ink hover:bg-page'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="grid grid-cols-4 gap-2 px-1 pt-2">
                {sprints.map((s) => (
                  <a
                    key={s.number}
                    href={href(`/sprints/${s.number}`)}
                    className="rounded-lg border border-line py-2 text-center text-xs font-medium text-ink hover:border-accent hover:text-accent"
                  >
                    Sprint {s.number}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-line bg-white">
        <div className="container-page flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {profile.name} · {profile.study}, {profile.school} {profile.city}
          </p>
          <p>Portfolio minor {profile.minor}</p>
        </div>
      </footer>
    </div>
  );
}
