import { ArrowRight, GraduationCap, MapPin } from 'lucide-react';
import { LUCard, SprintCard } from '../components/Cards';
import { EvidenceCard } from '../components/EvidenceCard';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { LevelIndicator, SectionHeader } from '../components/ui';
import { learningOutcomes } from '../content/learningOutcomes';
import { profile } from '../content/profile';
import { sprints } from '../content/sprints';
import { allEvidence, allStories, evidenceForLU } from '../lib/content';
import { href } from '../lib/router';

export function HomePage() {
  const done = sprints.filter((s) => s.status === 'afgerond').length;
  const current = sprints.find((s) => s.status === 'bezig');
  const featured = allEvidence.filter((e) => e.featured);
  const highlighted = (featured.length > 0 ? featured : [...allEvidence].reverse()).slice(0, 3);

  return (
    <>
      {/* Intro */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Portfolio minor {profile.minor}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{profile.name}</h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-accent" aria-hidden />
                {profile.study} · {profile.school} {profile.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-accent" aria-hidden />
                {profile.residence}
              </span>
            </div>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{profile.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={href(current ? `/sprints/${current.number}` : '/sprints')} className="btn btn-primary">
                {current ? `Bekijk Sprint ${current.number}` : 'Bekijk de sprints'}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href={href('/leeruitkomsten')} className="btn btn-secondary">
                Leeruitkomsten
              </a>
              <a href={href('/over-mij')} className="btn btn-secondary">
                Over mij
              </a>
            </div>
          </div>
          <ProfilePhoto className="hidden h-44 w-44 md:flex lg:h-52 lg:w-52" />
        </div>
      </section>

      <div className="container-page space-y-16 pt-12">
        {/* Voortgang */}
        <section>
          <SectionHeader eyebrow="Overzicht" title="Mijn voortgang" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat value={`${done}/${sprints.length}`} label="Sprints afgerond" sub={current ? `Nu bezig: Sprint ${current.number}` : undefined} />
            <Stat value={String(allStories.length)} label="Stories" sub="User, Research & Learning" />
            <Stat value={String(allEvidence.length)} label="Bewijsstukken" sub="Gekoppeld aan stories en LU's" />
          </div>
          <div className="card mt-4 divide-y divide-line">
            {learningOutcomes.map((lu) => (
              <a
                key={lu.code}
                href={href(`/leeruitkomsten/${lu.code}`)}
                className="flex flex-col gap-2 px-5 py-3.5 hover:bg-page/60 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="flex-1 text-sm">
                  <span className="mr-2 font-semibold text-accent">{lu.code}</span>
                  <span className="text-ink">{lu.title}</span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="w-20 text-xs text-muted sm:text-right">{evidenceForLU(lu.code).length} bewijs</span>
                  <span className="sm:w-52">
                    <LevelIndicator level={lu.level} />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Sprints */}
        <section>
          <SectionHeader
            eyebrow="8 sprints"
            title="Sprints"
            action={
              <a href={href('/sprints')} className="text-sm font-medium text-accent hover:underline">
                Alle sprints →
              </a>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sprints.map((s) => (
              <SprintCard key={s.number} sprint={s} />
            ))}
          </div>
        </section>

        {/* Leeruitkomsten */}
        <section>
          <SectionHeader
            eyebrow="5 leeruitkomsten"
            title="Leeruitkomsten"
            action={
              <a href={href('/leeruitkomsten')} className="text-sm font-medium text-accent hover:underline">
                Alle leeruitkomsten →
              </a>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {learningOutcomes.map((lu) => (
              <LUCard key={lu.code} lu={lu} />
            ))}
          </div>
        </section>

        {/* Bewijs */}
        {highlighted.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Bewijs"
              title="Belangrijke bewijsstukken"
              action={
                <a href={href('/bewijs')} className="text-sm font-medium text-accent hover:underline">
                  Al het bewijs →
                </a>
              }
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highlighted.map((e) => (
                <EvidenceCard key={e.id} evidence={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="card p-5">
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="text-sm font-medium text-ink">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}
