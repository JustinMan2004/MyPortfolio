import { ArrowLeft } from 'lucide-react';
import { LUCard } from '../components/Cards';
import { EvidenceCard } from '../components/EvidenceCard';
import { EmptyState, LevelIndicator, Paragraphs, SectionHeader, Text } from '../components/ui';
import { learningOutcomes } from '../content/learningOutcomes';
import { sprints } from '../content/sprints';
import { evidenceForLU, getLU, sprintsForLU } from '../lib/content';
import { href } from '../lib/router';
import { NotFound } from './NotFound';

export function LearningOutcomesPage() {
  return (
    <div className="container-page pt-10 sm:pt-14">
      <p className="eyebrow mb-2">Minor Futureproof met AI</p>
      <h1 className="h-page">Leeruitkomsten</h1>
      <p className="mt-2 max-w-2xl text-muted">
        De minor kent vijf leeruitkomsten. Klik op een leeruitkomst voor de omschrijving, mijn voortgang, de sprints
        waarin ik eraan heb gewerkt, mijn argumentatie en alle gekoppelde bewijsstukken.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learningOutcomes.map((lu) => (
          <LUCard key={lu.code} lu={lu} />
        ))}
      </div>
    </div>
  );
}

export function LearningOutcomeDetailPage({ code }: { code: string }) {
  const lu = getLU(code);
  if (!lu) return <NotFound />;

  const evidence = evidenceForLU(lu.code);
  const sprintNrs = sprintsForLU(lu.code);
  const evaluations = sprints
    .map((s) => ({ sprint: s.number, ev: s.selfEvaluation.find((e) => e.lu === lu.code) }))
    .filter((x) => x.ev);

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-page py-8 sm:py-12">
          <a href={href('/leeruitkomsten')} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Alle leeruitkomsten
          </a>
          <p className="eyebrow mt-4">{lu.code}</p>
          <h1 className="h-page mt-1 max-w-3xl">{lu.title}</h1>
          <p className="mt-3 max-w-3xl text-muted">{lu.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {learningOutcomes.map((l) => (
              <a
                key={l.code}
                href={href(`/leeruitkomsten/${l.code}`)}
                className={`chip px-3 py-1 text-sm ${
                  l.code === lu.code ? 'bg-accent text-white' : 'bg-stone-100 text-stone-700 hover:bg-accent-soft'
                }`}
              >
                {l.code}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page space-y-14 pt-10">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <p className="mb-3 text-sm font-medium text-muted">Mijn voortgang</p>
            <LevelIndicator level={lu.level} />
          </div>
          <div className="card p-5">
            <p className="mb-2 text-sm font-medium text-muted">Gewerkt in sprint</p>
            {sprintNrs.length === 0 ? (
              <p className="text-sm text-muted">Nog niet</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {sprintNrs.map((n) => (
                  <a key={n} href={href(`/sprints/${n}`)} className="chip bg-accent-soft px-2.5 py-1 text-sm text-accent-dark hover:bg-accent hover:text-white">
                    Sprint {n}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="card p-5">
            <p className="mb-1 text-sm font-medium text-muted">Bewijsstukken</p>
            <p className="text-2xl font-semibold text-ink">{evidence.length}</p>
          </div>
        </section>

        <section>
          <SectionHeader title="Mijn argumentatie" />
          <div className="card p-6">
            <Paragraphs items={lu.argumentation} />
          </div>
          {evaluations.length > 0 && (
            <div className="mt-4 card divide-y divide-line">
              {evaluations.map(({ sprint, ev }) => (
                <div key={sprint} className="grid gap-3 p-5 md:grid-cols-[200px_1fr]">
                  <div>
                    <a href={href(`/sprints/${sprint}`)} className="text-sm font-semibold text-accent hover:underline">
                      Zelfevaluatie sprint {sprint}
                    </a>
                    <div className="mt-2">
                      <LevelIndicator level={ev!.level} />
                    </div>
                  </div>
                  <p className="text-sm text-ink/90">
                    <Text>{ev!.argumentation}</Text>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Gekoppelde bewijsstukken" description={`Alle bewijsstukken waarmee ik ${lu.code} aantoon, per sprint.`} />
          {evidence.length === 0 ? (
            <EmptyState>Nog geen bewijs gekoppeld aan {lu.code}.</EmptyState>
          ) : (
            <div className="space-y-10">
              {sprintNrs
                .filter((n) => evidence.some((e) => e.sprint === n))
                .map((n) => (
                  <div key={n}>
                    <h3 className="mb-3 text-sm font-semibold text-muted">
                      <a href={href(`/sprints/${n}`)} className="hover:text-accent">
                        Sprint {n}
                      </a>
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {evidence
                        .filter((e) => e.sprint === n)
                        .map((e) => (
                          <EvidenceCard key={e.id} evidence={e} showSprint={false} />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
