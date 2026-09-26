import { SprintCard } from '../components/sprints';
import { PageHeader, StatusBadge } from '../components/ui';
import { SPRINT_STATUS_ORDER } from '../lib/constants';
import { href } from '../lib/router';
import { useStore } from '../lib/store';

export function SprintsPage() {
  const { data, editMode } = useStore();
  const counts = SPRINT_STATUS_ORDER.map((st) => ({ st, n: data.sprints.filter((s) => s.status === st).length }));

  return (
    <>
      <PageHeader
        eyebrow="Sprintoverzicht"
        title="Acht sprints, één vaste opbouw"
        intro={
          <>
            Iedere sprint van twee weken heeft dezelfde indeling: introductie, stories, werkzaamheden, bewijsstukken,
            leeruitkomsten, feedback, zelfevaluatie en reflectie.
            {!editMode && (
              <>
                {' '}
                De status pas je aan in{' '}
                <a href={href.beheer} className="font-semibold text-accent hover:underline">
                  beheermodus
                </a>
                .
              </>
            )}
          </>
        }
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {counts.map(({ st, n }) => (
          <span key={st} className="inline-flex items-center gap-2 text-sm text-muted">
            <StatusBadge status={st} /> <span className="font-semibold tabular-nums">{n}</span>
          </span>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.sprints.map((s) => (
          <SprintCard key={s.number} sprint={s} />
        ))}
      </div>
    </>
  );
}
