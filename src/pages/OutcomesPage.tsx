import { ArrowLeft, ArrowRight } from 'lucide-react';
import { EvidenceCard } from '../components/evidence';
import { StoryCard } from '../components/stories';
import { Card, EmptyState, LevelBadge, PageHeader, ProgressBar, SectionTitle, cx } from '../components/ui';
import { LEARNING_OUTCOMES, TOTAL_REQUIRED, luDef } from '../lib/constants';
import { href } from '../lib/router';
import { achievedCount, achievedPerLu, evidenceForLu, storiesForLu, totalAchieved, totalProgress } from '../lib/selectors';
import { useStore } from '../lib/store';
import type { LuCode, LuLevel } from '../lib/types';

const CELL: Record<LuLevel, string> = {
  V: 'bg-emerald-600 text-white',
  O: 'bg-rose-100 text-rose-700',
  '-': 'bg-stone-100 text-stone-400',
};

function Norms() {
  return (
    <Card className="p-6">
      <h2 className="font-bold">Beoordelingsnormen & Show and Tell-cyclus</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Per sprint van twee weken presenteer ik tijdens de Show and Tell minimaal drie bewijzen van verschillende leeruitkomsten.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-stone-50 p-4 ring-1 ring-line">
          <p className="text-sm font-bold">Op niveau (voldoende)</p>
          <p className="mt-1 text-sm text-muted">
            Minimaal 24× een leeruitkomst laten beoordelen, met minimaal LU1: 2×, LU2: 4×, LU3: 2×, LU4: 4×, LU5: 6×. Maximaal 1 sprint gemist.
          </p>
        </div>
        <div className="rounded-xl bg-accent-soft p-4 ring-1 ring-accent/20">
          <p className="text-sm font-bold text-accent-strong">Boven niveau (goed)</p>
          <p className="mt-1 text-sm text-muted">
            Minimaal 24× voldoende, geen sprint gemist, proactieve kennisdeling en overtuigende diepgang in de opdrachten.
          </p>
        </div>
      </div>
    </Card>
  );
}

