import { useState, type ReactNode } from 'react';
import { ChevronDown, Paperclip, Pencil, Trash2 } from 'lucide-react';
import { EVIDENCE_TYPES, LEARNING_OUTCOMES, STORY_TYPES, STORY_TYPE_ORDER } from '../lib/constants';
import { href } from '../lib/router';
import { evidenceForStory, evidenceHasSource, storyCode } from '../lib/selectors';
import { newId, useStore } from '../lib/store';
import type { Story, StoryType } from '../lib/types';
import { CheckboxGroup, Field, Select, TextArea, TextInput, linesToList, listToLines } from './fields';
import { Button, Card, LuChip, Modal, Placeholder, StoryTypeBadge, cx } from './ui';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">{title}</h4>
      {children}
    </div>
  );
}

function Text({ value, placeholder }: { value: string; placeholder: string }) {
  return value.trim() ? (
    <p className="whitespace-pre-line text-sm leading-relaxed">{value}</p>
  ) : (
    <Placeholder className="!py-2">{placeholder}</Placeholder>
  );
}

function CriteriaList({ items, placeholder }: { items: string[]; placeholder: string }) {
  if (!items.length) return <Placeholder className="!py-2">{placeholder}</Placeholder>;
  return (
    <ol className="space-y-1.5 text-sm leading-relaxed">
      {items.map((c, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-bold text-muted">
            {i + 1}
          </span>
          <span>{c}</span>
        </li>
      ))}
    </ol>
  );
}

