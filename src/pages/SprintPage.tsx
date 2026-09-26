import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SprintCard } from '../components/Cards';
import { EvidenceCard } from '../components/EvidenceCard';
import { StoryCard } from '../components/StoryCard';
import {
  BulletList,
  EmptyState,
  Label,
  LevelIndicator,
  LUChip,
  Paragraphs,
  SectionHeader,
  StatusBadge,
  StoryTypeBadge,
  Text,
} from '../components/ui';
import { learningOutcomes } from '../content/learningOutcomes';
import { sprints } from '../content/sprints';
import type { Sprint } from '../content/types';
import { formatDate, getEvidence, getSprint, isPlaceholder, lusForSprint } from '../lib/content';
import { href } from '../lib/router';
import { NotFound } from './NotFound';

export function SprintsPage() {
  return (
    <div className="container-page pt-10 sm:pt-14">
      <p className="eyebrow mb-2">Minor Futureproof met AI</p>
      <h1 className="h-page">Sprints</h1>
      <p className="mt-2 max-w-2xl text-muted">
        De minor bestaat uit acht sprints. Per sprint vind je een overzicht, de stories, het bewijs, de aangetoonde
        leeruitkomsten, ontvangen feedback, mijn zelfevaluatie en reflectie.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sprints.map((s) => (
          <SprintCard key={s.number} sprint={s} />
        ))}
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: 'overzicht', label: 'Overzicht' },
  { id: 'stories', label: 'Stories' },
  { id: 'bewijs', label: 'Bewijs' },
  { id: 'leeruitkomsten', label: 'Leeruitkomsten' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'zelfevaluatie', label: 'Zelfevaluatie' },
  { id: 'reflectie', label: 'Reflectie' },
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export function SprintPage({ number, openStory }: { number: number; openStory?: string | null }) {
  const sprint = getSprint(number);

  useEffect(() => {
    if (openStory) setTimeout(() => scrollTo(openStory), 50);
  }, [openStory, number]);

  if (!sprint) return <NotFound />;

  const index = sprints.indexOf(sprint);
  const prev = sprints[index - 1];
  const next = sprints[index + 1];
  const title = isPlaceholder(sprint.title) ? 'Thema volgt' : sprint.title;

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-page pb-0 pt-8 sm:pt-12">
          <a href={href('/sprints')} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Alle sprints
          </a>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="eyebrow">Sprint {sprint.number}</p>
            <StatusBadge status={sprint.status} />
            {sprint.period && (
              <span className="text-sm text-muted">
                <Text>{sprint.period}</Text>
              </span>
            )}
          </div>
          <h1 className="h-page mt-2 max-w-3xl">{title}</h1>
          {sprint.summary && <p className="mt-2 max-w-3xl text-muted">{sprint.summary}</p>}
          <SectionNav />
        </div>
      </section>

      <div className="container-page space-y-14 pt-10">
        {sprint.status === 'gepland' && sprint.stories.length === 0 && (
          <EmptyState>
            Deze sprint is nog niet begonnen. Zodra de sprint loopt, verschijnen hier de stories, het bewijs, de
            feedback, zelfevaluatie en reflectie.
          </EmptyState>
        )}
        <Overview sprint={sprint} />
        <Stories sprint={sprint} openStory={openStory} />
        <EvidenceSection sprint={sprint} />
        <LearningOutcomesSection sprint={sprint} />
        <FeedbackSection sprint={sprint} />
        <SelfEvaluationSection sprint={sprint} />
        <ReflectionSection sprint={sprint} />

        <nav className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:justify-between" aria-label="Sprintnavigatie">
          {prev ? (
            <a href={href(`/sprints/${prev.number}`)} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Sprint {prev.number}
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={href(`/sprints/${next.number}`)} className="btn btn-secondary">
              Sprint {next.number} <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          )}
        </nav>
      </div>
    </>
  );
}

