import type { ReactNode } from 'react';
import type { Level, LUCode, SprintStatus, StoryType } from '../content/types';
import { getLU, isPlaceholder } from '../lib/content';
import { LEVELS, SPRINT_STATUS_LABEL, STORY_TYPE_LABEL } from '../lib/labels';
import { href } from '../lib/router';

/** Toont tekst; tekst tussen [vierkante haken] wordt als placeholder gemarkeerd. */
export function Text({ children, className = '' }: { children?: string; className?: string }) {
  if (!children) return null;
  if (isPlaceholder(children)) {
    return <span className={`placeholder-text inline-block text-sm ${className}`}>{children}</span>;
  }
  return <span className={className}>{children}</span>;
}

export function Paragraphs({ items, className = '' }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={`space-y-3 text-muted ${className}`}>
      {items.map((p, i) => (
        <p key={i}>
          <Text>{p}</Text>
        </p>
      ))}
    </div>
  );
}

export function BulletList({ items, icon = 'dot' }: { items: string[]; icon?: 'dot' | 'check' }) {
  if (items.length === 0) return <p className="text-sm text-muted/70">—</p>;
  return (
    <ul className="space-y-2 text-sm text-ink/90">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          {icon === 'check' ? (
            <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 flex-none text-accent" aria-hidden>
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent/60" aria-hidden />
          )}
          <span>
            <Text>{item}</Text>
          </span>
        </li>
      ))}
    </ul>
  );
}

const STORY_STYLE: Record<StoryType, string> = {
  US: 'bg-sky-50 text-sky-800 ring-sky-200',
  RS: 'bg-violet-50 text-violet-800 ring-violet-200',
  LS: 'bg-amber-50 text-amber-800 ring-amber-200',
};

export function StoryTypeBadge({ type, long = false }: { type: StoryType; long?: boolean }) {
  return (
    <span className={`chip ring-1 ring-inset ${STORY_STYLE[type]}`} title={STORY_TYPE_LABEL[type]}>
      {long ? `${type} · ${STORY_TYPE_LABEL[type]}` : type}
    </span>
  );
}

export function LUChip({ code, withTitle = false }: { code: LUCode; withTitle?: boolean }) {
  const lu = getLU(code);
  return (
    <a
      href={href(`/leeruitkomsten/${code}`)}
      title={lu?.title}
      className="chip bg-accent-soft text-accent-dark ring-1 ring-inset ring-accent/15 hover:bg-accent hover:text-white"
    >
      {code}
      {withTitle && lu && <span className="font-normal">– {lu.title}</span>}
    </a>
  );
}

const STATUS_STYLE: Record<SprintStatus, string> = {
  gepland: 'bg-stone-100 text-stone-600',
  bezig: 'bg-accent-soft text-accent-dark',
  afgerond: 'bg-accent text-white',
};

export function StatusBadge({ status }: { status: SprintStatus }) {
  return <span className={`chip ${STATUS_STYLE[status]}`}>{SPRINT_STATUS_LABEL[status]}</span>;
}

/** Niveau-indicator met vier blokjes. */
export function LevelIndicator({ level, showLabel = true }: { level: Level; showLabel?: boolean }) {
  const { label, step } = LEVELS[level];
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1" aria-label={`Niveau: ${label}`}>
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 w-5 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>
      {showLabel && <span className="whitespace-nowrap text-xs font-medium text-muted">{label}</span>}
    </div>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div id={id} className="mb-5 flex scroll-mt-32 flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="h-section">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-sm text-muted">
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{children}</h4>;
}
