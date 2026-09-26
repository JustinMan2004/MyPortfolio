import {
  Download,
  ExternalLink,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  Github,
  Globe,
  Link2,
  Presentation,
  ScrollText,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { EvidenceType } from '../content/types';
import { assetUrl, formatDate, getStory, hasEvidenceContent, type EvidenceWithSprint } from '../lib/content';
import { EVIDENCE_TYPE_LABEL } from '../lib/labels';
import { href } from '../lib/router';
import { LUChip, StoryTypeBadge, Text } from './ui';

const ICONS: Record<EvidenceType, LucideIcon> = {
  pdf: FileType2,
  document: FileText,
  excel: FileSpreadsheet,
  afbeelding: FileImage,
  screenshot: FileImage,
  video: Video,
  github: Github,
  website: Globe,
  link: Link2,
  tekst: ScrollText,
  presentatie: Presentation,
};

/** Bestanden die de browser meestal niet zelf toont → knop "Download bewijs". */
const DOWNLOAD_TYPES: EvidenceType[] = ['document', 'excel', 'presentatie'];

export function EvidenceCard({ evidence, showSprint = true }: { evidence: EvidenceWithSprint; showSprint?: boolean }) {
  const Icon = ICONS[evidence.type];
  const story = getStory(evidence.storyId);
  const isExternal = !!evidence.url && /^https?:/.test(evidence.url);
  const isDownload = !!evidence.url && !isExternal && DOWNLOAD_TYPES.includes(evidence.type);
  const available = hasEvidenceContent(evidence);

  return (
    <article id={evidence.id} className="card card-hover flex scroll-mt-32 flex-col overflow-hidden">
      {evidence.thumbnail && (
        <img
          src={assetUrl(evidence.thumbnail)}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full border-b border-line object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-muted">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            {EVIDENCE_TYPE_LABEL[evidence.type]}
          </span>
          <span className="text-xs text-muted">
            {showSprint && (
              <a className="hover:text-accent" href={href(`/sprints/${evidence.sprint}`)}>
                Sprint {evidence.sprint}
              </a>
            )}
            {showSprint && evidence.date && ' · '}
            {formatDate(evidence.date)}
          </span>
        </div>

        <h3 className="font-semibold leading-snug text-ink">{evidence.title}</h3>
        <p className="mt-1.5 text-sm text-muted">
          <Text>{evidence.description}</Text>
        </p>

        {evidence.text && (
          <details className="mt-3 rounded-lg bg-page text-sm">
            <summary className="px-3 py-2 font-medium text-accent">Toon tekstbewijs</summary>
            <p className="whitespace-pre-line border-t border-line px-3 py-2 text-ink/90">{evidence.text}</p>
          </details>
        )}

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <dt className="text-muted">Hoort bij:</dt>
            <dd>
              {story ? (
                <a
                  href={href(`/sprints/${story.sprint}?story=${story.id}`)}
                  className="inline-flex items-center gap-1.5 font-medium text-ink hover:text-accent"
                >
                  <StoryTypeBadge type={story.type} />
                  {story.title}
                </a>
              ) : (
                <span className="text-muted/80">Geen specifieke story</span>
              )}
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <dt className="text-muted">Toont aan:</dt>
            <dd className="flex flex-wrap gap-1">
              {evidence.learningOutcomes.map((c) => (
                <LUChip key={c} code={c} />
              ))}
            </dd>
          </div>
          {evidence.aiTools && evidence.aiTools.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <dt className="text-muted">AI-tool:</dt>
              <dd className="flex flex-wrap gap-1">
                {evidence.aiTools.map((t) => (
                  <span key={t} className="chip bg-stone-100 text-stone-700">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto pt-5">
          {evidence.url ? (
            <a
              href={assetUrl(evidence.url)}
              target="_blank"
              rel="noopener noreferrer"
              {...(isDownload ? { download: '' } : {})}
              className="btn btn-primary w-full sm:w-auto"
            >
              {isDownload ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              {isDownload ? 'Download bewijs' : 'Bekijk bewijs'}
            </a>
          ) : (
            !available && (
              <span className="btn w-full cursor-default border border-dashed border-amber-300 bg-amber-50 text-amber-900 sm:w-auto">
                Bewijs volgt nog
              </span>
            )
          )}
        </div>
      </div>
    </article>
  );
}