export function StoryCard({
  story,
  defaultOpen = false,
  onEdit,
  showSprint = false,
}: {
  story: Story;
  defaultOpen?: boolean;
  onEdit?: (s: Story) => void;
  showSprint?: boolean;
}) {
  const { data, editMode } = useStore();
  const [open, setOpen] = useState(defaultOpen);
  const evidence = evidenceForStory(data, story.id);
  const code = storyCode(data, story);
  const type = STORY_TYPES[story.type];

  return (
    <Card className={cx('overflow-hidden border-l-4', type.accent)}>
      <div id={`story-${story.id}`} className="p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StoryTypeBadge type={story.type} code={code} />
              <span className="text-xs font-semibold text-muted">{type.long}</span>
              {showSprint && (
                <a href={href.sprint(story.sprint)} className="text-xs font-semibold text-muted hover:text-accent">
                  · Sprint {story.sprint}
                </a>
              )}
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug">{story.title || 'Naamloze story'}</h3>
            {story.description ? (
              <p className="mt-2 text-sm italic leading-relaxed text-muted">“{story.description}”</p>
            ) : (
              <Placeholder className="mt-2 !py-2">Storyomschrijving (Als … wil ik … zodat …) nog invullen.</Placeholder>
            )}
          </div>
          {editMode && onEdit && (
            <button
              onClick={() => onEdit(story)}
              className="rounded-lg p-1.5 text-muted hover:bg-stone-100 hover:text-ink"
              aria-label="Story bewerken"
            >
              <Pencil size={15} />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {story.outcomes.map((o) => (
              <LuChip key={o} code={o} />
            ))}
            <span className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-muted">
              <Paperclip size={12} /> {evidence.length} bewijs{evidence.length === 1 ? 'stuk' : 'stukken'}
            </span>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-accent hover:bg-accent-soft"
            aria-expanded={open}
          >
            {open ? 'Minder tonen' : 'Details & criteria'}
            <ChevronDown size={16} className={cx('transition', open && 'rotate-180')} />
          </button>
        </div>
      </div>

      {open && (
        <div className="grid gap-6 border-t border-line bg-stone-50/50 p-5 md:grid-cols-2">
          <Block title="Context">
            <Text value={story.context} placeholder="Context nog aanvullen." />
          </Block>
          <Block title="Aanpak">
            <Text value={story.approach} placeholder="Aanpak nog aanvullen." />
          </Block>
          <div className="md:col-span-2">
            <Block title="Resultaat">
              <Text value={story.result} placeholder="Resultaat nog aanvullen." />
            </Block>
          </div>
          <Block title="Acceptatiecriteria">
            <CriteriaList items={story.acceptanceCriteria} placeholder="Acceptatiecriteria nog invullen." />
          </Block>
          <Block title="Kwaliteitscriteria">
            <CriteriaList items={story.qualityCriteria} placeholder="Kwaliteitscriteria nog invullen." />
          </Block>
          <div className="md:col-span-2">
            <Block title="Gekoppelde bewijsstukken">
              {evidence.length ? (
                <ul className="divide-y divide-line rounded-xl border border-line bg-white">
                  {evidence.map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <a href={href.bewijs(e.id)} className="font-semibold hover:text-accent">
                        {e.title}
                      </a>
                      <span className={cx('shrink-0 text-xs', evidenceHasSource(e) ? 'text-muted' : 'italic text-stone-400')}>
                        {evidenceHasSource(e) ? EVIDENCE_TYPES[e.type].label : 'bewijs volgt'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Placeholder className="!py-2">Nog geen bewijs gekoppeld aan deze story.</Placeholder>
              )}
            </Block>
          </div>
        </div>
      )}
    </Card>
  );
}

export function blankStory(sprint: number, type: StoryType = 'US'): Story {
  return {
    id: newId('s'),
    sprint,
    type,
    title: '',
    description: '',
    context: '',
    approach: '',
    result: '',
    acceptanceCriteria: [],
    qualityCriteria: [],
    outcomes: [],
  };
}

export function StoryForm({ initial, onClose }: { initial: Story; onClose: () => void }) {
  const { data, saveStory, deleteStory } = useStore();
  const [s, setS] = useState(initial);
  const [ac, setAc] = useState(listToLines(initial.acceptanceCriteria));
  const [qc, setQc] = useState(listToLines(initial.qualityCriteria));
  const isNew = !data.stories.some((x) => x.id === initial.id);
  const set = <K extends keyof Story>(key: K, value: Story[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const valid = s.title.trim().length > 0;

  const save = () => {
    if (!valid) return;
    saveStory({ ...s, acceptanceCriteria: linesToList(ac), qualityCriteria: linesToList(qc) });
    onClose();
  };

  return (
    <Modal
      title={isNew ? 'Nieuwe story toevoegen' : 'Story bewerken'}
      onClose={onClose}
      footer={
        <>
          {!isNew && (
            <Button
              variant="danger"
              className="mr-auto"
              onClick={() => {
                if (confirm('Deze story verwijderen? Gekoppelde bewijsstukken blijven bestaan.')) {
                  deleteStory(s.id);
                  onClose();
                }
              }}
            >
              <Trash2 size={15} /> Verwijderen
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Annuleren
          </Button>
          <Button onClick={save} disabled={!valid}>
            Opslaan
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type story">
            <Select
              value={s.type}
              onChange={(v) => set('type', v)}
              options={STORY_TYPE_ORDER.map((t) => ({ value: t, label: `${t} — ${STORY_TYPES[t].long}` }))}
            />
          </Field>
          <Field label="Sprint">
            <Select
              value={s.sprint}
              onChange={(v) => set('sprint', v)}
              options={data.sprints.map((sp) => ({ value: sp.number, label: `Sprint ${sp.number}` }))}
            />
          </Field>
        </div>
        <Field label="Titel *">
          <TextInput value={s.title} onChange={(v) => set('title', v)} placeholder="Korte titel, bijv. AI voor klantonderzoek" />
        </Field>
        <Field label="Omschrijving" hint="Gebruik de vorm: Als … wil ik … zodat …">
          <TextArea value={s.description} onChange={(v) => set('description', v)} rows={3} />
        </Field>
        <Field label="Context">
          <TextArea value={s.context} onChange={(v) => set('context', v)} rows={2} />
        </Field>
        <Field label="Aanpak">
          <TextArea value={s.approach} onChange={(v) => set('approach', v)} rows={3} />
        </Field>
        <Field label="Resultaat">
          <TextArea value={s.result} onChange={(v) => set('result', v)} rows={3} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Acceptatiecriteria" hint="Eén criterium per regel.">
            <TextArea value={ac} onChange={setAc} rows={5} />
          </Field>
          <Field label="Kwaliteitscriteria" hint="Eén criterium per regel.">
            <TextArea value={qc} onChange={setQc} rows={5} />
          </Field>
        </div>
        <Field group label="Gekoppelde leeruitkomsten">
          <CheckboxGroup
            options={LEARNING_OUTCOMES.map((lu) => ({ value: lu.code, label: `${lu.code.replace('LU', 'LU ')} · ${lu.short}` }))}
            value={s.outcomes}
            onChange={(v) => set('outcomes', v)}
          />
        </Field>
        <p className="rounded-xl bg-stone-50 p-3 text-xs text-muted">
          Bewijsstukken koppel je aan een story vanuit het bewijsstuk zelf (veld “Hoort bij story”).
        </p>
      </div>
    </Modal>
  );
}
