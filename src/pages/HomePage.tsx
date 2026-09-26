import { ArrowRight, Award, BookOpen, FolderOpen, Layers } from 'lucide-react';
import { EvidenceCard } from '../components/evidence';
import { sprintTitle } from '../components/sprints';
import { Card, LuChip, ProgressBar, cx } from '../components/ui';
import { SPRINT_STATUS, TOTAL_REQUIRED } from '../lib/constants';
import { href } from '../lib/router';
import { achievedPerLu, totalAchieved, totalProgress } from '../lib/selectors';
import { useStore } from '../lib/store';

export function HomePage() {
  const { data } = useStore();
  const { profile, sprints } = data;
  const done = sprints.filter((s) => s.status === 'voltooid').length;
  const current = sprints.find((s) => s.status === 'bezig');
  const perLu = achievedPerLu(data);
  const recent = [...data.evidence].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.sprint - a.sprint).slice(0, 3);

  const quick = [
    { to: href.sprints, icon: Layers, title: 'Sprints', text: 'Per sprint: stories, werk, bewijs, feedback en reflectie.', count: `${done}/8 voltooid` },
    { to: href.stories(), icon: BookOpen, title: 'Stories', text: 'Wat ik onderzocht (RS), maakte (US) en leerde (LS).', count: `${data.stories.length} stories` },
    { to: href.leeruitkomsten(), icon: Award, title: 'Leeruitkomsten', text: 'Voortgang per LU met bijbehorend bewijs.', count: `${totalAchieved(data)}/${TOTAL_REQUIRED} voldoende` },
    { to: href.bewijs(), icon: FolderOpen, title: 'Bewijs', text: 'Alle bewijsstukken, te filteren op sprint en LU.', count: `${data.evidence.length} stukken` },
  ];

  return (
    <div className="space-y-14">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
            Minor {profile.minor} {profile.schoolYear && `· ${profile.schoolYear}`}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Hoi, ik ben {profile.name.split(' ')[0]}.
            <span className="block text-muted">
              Student {profile.study} en toekomstig {profile.profession.toLowerCase()}.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">{profile.intro}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={href.sprints} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong">
              Bekijk de sprints <ArrowRight size={16} />
            </a>
            <a href={href.overMij} className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold hover:border-stone-400">
              Over mij
            </a>
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Stand van zaken</h2>
          <div className="mt-4 space-y-5">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">Sprints voltooid</span>
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {done}
                  <span className="text-base text-muted">/8</span>
                </span>
              </div>
              <ProgressBar value={done} max={8} className="mt-2" />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">Leeruitkomsten voldoende</span>
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {totalAchieved(data)}
                  <span className="text-base text-muted">/{TOTAL_REQUIRED}</span>
                </span>
              </div>
              <ProgressBar value={totalProgress(data)} max={TOTAL_REQUIRED} className="mt-2" />
              <p className="mt-1.5 text-xs text-muted">Minimaal {TOTAL_REQUIRED}× voldoende nodig voor “Op niveau”.</p>
            </div>
            {current && (
              <a href={href.sprint(current.number)} className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200 hover:ring-amber-300">
                <span>
                  <span className="block text-xs font-semibold text-amber-900">Nu bezig</span>
                  <span className="block text-sm font-bold">Sprint {current.number}</span>
                </span>
                <ArrowRight size={16} className="text-amber-900" />
              </a>
            )}
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold tracking-tight">Snel naar</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map(({ to, icon: Icon, title, text, count }) => (
            <a key={title} href={to} className="group rounded-2xl border border-line bg-surface p-5 transition hover:border-stone-400 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={18} />
                </span>
                <span className="text-xs font-semibold text-muted">{count}</span>
              </div>
              <h3 className="mt-4 flex items-center gap-1 font-bold">
                {title} <ArrowRight size={15} className="opacity-0 transition group-hover:opacity-100" />
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">De 8 sprints</h2>
          <a href={href.sprints} className="text-sm font-semibold text-accent hover:underline">
            Alle sprints →
          </a>
        </div>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {sprints.map((s) => (
            <li key={s.number}>
              <a
                href={href.sprint(s.number)}
                className={cx(
                  'flex h-full flex-col rounded-xl border bg-surface p-3 transition hover:border-stone-400',
                  s.status === 'bezig' ? 'border-amber-300' : 'border-line',
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold tabular-nums">{s.number}</span>
                  <span className={cx('h-2.5 w-2.5 rounded-full', SPRINT_STATUS[s.status].dot)} title={SPRINT_STATUS[s.status].label} />
                </span>
                <span className="mt-1 text-xs font-semibold text-muted">{SPRINT_STATUS[s.status].label}</span>
                <span className="mt-1 line-clamp-2 text-xs text-ink">{s.title ? sprintTitle(s) : ''}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold tracking-tight">Leeruitkomsten</h2>
            <a href={href.leeruitkomsten()} className="text-sm font-semibold text-accent hover:underline">
              Details →
            </a>
          </div>
          <ul className="space-y-4">
            {perLu.map((lu) => (
              <li key={lu.code}>
                <a href={href.leeruitkomsten(lu.code)} className="block rounded-lg hover:bg-stone-50">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <LuChip code={lu.code} link={false} />
                      <span className="truncate text-muted">{lu.title}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">
                      {lu.achieved}/{lu.required}
                    </span>
                  </div>
                  <ProgressBar value={lu.achieved} max={lu.required} className="mt-2" />
                </a>
              </li>
            ))}
          </ul>
        </Card>

        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recent bewijs</h2>
            <a href={href.bewijs()} className="text-sm font-semibold text-accent hover:underline">
              Alle bewijzen →
            </a>
          </div>
          <div className="space-y-3">
            {recent.map((e) => (
              <EvidenceCard key={e.id} evidence={e} compact />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
