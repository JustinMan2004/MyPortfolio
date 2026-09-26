import { ArrowRight } from 'lucide-react';
import type { LearningOutcome, Sprint } from '../content/types';
import { evidenceForLU, isPlaceholder, sprintsForLU } from '../lib/content';
import { href } from '../lib/router';
import { LevelIndicator, StatusBadge } from './ui';

export function SprintCard({ sprint }: { sprint: Sprint }) {
  const planned = sprint.status === 'gepland';
  const title = isPlaceholder(sprint.title) ? 'Nog in te vullen' : sprint.title;
  return (
    <a
      href={href(`/sprints/${sprint.number}`)}
      className={`card card-hover group flex flex-col p-5 ${planned ? 'bg-white/70' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-accent">Sprint {sprint.number}</span>
        <StatusBadge status={sprint.status} />
      </div>
      <h3 className={`font-semibold leading-snug ${planned ? 'text-muted' : 'text-ink'}`}>{title}</h3>
      {sprint.summary && <p className="mt-1.5 line-clamp-3 text-sm text-muted">{sprint.summary}</p>}
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
        <span>
          {sprint.stories.length} stories · {sprint.evidence.length} bewijs
        </span>
        <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
    </a>
  );
}

export function LUCard({ lu }: { lu: LearningOutcome }) {
  const evidence = evidenceForLU(lu.code);
  const sprintNrs = sprintsForLU(lu.code);
  return (
    <a href={href(`/leeruitkomsten/${lu.code}`)} className="card card-hover group flex flex-col p-5">
      <span className="mb-2 text-sm font-semibold text-accent">{lu.code}</span>
      <h3 className="font-semibold leading-snug text-ink">{lu.title}</h3>
      <div className="mt-4">
        <LevelIndicator level={lu.level} />
      </div>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
        <span>
          {evidence.length} bewijsstuk{evidence.length === 1 ? '' : 'ken'}
          {sprintNrs.length > 0 && ` · sprint ${sprintNrs.join(', ')}`}
        </span>
        <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
    </a>
  );
}
