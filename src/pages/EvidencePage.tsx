import { useMemo, useState } from 'react';
import { EvidenceCard } from '../components/EvidenceCard';
import { EmptyState } from '../components/ui';
import { learningOutcomes } from '../content/learningOutcomes';
import { sprints } from '../content/sprints';
import type { EvidenceType } from '../content/types';
import { allEvidence } from '../lib/content';
import { EVIDENCE_TYPE_LABEL } from '../lib/labels';

export function EvidencePage() {
  const [sprint, setSprint] = useState('alle');
  const [lu, setLu] = useState('alle');
  const [type, setType] = useState('alle');

  const types = useMemo(() => [...new Set(allEvidence.map((e) => e.type))] as EvidenceType[], []);
  const filtered = allEvidence.filter(
    (e) =>
      (sprint === 'alle' || e.sprint === Number(sprint)) &&
      (lu === 'alle' || e.learningOutcomes.includes(lu as never)) &&
      (type === 'alle' || e.type === type),
  );
  const isFiltered = sprint !== 'alle' || lu !== 'alle' || type !== 'alle';

  return (
    <div className="container-page pt-10 sm:pt-14">
      <p className="eyebrow mb-2">Minor Futureproof met AI</p>
      <h1 className="h-page">Bewijs</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Alle bewijsstukken uit alle sprints. Bij ieder stuk staat bij welke story het hoort en welke leeruitkomst het
        aantoont. Filter op sprint, leeruitkomst of type.
      </p>

      <div className="card mt-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <Select label="Sprint" value={sprint} onChange={setSprint}>
          <option value="alle">Alle sprints</option>
          {sprints.map((s) => (
            <option key={s.number} value={s.number}>
              Sprint {s.number}
            </option>
          ))}
        </Select>
        <Select label="Leeruitkomst" value={lu} onChange={setLu}>
          <option value="alle">Alle leeruitkomsten</option>
          {learningOutcomes.map((l) => (
            <option key={l.code} value={l.code}>
              {l.code} – {l.title}
            </option>
          ))}
        </Select>
        <Select label="Type" value={type} onChange={setType}>
          <option value="alle">Alle types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {EVIDENCE_TYPE_LABEL[t]}
            </option>
          ))}
        </Select>
        {isFiltered && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSprint('alle');
              setLu('alle');
              setType('alle');
            }}
          >
            Wis filters
          </button>
        )}
      </div>

      <p className="mb-4 mt-6 text-sm text-muted">
        {filtered.length} bewijsstuk{filtered.length === 1 ? '' : 'ken'}
      </p>
      {filtered.length === 0 ? (
        <EmptyState>Geen bewijs gevonden met deze filters.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EvidenceCard key={e.id} evidence={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}
