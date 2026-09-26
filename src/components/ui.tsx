import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { LU_LEVEL, SPRINT_STATUS, STORY_TYPES, luDef } from '../lib/constants';
import { href } from '../lib/router';
import type { LuCode, LuLevel, SprintStatus, StoryType } from '../lib/types';

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

export function PageHeader({
  eyebrow,
  title,
  intro,
  actions,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        {intro && <div className="mt-3 text-[15px] leading-relaxed text-muted">{intro}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('rounded-2xl border border-line bg-surface', className)}>{children}</div>;
}

export function SectionTitle({
  id,
  number,
  title,
  hint,
  action,
}: {
  id?: string;
  number?: number;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div id={id} className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-tight">
          {number !== undefined && (
            <span className="font-display text-base font-medium text-accent tabular-nums">
              {String(number).padStart(2, '0')}
            </span>
          )}
          {title}
        </h2>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status, className }: { status: SprintStatus; className?: string }) {
  const s = SPRINT_STATUS[status];
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        s.className,
        className,
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
}

export function LevelBadge({ level }: { level: LuLevel }) {
  const l = LU_LEVEL[level];
  return (
    <span className={cx('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', l.className)}>
      {l.label}
    </span>
  );
}

export function StoryTypeBadge({ type, code, long }: { type: StoryType; code?: string; long?: boolean }) {
  const t = STORY_TYPES[type];
  return (
    <span
      className={cx('inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset', t.className)}
      title={t.long}
    >
      {code ?? t.label}
      {long && <span className="ml-1.5 font-medium">· {t.long}</span>}
    </span>
  );
}

export function LuChip({ code, link = true }: { code: LuCode; link?: boolean }) {
  const lu = luDef(code);
  const content = (
    <>
      <span className="font-bold">{code.replace('LU', 'LU ')}</span>
      <span className="text-muted">{lu.short}</span>
    </>
  );
  const cls =
    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-accent-soft px-2 py-0.5 text-xs text-accent-strong';
  return link ? (
    <a href={href.leeruitkomsten(code)} className={cx(cls, 'hover:bg-accent hover:text-white [&:hover_span]:text-white')} title={lu.title}>
      {content}
    </a>
  ) : (
    <span className={cls} title={lu.title}>
      {content}
    </span>
  );
}

/** Zichtbare placeholder voor informatie die nog niet is aangeleverd. */
export function Placeholder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('rounded-xl border border-dashed border-stone-300 bg-stone-50/70 px-4 py-3 text-sm italic text-stone-500', className)}>
      {children}
    </div>
  );
}

export function TextOrPlaceholder({ value, placeholder }: { value: string; placeholder: string }) {
  return value && value.trim() ? (
    <p className="whitespace-pre-line text-[15px] leading-relaxed">{value}</p>
  ) : (
    <Placeholder>{placeholder}</Placeholder>
  );
}

export function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={cx('h-2 w-full overflow-hidden rounded-full bg-stone-200/80', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-strong',
    secondary: 'border border-line bg-surface text-ink hover:border-stone-400',
    ghost: 'text-accent hover:bg-accent-soft',
    danger: 'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50',
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl bg-surface shadow-2xl sm:rounded-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-stone-100" aria-label="Sluiten">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-10 text-center text-sm text-muted">
      {children}
    </div>
  );
}

export function FilterPills<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={cx(
            'rounded-full px-3.5 py-1.5 text-sm font-semibold transition',
            o.value === value ? 'bg-ink text-white' : 'bg-surface text-muted ring-1 ring-line hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
