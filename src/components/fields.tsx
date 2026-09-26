import type { ReactNode } from 'react';
import { cx } from './ui';

const inputCls =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-stone-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15';

export function Field({
  label,
  hint,
  children,
  group,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  /** Gebruik voor knoppengroepen: een <label> om meerdere knoppen activeert anders de eerste knop. */
  group?: boolean;
}) {
  const Tag = group ? 'div' : 'label';
  return (
    <Tag className="block" {...(group ? { role: 'group', 'aria-label': label } : {})}>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </Tag>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cx(inputCls, 'resize-y leading-relaxed')}
    />
  );
}

export function Select<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={String(value)}
      onChange={(e) => {
        const match = options.find((o) => String(o.value) === e.target.value);
        if (match) onChange(match.value);
      }}
      className={inputCls}
    >
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function CheckboxGroup<T extends string>({
  options,
  value,
  onChange,
  empty,
}: {
  options: { value: T; label: ReactNode }[];
  value: T[];
  onChange: (v: T[]) => void;
  empty?: string;
}) {
  if (options.length === 0) return <p className="text-sm italic text-muted">{empty ?? 'Geen opties beschikbaar.'}</p>;
  const toggle = (v: T) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => toggle(o.value)}
            aria-pressed={on}
            className={cx(
              'rounded-lg px-3 py-1.5 text-left text-sm ring-1 transition',
              on ? 'bg-accent-soft font-semibold text-accent-strong ring-accent' : 'bg-white text-muted ring-line hover:text-ink',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Lijst als tekstveld: één item per regel. */
export const linesToList = (text: string) =>
  text
    .split('\n')
    .map((l) => l.replace(/^\s*(?:\d+[.)]|[-•*])\s*/, '').trim())
    .filter(Boolean);

export const listToLines = (list: string[]) => list.join('\n');
