import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { EvidenceCard } from '../components/evidence';
import { EvidenceForm, blankEvidence } from '../components/EvidenceForm';
import { Select } from '../components/fields';
import { Button, EmptyState, PageHeader } from '../components/ui';
import { EVIDENCE_TYPES, EVIDENCE_TYPE_ORDER, LEARNING_OUTCOMES } from '../lib/constants';
import { href } from '../lib/router';
import { useStore } from '../lib/store';
import type { Evidence, EvidenceType, LuCode } from '../lib/types';

export function EvidencePage({ focusId }: { focusId?: string }) {
  const { data, editMode } = useStore();
  const [sprint, setSprint] = useState(0);
  const [lu, setLu] = useState<LuCode | ''>('');
  const [type, setType] = useState<EvidenceType | ''>('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Evidence | null>(null);

  const focused = focusId ? data.evidence.find((e) => e.id === focusId) : undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.evidence
      .filter(
        (e) =>
          (sprint === 0 || e.sprint === sprint) &&
          (!lu || e.outcomes.includes(lu)) &&
          (!type || e.type === type) &&
          (!q || [e.title, e.description, ...e.aiTools].join(' ').toLowerCase().includes(q)),
      )
      .sort((a, b) => a.sprint - b.sprint);
  }, [data.evidence, sprint, lu, type, query]);

  const current = data.sprints.find((s) => s.status === 'bezig')?.number ?? 1;

  if (focused) {
    return (
      <>
        <a href={href.bewijs()} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={15} /> Alle bewijsstukken
        </a>
        <div className="max-w-2xl">
          <EvidenceCard evidence={focused} onEdit={setEditing} />
        </div>
        {editing && <EvidenceForm initial={editing} onClose={() => setEditing(null)} />}
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Bewijsvoering"
        title="Alle bewijsstukken"
        intro="Ieder bewijsstuk laat zien bij welke story het hoort en welke leeruitkomst het aantoont. Filter op sprint, leeruitkomst of type."
        actions={
          editMode ? (
            <Button onClick={() => setEditing(blankEvidence(current))}>
              <Plus size={16} /> Bewijs toevoegen
            </Button>
          ) : undefined
        }
      />

      <div className="mb-8 grid gap-2 rounded-2xl border border-line bg-surface p-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          value={sprint}
          onChange={setSprint}
          options={[{ value: 0, label: 'Alle sprints' }, ...data.sprints.map((s) => ({ value: s.number, label: `Sprint ${s.number}` }))]}
        />
        <Select
          value={lu}
          onChange={setLu}
          options={[
            { value: '' as const, label: 'Alle leeruitkomsten' },
            ...LEARNING_OUTCOMES.map((l) => ({ value: l.code, label: `${l.code.replace('LU', 'LU ')} · ${l.short}` })),
          ]}
        />
        <Select
          value={type}
          onChange={setType}
          options={[{ value: '' as const, label: 'Alle typen' }, ...EVIDENCE_TYPE_ORDER.map((t) => ({ value: t, label: EVIDENCE_TYPES[t].label }))]}
        />
        <label className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek bewijs…"
            className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      <p className="mb-4 text-sm text-muted">
        {filtered.length} van {data.evidence.length} bewijsstukken
      </p>
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EvidenceCard key={e.id} evidence={e} onEdit={setEditing} />
          ))}
        </div>
      ) : (
        <EmptyState>Geen bewijsstukken gevonden voor deze filters.</EmptyState>
      )}

      {editing && <EvidenceForm initial={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
