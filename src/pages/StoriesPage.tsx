import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Select } from '../components/fields';
import { StoryCard, StoryForm, blankStory } from '../components/stories';
import { Button, EmptyState, FilterPills, PageHeader, StoryTypeBadge } from '../components/ui';
import { STORY_TYPES, STORY_TYPE_ORDER } from '../lib/constants';
import { useStore } from '../lib/store';
import type { Story, StoryType } from '../lib/types';

export function StoriesPage({ focusId }: { focusId?: string }) {
  const { data, editMode } = useStore();
  const [type, setType] = useState<StoryType | 'all'>('all');
  const [sprint, setSprint] = useState<number | 0>(0);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Story | null>(null);

  useEffect(() => {
    if (!focusId) return;
    setType('all');
    setSprint(0);
    setQuery('');
    requestAnimationFrame(() => document.getElementById(`story-${focusId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [focusId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.stories.filter(
      (s) =>
        (type === 'all' || s.type === type) &&
        (sprint === 0 || s.sprint === sprint) &&
        (!q || [s.title, s.description, s.context, s.approach, s.result, ...s.outcomes].join(' ').toLowerCase().includes(q)),
    );
  }, [data.stories, type, sprint, query]);

  const sprintsWithStories = [...new Set(filtered.map((s) => s.sprint))].sort((a, b) => a - b);

  return (
    <>
      <PageHeader
        eyebrow="Story framework"
        title="Research, User & Learning Stories"
        intro="Wat heb ik onderzocht (RS), welke oplossing heb ik gemaakt (US) en wat heb ik geleerd (LS)? Klik op een story voor context, aanpak, resultaat, criteria en bewijs."
        actions={
          editMode ? (
            <Button onClick={() => setEditing(blankStory(data.sprints.find((s) => s.status === 'bezig')?.number ?? 1))}>
              <Plus size={16} /> Story toevoegen
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {STORY_TYPE_ORDER.map((t) => (
          <div key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
            <StoryTypeBadge type={t} />
            <div className="min-w-0">
              <p className="text-sm font-bold">{STORY_TYPES[t].long}</p>
              <p className="text-xs text-muted">{STORY_TYPES[t].explain}</p>
            </div>
            <span className="ml-auto font-display text-2xl font-semibold tabular-nums">{data.stories.filter((s) => s.type === t).length}</span>
          </div>
        ))}
      </div>

      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 lg:flex-row lg:items-center">
        <FilterPills
          value={type}
          onChange={setType}
          options={[
            { value: 'all', label: `Alle (${data.stories.length})` },
            ...STORY_TYPE_ORDER.map((t) => ({ value: t, label: STORY_TYPES[t].long.replace('Story', 'Stories') })),
          ]}
        />
        <div className="flex flex-1 gap-2 lg:justify-end">
          <div className="w-40 shrink-0">
            <Select
              value={sprint}
              onChange={setSprint}
              options={[{ value: 0, label: 'Alle sprints' }, ...data.sprints.map((s) => ({ value: s.number, label: `Sprint ${s.number}` }))]}
            />
          </div>
          <label className="relative flex-1 lg:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek in stories…"
              className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm focus:border-accent focus:outline-none"
            />
          </label>
        </div>
      </div>

      {sprintsWithStories.length ? (
        <div className="space-y-10">
          {sprintsWithStories.map((n) => (
            <section key={n}>
              <h2 className="mb-3 font-display text-xl font-semibold">Sprint {n}</h2>
              <div className="space-y-3">
                {filtered
                  .filter((s) => s.sprint === n)
                  .map((s) => (
                    <StoryCard key={s.id} story={s} onEdit={setEditing} defaultOpen={s.id === focusId} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState>Geen stories gevonden voor dit filter of deze zoekterm.</EmptyState>
      )}

      {editing && <StoryForm initial={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
