import { useState, type ReactNode } from 'react';
import {
  AlignLeft,
  Cloud,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  Globe,
  Image,
  Link2,
  Monitor,
  Pencil,
  Presentation,
  Sparkles,
  Video,
  Download,
  Eye,
} from 'lucide-react';
import { EVIDENCE_TYPES } from '../lib/constants';
import { href } from '../lib/router';
import { evidenceHasSource, formatDate, storiesById, storyCode } from '../lib/selectors';
import { useStore } from '../lib/store';
import type { Evidence, EvidenceType } from '../lib/types';
import { Button, Card, LuChip, Modal, cx } from './ui';

export const EVIDENCE_ICONS: Record<EvidenceType, typeof File> = {
  pdf: FileText,
  document: FileText,
  excel: FileSpreadsheet,
  powerpoint: Presentation,
  afbeelding: Image,
  screenshot: Monitor,
  video: Video,
  website: Globe,
  onedrive: Cloud,
  url: Link2,
  bestand: File,
  tekst: AlignLeft,
};

const isLocalFile = (url: string) => url.startsWith('/') || url.startsWith('data:');
const isVideoFile = (url: string) => url.startsWith('data:video') || /\.(mp4|webm|mov|m4v)$/i.test(url);

/** Welke bewijzen kunnen we direct in de site tonen? */
const previewable = (e: Evidence) => {
  if (e.type === 'tekst') return true;
  if (e.type === 'afbeelding' || e.type === 'screenshot') return true;
  if (e.type === 'pdf' && isLocalFile(e.url)) return true;
  if (e.type === 'video' && isVideoFile(e.url)) return true;
  return false;
};

export function EvidenceAction({ evidence, onPreview }: { evidence: Evidence; onPreview: () => void }) {
  const meta = EVIDENCE_TYPES[evidence.type];
  if (!evidenceHasSource(evidence)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-stone-300 px-3 py-2 text-xs font-semibold text-stone-500">
        Bewijs volgt — bestand of link nog toevoegen
      </span>
    );
  }
  if (previewable(evidence)) {
    return (
      <Button onClick={onPreview} className="!py-1.5">
        <Eye size={15} /> {meta.action}
      </Button>
    );
  }
  const download = ['document', 'excel', 'powerpoint', 'bestand'].includes(evidence.type) && isLocalFile(evidence.url);
  return (
    <a
      href={evidence.url}
      target="_blank"
      rel="noreferrer"
      {...(download ? { download: '' } : {})}
      className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
    >
      {download ? <Download size={15} /> : <ExternalLink size={15} />} {meta.action}
    </a>
  );
}

export function EvidencePreview({ evidence, onClose }: { evidence: Evidence; onClose: () => void }) {
  let body: ReactNode = null;
  if (evidence.type === 'tekst') {
    body = <p className="whitespace-pre-line text-[15px] leading-relaxed">{evidence.text}</p>;
  } else if (evidence.type === 'afbeelding' || evidence.type === 'screenshot') {
    body = <img src={evidence.url} alt={evidence.title} className="w-full rounded-xl border border-line" />;
  } else if (evidence.type === 'pdf') {
    body = <iframe src={evidence.url} title={evidence.title} className="h-[70vh] w-full rounded-xl border border-line" />;
  } else if (evidence.type === 'video') {
    body = <video src={evidence.url} controls className="w-full rounded-xl bg-black" />;
  }
  return (
    <Modal
      title={evidence.title}
      onClose={onClose}
      footer={
        evidence.url ? (
          <a href={evidence.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent hover:underline">
            Open in nieuw tabblad ↗
          </a>
        ) : undefined
      }
    >
      {body}
    </Modal>
  );
}

export function EvidenceCard({
  evidence,
  onEdit,
  compact,
}: {
  evidence: Evidence;
  onEdit?: (e: Evidence) => void;
  compact?: boolean;
}) {
  const { data, editMode } = useStore();
  const [preview, setPreview] = useState(false);
  const Icon = EVIDENCE_ICONS[evidence.type];
  const stories = storiesById(data, evidence.storyIds);
  const missing = !evidenceHasSource(evidence);

  return (
    <Card className={cx('flex h-full flex-col p-5', missing && 'bg-stone-50/60')}>
      <div className="flex items-start gap-3">
        <div
          className={cx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            missing ? 'bg-stone-100 text-stone-400' : 'bg-accent-soft text-accent',
          )}
        >
          <Icon size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-muted">
            <span>{EVIDENCE_TYPES[evidence.type].label}</span>
            <span aria-hidden>·</span>
            <a href={href.sprint(evidence.sprint)} className="hover:text-accent">
              Sprint {evidence.sprint}
            </a>
            {evidence.date && (
              <>
                <span aria-hidden>·</span>
                <span>{formatDate(evidence.date)}</span>
              </>
            )}
          </div>
          <h3 className="mt-1 font-bold leading-snug">
            <a href={href.bewijs(evidence.id)} className="hover:text-accent">
              {evidence.title}
            </a>
          </h3>
        </div>
        {editMode && onEdit && (
          <button
            onClick={() => onEdit(evidence)}
            className="rounded-lg p-1.5 text-muted hover:bg-stone-100 hover:text-ink"
            aria-label="Bewijs bewerken"
          >
            <Pencil size={15} />
          </button>
        )}
      </div>

      {!compact && evidence.description && <p className="mt-3 text-sm leading-relaxed text-muted">{evidence.description}</p>}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <dt className="w-24 shrink-0 font-semibold">Hoort bij:</dt>
          <dd className="flex flex-wrap gap-1.5">
            {stories.length ? (
              stories.map((s) => (
                <a
                  key={s.id}
                  href={href.stories(s.id)}
                  className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-ink hover:bg-stone-200"
                  title={s.title}
                >
                  {storyCode(data, s)} {s.title}
                </a>
              ))
            ) : (
              <span className="text-xs italic text-muted">Sprintbreed bewijs</span>
            )}
          </dd>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <dt className="w-24 shrink-0 font-semibold">Toont aan:</dt>
          <dd className="flex flex-wrap gap-1.5">
            {evidence.outcomes.length ? (
              evidence.outcomes.map((o) => <LuChip key={o} code={o} />)
            ) : (
              <span className="text-xs italic text-muted">Nog niet gekoppeld</span>
            )}
          </dd>
        </div>
        {evidence.aiTools.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <dt className="w-24 shrink-0 font-semibold">AI-tool:</dt>
            <dd className="flex flex-wrap gap-1.5">
              {evidence.aiTools.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900">
                  <Sparkles size={11} /> {t}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-auto pt-5">
        <EvidenceAction evidence={evidence} onPreview={() => setPreview(true)} />
      </div>
      {preview && <EvidencePreview evidence={evidence} onClose={() => setPreview(false)} />}
    </Card>
  );
}