function Matrix() {
  const { data } = useStore();
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs font-bold uppercase tracking-wider text-muted">
            <th className="px-4 py-3">Leeruitkomst</th>
            {data.sprints.map((s) => (
              <th key={s.number} className="px-1 py-3 text-center">
                <a href={href.sprint(s.number)} className="hover:text-accent">
                  S{s.number}
                </a>
              </th>
            ))}
            <th className="px-4 py-3 text-right">Behaald</th>
          </tr>
        </thead>
        <tbody>
          {LEARNING_OUTCOMES.map((lu) => {
            const n = achievedCount(data, lu.code);
            return (
              <tr key={lu.code} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <a href={href.leeruitkomsten(lu.code)} className="font-semibold hover:text-accent">
                    {lu.code.replace('LU', 'LU ')}: {lu.short}
                  </a>
                </td>
                {data.sprints.map((s) => {
                  const level = s.selfEvaluation[lu.code].level;
                  return (
                    <td key={s.number} className="px-1 py-3 text-center">
                      <span
                        className={cx('inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold', CELL[level])}
                        title={`Sprint ${s.number}: ${level === 'V' ? 'Voldoende' : level === 'O' ? 'Onvoldoende' : 'Niet beoordeeld'}`}
                      >
                        {level}
                      </span>
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  <span className={n >= lu.required ? 'text-emerald-700' : ''}>{n}</span>
                  <span className="text-muted">/{lu.required}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-line px-4 py-3 text-xs text-muted">
        V = voldoende · O = onvoldoende · – = niet beoordeeld. Gebaseerd op mijn zelfevaluatie per sprint.
      </p>
    </Card>
  );
}

function OutcomeDetail({ code }: { code: LuCode }) {
  const { data } = useStore();
  const lu = luDef(code);
  const n = achievedCount(data, code);
  const stories = storiesForLu(data, code);
  const evidence = evidenceForLu(data, code);
  const idx = LEARNING_OUTCOMES.findIndex((l) => l.code === code);
  const evaluated = data.sprints.filter((s) => s.selfEvaluation[code].level !== '-' || s.selfEvaluation[code].argument.trim());

  return (
    <>
      <a href={href.leeruitkomsten()} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft size={15} /> Alle leeruitkomsten
      </a>
      <PageHeader eyebrow={`${code.replace('LU', 'Leeruitkomst ')} · ${lu.short}`} title={lu.title} intro={lu.description} />

      <Card className="mb-12 p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">Aantal keer voldoende</span>
          <span className="font-display text-3xl font-semibold tabular-nums">
            {n}
            <span className="text-lg text-muted">/{lu.required}</span>
          </span>
        </div>
        <ProgressBar value={n} max={lu.required} className="mt-3" />
        <p className="mt-2 text-xs text-muted">
          {n >= lu.required ? 'Minimum voor “Op niveau” behaald.' : `Nog ${lu.required - n}× voldoende nodig voor “Op niveau”.`}
        </p>
      </Card>

      <div className="space-y-14">
        <section>
          <SectionTitle title="Zelfevaluatie per sprint" hint="Argumentatie en bewijs zoals vastgelegd in mijn logboek" />
          {evaluated.length ? (
            <div className="space-y-3">
              {evaluated.map((s) => (
                <Card key={s.number} className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <a href={href.sprint(s.number)} className="font-bold hover:text-accent">
                      Sprint {s.number}
                    </a>
                    <LevelBadge level={s.selfEvaluation[code].level} />
                  </div>
                  {s.selfEvaluation[code].argument && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{s.selfEvaluation[code].argument}</p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState>Deze leeruitkomst is nog in geen enkele sprint beoordeeld.</EmptyState>
          )}
        </section>

        <section>
          <SectionTitle title={`Bewijsstukken (${evidence.length})`} />
          {evidence.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {evidence.map((e) => (
                <EvidenceCard key={e.id} evidence={e} />
              ))}
            </div>
          ) : (
            <EmptyState>Nog geen bewijs gekoppeld aan deze leeruitkomst.</EmptyState>
          )}
        </section>

        <section>
          <SectionTitle title={`Gekoppelde stories (${stories.length})`} />
          {stories.length ? (
            <div className="space-y-3">
              {stories.map((s) => (
                <StoryCard key={s.id} story={s} showSprint />
              ))}
            </div>
          ) : (
            <EmptyState>Nog geen stories gekoppeld aan deze leeruitkomst.</EmptyState>
          )}
        </section>
      </div>

      <nav className="mt-16 flex justify-between border-t border-line pt-6 text-sm font-semibold">
        {idx > 0 ? (
          <a href={href.leeruitkomsten(LEARNING_OUTCOMES[idx - 1].code)} className="inline-flex items-center gap-1 text-accent hover:underline">
            <ArrowLeft size={14} /> {LEARNING_OUTCOMES[idx - 1].code.replace('LU', 'LU ')}
          </a>
        ) : (
          <span />
        )}
        {idx < LEARNING_OUTCOMES.length - 1 && (
          <a href={href.leeruitkomsten(LEARNING_OUTCOMES[idx + 1].code)} className="inline-flex items-center gap-1 text-accent hover:underline">
            {LEARNING_OUTCOMES[idx + 1].code.replace('LU', 'LU ')} <ArrowRight size={14} />
          </a>
        )}
      </nav>
    </>
  );
}

export function OutcomesPage({ code }: { code?: string }) {
  const { data } = useStore();
  const match = LEARNING_OUTCOMES.find((l) => l.code === code?.toUpperCase());
  if (match) return <OutcomeDetail code={match.code} />;

  const perLu = achievedPerLu(data);
  const achieved = totalAchieved(data);

  return (
    <>
      <PageHeader
        eyebrow="Eindtermen & assessment"
        title="De vijf leeruitkomsten"
        intro="Mijn voortgang per leeruitkomst, gebaseerd op de zelfevaluatie in iedere sprint, met het bewijs en de stories die erbij horen."
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card className="flex flex-col justify-center p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Totale voortgang</p>
          <p className="mt-2 font-display text-5xl font-semibold tabular-nums">
            {achieved}
            <span className="text-2xl text-muted">/{TOTAL_REQUIRED}</span>
          </p>
          <ProgressBar value={totalProgress(data)} max={TOTAL_REQUIRED} className="mt-4" />
          <p className="mt-2 text-xs text-muted">Keer een leeruitkomst als voldoende beoordeeld</p>
        </Card>
        <Norms />
      </div>

      <section className="mb-12">
        <SectionTitle title="Overzicht per sprint" hint="Hetzelfde overzicht als het dashboard in mijn logboek" />
        <Matrix />
      </section>

      <section>
        <SectionTitle title="Per leeruitkomst" />
        <div className="grid gap-4 md:grid-cols-2">
          {perLu.map((lu) => {
            const ev = evidenceForLu(data, lu.code).length;
            const st = storiesForLu(data, lu.code).length;
            const status = lu.achieved >= lu.required ? 'Op niveau' : lu.achieved > 0 ? 'In ontwikkeling' : 'Nog niet aangetoond';
            return (
              <a key={lu.code} href={href.leeruitkomsten(lu.code)} className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition hover:border-stone-400 hover:shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft font-display text-sm font-semibold text-accent-strong">
                    {lu.code.replace('LU', 'LU ')}
                  </span>
                  <div>
                    <h3 className="font-bold leading-snug">{lu.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted">
                      {status} · {st} stories · {ev} bewijsstukken
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{lu.description}</p>
                <div className="mt-auto pt-5">
                  <div className="mb-1.5 flex justify-between text-xs font-semibold">
                    <span>Voldoende</span>
                    <span className="tabular-nums">
                      {lu.achieved}/{lu.required}
                    </span>
                  </div>
                  <ProgressBar value={lu.achieved} max={lu.required} />
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent group-hover:gap-2">
                    Bekijk bewijs & onderbouwing <ArrowRight size={15} className="transition-all" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
