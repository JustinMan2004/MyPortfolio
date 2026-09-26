import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, MessageSquare, Pencil, Plus } from 'lucide-react';
import { EvidenceCard } from '../components/evidence';
import { EvidenceForm, blankEvidence } from '../components/EvidenceForm';
import { SprintForm, StatusControl, sprintTitle } from '../components/sprints';
import { StoryCard, StoryForm, blankStory } from '../components/stories';
import { Button, Card, EmptyState, LevelBadge, LuChip, Placeholder, SectionTitle, StatusBadge, TextOrPlaceholder, cx } from '../components/ui';
import { LEARNING_OUTCOMES, STORY_TYPES, STORY_TYPE_ORDER } from '../lib/constants';
import { href } from '../lib/router';
import { formatDate, hasContent, outcomesInSprint, storyCode } from '../lib/selectors';
import { useStore } from '../lib/store';
import type { Evidence, Story } from '../lib/types';

const SECTIONS = [
  { id: 'introductie', label: 'Introductie' },
  { id: 'stories', label: 'Stories' },
  { id: 'werkzaamheden', label: 'Werkzaamheden' },
  { id: 'bewijs', label: 'Bewijsstukken' },
  { id: 'leeruitkomsten', label: 'Leeruitkomsten' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'zelfevaluatie', label: 'Zelfevaluatie' },
  { id: 'reflectie', label: 'Reflectie' },
];