/** Tabs die meescrollen en naar de sectie springen. */
function SectionNav() {
  const [active, setActive] = useState('overzicht');

  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 160) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-16 z-30 -mx-4 mt-6 overflow-x-auto bg-white px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-1">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className={`border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
              active === s.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <span className="mr-1 text-xs opacity-60">{i + 1}.</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Overview({ sprint }: { sprint: Sprint }) {
  return (
    <section>
      <SectionHeader id="overzicht" eyebrow="1" title="Overzicht" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          {sprint.overview.length > 0 ? (
            <Paragraphs items={sprint.overview} />
          ) : (
            <p className="text-sm text-muted">Nog geen introductie toegevoegd.</p>
          )}
        </div>
        <div className="card p-6">
          <Label>Onderwerpen & tools</Label>
          {sprint.topics.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {sprint.topics.map((t) => (
                <span key={t} className="chip bg-stone-100 text-stone-700">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">—</p>
          )}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-5 text-center">
            {(['US', 'RS', 'LS'] as const).map((t) => (
              <div key={t}>
                <p className="text-lg font-semibold text-ink">{sprint.stories.filter((s) => s.type === t).length}</p>
                <StoryTypeBadge type={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stories({ sprint, openStory }: { sprint: Sprint; openStory?: string | null }) {
  return (
    <section>
      <SectionHeader
        id="stories"
        eyebrow="2"
        title="Stories"
        description="User Stories (US), Research Stories (RS) en Learning Stories (LS). Klik op een story voor aanpak, resultaat, criteria en bewijs."
      />
      {sprint.stories.length === 0 ? (
        <EmptyState>Nog geen stories voor deze sprint.</EmptyState>
      ) : (
        <div className="space-y-3">
          {sprint.stories.map((s) => (
            <StoryCard key={s.id} story={s} open={openStory === s.id} />
          ))}
        </div>
      )}
    </section>
  );
}

function EvidenceSection({ sprint }: { sprint: Sprint }) {
  return (
    <section>
      <SectionHeader id="bewijs" eyebrow="3" title="Bewijs" description="Alle bewijsstukken van deze sprint." />
      {sprint.evidence.length === 0 ? (
        <EmptyState>Nog geen bewijs toegevoegd.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sprint.evidence.map((e) => (
            <EvidenceCard key={e.id} evidence={{ ...e, sprint: sprint.number }} showSprint={false} />
          ))}
        </div>
      )}
    </section>
  );
}

function LearningOutcomesSection({ sprint }: { sprint: Sprint }) {
  const items = lusForSprint(sprint);
  return (
    <section>
      <SectionHeader
        id="leeruitkomsten"
        eyebrow="4"
        title="Leeruitkomsten"
        description="Aan welke leeruitkomsten ik in deze sprint heb gewerkt, via welke stories en met hoeveel bewijs."
      />
      {items.length === 0 ? (
        <EmptyState>Nog geen leeruitkomsten gekoppeld.</EmptyState>
      ) : (
        <div className="card divide-y divide-line">
          {items.map(({ lu, stories, evidence }) => (
            <div key={lu.code} className="grid gap-3 p-5 md:grid-cols-[1fr_1.2fr_auto] md:items-center">
              <a href={href(`/leeruitkomsten/${lu.code}`)} className="group">
                <span className="text-sm font-semibold text-accent">{lu.code}</span>
                <p className="text-sm font-medium text-ink group-hover:text-accent">{lu.title}</p>
              </a>
              <div className="flex flex-wrap gap-1.5">
                {stories.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-ink hover:border-accent/40"
                  >
                    <StoryTypeBadge type={s.type} />
                    <span className="max-w-56 truncate">{s.title}</span>
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted md:text-right">
                {evidence.length} bewijsstuk{evidence.length === 1 ? '' : 'ken'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FeedbackSection({ sprint }: { sprint: Sprint }) {
  return (
    <section>
      <SectionHeader id="feedback" eyebrow="5" title="Feedback" description="Ontvangen feedback en wat ik ermee heb gedaan." />
      {sprint.feedback.length === 0 ? (
        <EmptyState>Nog geen feedback toegevoegd.</EmptyState>
      ) : (
        <div className="space-y-3">
          {sprint.feedback.map((f, i) => (
            <div key={i} className="card grid gap-5 p-5 md:grid-cols-[200px_1fr_1fr]">
              <div>
                <Label>Van wie</Label>
                <p className="text-sm font-medium text-ink">
                  <Text>{f.from}</Text>
                </p>
                {f.date && <p className="mt-1 text-xs text-muted">{formatDate(f.date)}</p>}
              </div>
              <div>
                <Label>Feedback</Label>
                <p className="text-sm text-ink/90">
                  <Text>{f.feedback}</Text>
                </p>
              </div>
              <div className="rounded-xl bg-accent-soft/50 p-4">
                <Label>Mijn actie</Label>
                <p className="text-sm text-ink/90">
                  <Text>{f.action}</Text>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SelfEvaluationSection({ sprint }: { sprint: Sprint }) {
  return (
    <section>
      <SectionHeader
        id="zelfevaluatie"
        eyebrow="6"
        title="Zelfevaluatie"
        description="Mijn inschatting per leeruitkomst aan het einde van deze sprint."
      />
      {sprint.selfEvaluation.length === 0 ? (
        <EmptyState>Nog geen zelfevaluatie ingevuld.</EmptyState>
      ) : (
        <div className="card divide-y divide-line">
          {learningOutcomes.map((lu) => {
            const ev = sprint.selfEvaluation.find((s) => s.lu === lu.code);
            if (!ev) return null;
            return (
              <div key={lu.code} className="grid gap-4 p-5 lg:grid-cols-[240px_1fr_260px]">
                <div>
                  <LUChip code={lu.code} />
                  <p className="mt-1.5 text-sm font-medium text-ink">{lu.title}</p>
                  <div className="mt-3">
                    <LevelIndicator level={ev.level} />
                  </div>
                </div>
                <div>
                  <Label>Argumentatie</Label>
                  <p className="text-sm text-ink/90">
                    <Text>{ev.argumentation}</Text>
                  </p>
                </div>
                <div>
                  <Label>Bewijs</Label>
                  {ev.evidenceIds.length === 0 ? (
                    <p className="text-sm text-muted">—</p>
                  ) : (
                    <ul className="space-y-1">
                      {ev.evidenceIds.map((id) => {
                        const e = getEvidence(id);
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              onClick={() => scrollTo(id)}
                              className="text-left text-sm text-accent hover:underline"
                            >
                              {e ? e.title : `Onbekend bewijs: ${id}`}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ReflectionSection({ sprint }: { sprint: Sprint }) {
  const { learned, keep, improve } = sprint.reflection;
  const empty = learned.length + keep.length + improve.length === 0;
  return (
    <section>
      <SectionHeader id="reflectie" eyebrow="7" title="Reflectie" />
      {empty ? (
        <EmptyState>Nog geen reflectie ingevuld.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <ReflectionCard title="Wat heb ik geleerd?" items={learned} />
          <ReflectionCard title="Wat wil ik behouden?" items={keep} />
          <ReflectionCard title="Wat ga ik de volgende keer anders doen?" items={improve} />
        </div>
      )}
    </section>
  );
}

function ReflectionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-5">
      <h3 className="mb-3 font-semibold text-ink">{title}</h3>
      <BulletList items={items} />
    </div>
  );
}
