import { ChevronDown } from 'lucide-react';
import type { Story } from '../content/types';
import { evidenceForStory } from '../lib/content';
import { BulletList, Label, LUChip, Paragraphs, StoryTypeBadge, Text } from './ui';

const STATUS_LABEL = { gepland: 'Gepland', bezig: 'Bezig', afgerond: 'Afgerond' } as const;

export function StoryCard({ story, open = false }: { story: Story; open?: boolean }) {
  const evidence = evidenceForStory(story.id);

  return (
    <details id={story.id} open={open} className="card group scroll-mt-32 overflow-hidden">
      <summary className="flex items-start gap-4 p-5 hover:bg-page/60">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StoryTypeBadge type={story.type} long />
            {story.status && <span className="text-xs text-muted">{STATUS_LABEL[story.status]}</span>}
          </div>
          <h3 className="font-semibold leading-snug text-ink">{story.title}</h3>
          <p className="mt-1.5 text-sm italic text-muted">
            <Text>{story.description}</Text>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {story.learningOutcomes.map((c) => (
              <LUChip key={c} code={c} />
            ))}
            <span className="ml-1 text-xs text-muted">
              {evidence.length} bewijsstuk{evidence.length === 1 ? '' : 'ken'}
            </span>
          </div>
        </div>
        <span className="mt-1 flex flex-none items-center gap-1 text-xs font-medium text-accent">
          <span className="hidden sm:inline group-open:hidden">Details</span>
          <span className="hidden sm:group-open:inline">Sluiten</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
        </span>
      </summary>

      <div className="grid gap-6 border-t border-line bg-page/40 p-5 md:grid-cols-2">
        {story.context && (
          <div className="md:col-span-2">
            <Label>Context</Label>
            <Paragraphs items={[story.context]} className="text-sm" />
          </div>
        )}
        <div>
          <Label>Aanpak – wat heb ik gedaan?</Label>
          <BulletList items={story.approach} />
        </div>
        <div>
          <Label>Resultaat – wat heb ik opgeleverd of geleerd?</Label>
          <BulletList items={story.result} />
        </div>
        <div>
          <Label>Acceptatiecriteria</Label>
          <BulletList items={story.acceptanceCriteria} icon="check" />
        </div>
        <div>
          <Label>Kwaliteitscriteria</Label>
          <BulletList items={story.qualityCriteria} icon="check" />
        </div>
        <div className="md:col-span-2">
          <Label>Gekoppelde bewijsstukken</Label>
          {evidence.length === 0 ? (
            <p className="text-sm text-muted">Nog geen bewijs gekoppeld.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {evidence.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => document.getElementById(e.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="btn-secondary btn py-1.5 text-xs"
                  >
                    {e.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </details>
  );
}