export function SprintPage({ number }: { number: number }) {
  const { data, editMode } = useStore();
  const sprint = data.sprints.find((s) => s.number === number)!;
  const [editingSprint, setEditingSprint] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [evidence, setEvidence] = useState<Evidence | null>(null);

  const stories = data.stories.filter((s) => s.sprint === number);
  const sprintEvidence = data.evidence.filter((e) => e.sprint === number);
  const outcomes = outcomesInSprint(data, number);
  const prev = data.sprints.find((s) => s.number === number - 1);
  const next = data.sprints.find((s) => s.number === number + 1);
  const r = sprint.reflection;

  const editBtn = (label: string) =>
    editMode ? (
      <Button variant="ghost" onClick={() => setEditingSprint(true)} className="!px-2.5 !py-1.5">
        <Pencil size={14} /> {label}
      </Button>
    ) : undefined;

  return (
    <>
      <a href={href.sprints} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft size={15} /> Alle sprints
      </a>

      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-lg font-medium text-accent">Sprint {String(number).padStart(2, '0')}</p>
            <StatusBadge status={sprint.status} />
            {sprint.period && <span className="text-sm text-muted">{sprint.period}</span>}
          </div>
          <h1
            className={cx(
              'mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl',
              !hasContent(sprint.title) && 'italic text-stone-400',
            )}
          >
            {sprintTitle(sprint)}
          </h1>
        </div>
        {editMode && (
          <div className="flex flex-wrap items-center gap-2">
            <StatusControl sprint={sprint} />
            <Button variant="secondary" onClick={() => setEditingSprint(true)}>
              <Pencil size={15} /> Sprint bewerken
            </Button>
          </div>
        )}
      </header>

      <nav className="sticky top-[7.25rem] z-30 -mx-4 mb-10 border-y border-line bg-canvas/95 px-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-2" aria-label="Onderdelen van deze sprint">
        <ul className="scrollbar-none flex gap-1 overflow-x-auto py-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#/sprint/${number}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-muted hover:bg-stone-200/60 hover:text-ink">
                <span className="font-display text-xs text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span> {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-14">
        {/* 01 Introductie */}
        <section>
          <SectionTitle id="introductie" number={1} title="Introductie & samenvatting" action={editBtn('Bewerken')} />
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Card className="p-6">
              <TextOrPlaceholder value={sprint.summary} placeholder="Samenvatting van deze sprint nog invullen: waar stond deze sprint in het teken van?" />
            </Card>
            <Card className="grid grid-cols-3 divide-x divide-line p-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
              {[
                ['Stories', stories.length],
                ['Bewijsstukken', sprintEvidence.length],
                ['Leeruitkomsten', outcomes.length],
              ].map(([label, n]) => (
                <div key={label} className="p-4">
                  <p className="font-display text-2xl font-semibold tabular-nums">{n}</p>
                  <p className="text-xs font-semibold text-muted">{label}</p>
                </div>
              ))}
            </Card>
          </div>
        </section>

        {/* 02 Stories */}
        <section>
          <SectionTitle
            id="stories"
            number={2}
            title="Stories"
            hint="RS = wat ik onderzocht · US = wat ik maakte · LS = wat ik leerde"
            action={
              editMode ? (
                <Button variant="ghost" onClick={() => setStory(blankStory(number))} className="!px-2.5 !py-1.5">
                  <Plus size={14} /> Story
                </Button>
              ) : undefined
            }
          />
          {stories.length ? (
            <div className="space-y-6">
              {STORY_TYPE_ORDER.filter((t) => stories.some((s) => s.type === t)).map((t) => (
                <div key={t}>
                  <h3 className="mb-2 text-sm font-bold text-muted">
                    {STORY_TYPES[t].long.replace('Story', 'Stories')} <span className="font-normal">— {STORY_TYPES[t].explain}</span>
                  </h3>
                  <div className="space-y-3">
                    {stories
                      .filter((s) => s.type === t)
                      .map((s) => (
                        <StoryCard key={s.id} story={s} onEdit={setStory} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>Nog geen stories voor deze sprint.</EmptyState>
          )}
        </section>

        {/* 03 Werkzaamheden */}
        <section>
          <SectionTitle id="werkzaamheden" number={3} title="Werkzaamheden" hint="Wat heb ik gedaan?" action={editBtn('Bewerken')} />
          {sprint.activities.length ? (
            <Card className="p-6">
              <ul className="space-y-3">
                {sprint.activities.map((a, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Placeholder>Werkzaamheden van deze sprint nog invullen.</Placeholder>
          )}
        </section>

        {/* 04 Bewijs */}
        <section>
          <SectionTitle
            id="bewijs"
            number={4}
            title="Bewijsstukken"
            hint="Per bewijsstuk zie je bij welke story het hoort en welke leeruitkomst het aantoont."
            action={
              editMode ? (
                <Button variant="ghost" onClick={() => setEvidence(blankEvidence(number))} className="!px-2.5 !py-1.5">
                  <Plus size={14} /> Bewijs
                </Button>
              ) : undefined
            }
          />
          {sprintEvidence.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {sprintEvidence.map((e) => (
                <EvidenceCard key={e.id} evidence={e} onEdit={setEvidence} />
              ))}
            </div>
          ) : (
            <EmptyState>Nog geen bewijsstukken voor deze sprint.</EmptyState>
          )}
        </section>

        {/* 05 Leeruitkomsten */}
        <section>
          <SectionTitle id="leeruitkomsten" number={5} title="Leeruitkomsten" hint="Welke leeruitkomsten komen in deze sprint aan bod, en waarmee?" />
          <Card className="divide-y divide-line">
            {LEARNING_OUTCOMES.map((lu) => {
              const luStories = stories.filter((s) => s.outcomes.includes(lu.code));
              const luEvidence = sprintEvidence.filter((e) => e.outcomes.includes(lu.code));
              return (
                <div key={lu.code} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_auto] md:items-center">
                  <div className="flex items-center gap-2">
                    <LuChip code={lu.code} />
                    <span className="text-sm font-semibold">{lu.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {luStories.map((s) => (
                      <a key={s.id} href={href.stories(s.id)} className="rounded-md bg-stone-100 px-2 py-0.5 font-semibold hover:bg-stone-200">
                        {storyCode(data, s)}
                      </a>
                    ))}
                    {luEvidence.map((e) => (
                      <a key={e.id} href={href.bewijs(e.id)} className="rounded-md bg-accent-soft px-2 py-0.5 font-semibold text-accent-strong hover:bg-accent hover:text-white">
                        {e.title}
                      </a>
                    ))}
                    {!luStories.length && !luEvidence.length && <span className="italic text-muted">Niet aan bod in deze sprint</span>}
                  </div>
                  <LevelBadge level={sprint.selfEvaluation[lu.code].level} />
                </div>
              );
            })}
          </Card>
        </section>

        {/* 06 Feedback */}
        <section>
          <SectionTitle id="feedback" number={6} title="Feedback" hint="Ontvangen van docenten, coach of medestudenten" action={editBtn('Bewerken')} />
          {sprint.feedback.length ? (
            <div className="space-y-3">
              {sprint.feedback.map((f) => (
                <Card key={f.id} className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <MessageSquare size={15} className="text-accent" />
                    <span className="font-bold">{f.from || 'Afzender onbekend'}</span>
                    {f.date && <span className="text-muted">· {formatDate(f.date)}</span>}
                  </div>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">Feedback</p>
                      <TextOrPlaceholder value={f.feedback} placeholder="Geen feedback ontvangen." />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">Mijn actie</p>
                      <TextOrPlaceholder value={f.action} placeholder="Actie nog invullen." />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Placeholder>Nog geen feedback vastgelegd voor deze sprint.</Placeholder>
          )}
        </section>

        {/* 07 Zelfevaluatie */}
        <section>
          <SectionTitle id="zelfevaluatie" number={7} title="Zelfevaluatie" hint="Mijn eigen beoordeling per leeruitkomst, met argumentatie en bewijs" action={editBtn('Bewerken')} />
          <div className="space-y-3">
            {LEARNING_OUTCOMES.map((lu) => {
              const ev = sprint.selfEvaluation[lu.code];
              return (
                <Card key={lu.code} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <LuChip code={lu.code} />
                      <span className="text-sm font-bold">{lu.title}</span>
                    </div>
                    <LevelBadge level={ev.level} />
                  </div>
                  <div className="mt-3">
                    <TextOrPlaceholder value={ev.argument} placeholder={ev.level === '-' ? 'Deze leeruitkomst is in deze sprint (nog) niet beoordeeld.' : 'Argumentatie en bewijs nog invullen.'} />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 08 Reflectie */}
        <section>
          <SectionTitle id="reflectie" number={8} title="Reflectie" hint={r.date ? `Vastgelegd op ${formatDate(r.date)}` : undefined} action={editBtn('Bewerken')} />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Wat heb ik geleerd?', r.learned],
              ['Wat behoud ik?', r.keep],
              ['Wat ga ik anders doen?', r.change],
            ].map(([q, a]) => (
              <Card key={q} className="p-5">
                <h3 className="mb-2 font-display text-lg font-semibold">{q}</h3>
                <TextOrPlaceholder value={a} placeholder="Nog invullen na afronding van de sprint." />
              </Card>
            ))}
          </div>
        </section>
      </div>

      <nav className="mt-16 grid gap-3 border-t border-line pt-6 sm:grid-cols-2" aria-label="Andere sprints">
        {prev ? (
          <a href={href.sprint(prev.number)} className="rounded-2xl border border-line bg-surface p-4 hover:border-stone-400">
            <span className="flex items-center gap-1 text-xs font-semibold text-muted">
              <ArrowLeft size={13} /> Vorige
            </span>
            <span className="mt-1 block font-bold">Sprint {prev.number}</span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={href.sprint(next.number)} className="rounded-2xl border border-line bg-surface p-4 text-right hover:border-stone-400">
            <span className="flex items-center justify-end gap-1 text-xs font-semibold text-muted">
              Volgende <ArrowRight size={13} />
            </span>
            <span className="mt-1 block font-bold">Sprint {next.number}</span>
          </a>
        )}
      </nav>

      {editingSprint && <SprintForm sprint={sprint} onClose={() => setEditingSprint(false)} />}
      {story && <StoryForm initial={story} onClose={() => setStory(null)} />}
      {evidence && <EvidenceForm initial={evidence} onClose={() => setEvidence(null)} />}
    </>
  );
}
