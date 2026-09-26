import { useState } from 'react';
import { ArrowRight, FileCheck2, Plus, Trash2, BookOpen } from 'lucide-react';
import { LEARNING_OUTCOMES, LU_LEVEL, SPRINT_STATUS, SPRINT_STATUS_ORDER } from '../lib/constants';
import { href } from '../lib/router';
import { hasContent, outcomesInSprint } from '../lib/selectors';
import { newId, useStore } from '../lib/store';
import type { LuLevel, Sprint, SprintStatus } from '../lib/types';
import { Field, Select, TextArea, TextInput, linesToList, listToLines } from './fields';
import { Button, Card, LuChip, Modal, StatusBadge, cx } from './ui';

export const sprintTitle = (s: Sprint) => (hasContent(s.title) ? s.title : 'Thema nog in te vullen');

/** Rustige keuzeknop om de status van een sprint te wijzigen (alleen zichtbaar in beheermodus). */
export function StatusControl({ sprint }: { sprint: Sprint }) {
  const { setSprintStatus } = useStore();
  return (
    <div className="inline-flex rounded-xl bg-stone-100 p-1" role="radiogroup" aria-label={`Status sprint ${sprint.number}`}>
      {SPRINT_STATUS_ORDER.map((status) => (
        <button
          key={status}
          role="radio"
          aria-checked={sprint.status === status}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSprintStatus(sprint.number, status);
          }}
          className={cx(
            'rounded-lg px-2.5 py-1 text-xs font-semibold transition',
            sprint.status === status ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink',
          )}
        >
          {SPRINT_STATUS[status].label}
        </button>
      ))}
    </div>
  );
}

export function SprintCard({ sprint }: { sprint: Sprint }) {
  const { data, editMode } = useStore();
  const stories = data.stories.filter((s) => s.sprint === sprint.number);
  const evidence = data.evidence.filter((e) => e.sprint === sprint.number);
  const outcomes = outcomesInSprint(data, sprint.number);
  const inactive = sprint.status === 'niet-gestart' && !stories.length && !evidence.length;

  return (
    <Card
      className={cx(
        'group relative flex h-full flex-col p-5 transition hover:border-stone-400 hover:shadow-sm',
        sprint.status === 'bezig' && 'ring-1 ring-amber-300',
        inactive && 'bg-surface/70',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-medium text-accent">Sprint {String(sprint.number).padStart(2, '0')}</p>
          <h3 className={cx('mt-1 font-bold leading-snug', !hasContent(sprint.title) && 'font-semibold italic text-stone-400')}>
            {sprintTitle(sprint)}
          </h3>
          {sprint.period && <p className="mt-1 text-xs text-muted">{sprint.period}</p>}
        </div>
        <StatusBadge status={sprint.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted">
        <span className="inline-flex items-center gap-1">
          <BookOpen size={13} /> {stories.length} stories
        </span>
        <span className="inline-flex items-center gap-1">
          <FileCheck2 size={13} /> {evidence.length} bewijsstukken
        </span>
      </div>
      {outcomes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {outcomes.map((o) => (
            <LuChip key={o} code={o} link={false} />
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        {editMode ? (
          <div className="relative z-10">
            <StatusControl sprint={sprint} />
          </div>
        ) : (
          <span />
        )}
        <a
          href={href.sprint(sprint.number)}
          className="inline-flex items-center gap-1 text-sm font-bold text-accent after:absolute after:inset-0 group-hover:gap-2"
        >
          Bekijk sprint <ArrowRight size={15} className="transition-all" />
        </a>
      </div>
    </Card>
  );
}

/** Formulier voor alle vaste onderdelen van een sprint. */
export function SprintForm({ sprint, onClose }: { sprint: Sprint; onClose: () => void }) {
  const { saveSprint } = useStore();
  const [s, setS] = useState<Sprint>(sprint);
  const [activities, setActivities] = useState(listToLines(sprint.activities));
  const set = <K extends keyof Sprint>(key: K, value: Sprint[K]) => setS((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    saveSprint({ ...s, activities: linesToList(activities) });
    onClose();
  };

  return (
    <Modal
      title={`Sprint ${sprint.number} bewerken`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuleren
          </Button>
          <Button onClick={save}>Opslaan</Button>
        </>
      }
    >
      <div className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">Algemeen</legend>
          <Field label="Thema / titel van de sprint">
            <TextInput value={s.title} onChange={(v) => set('title', v)} placeholder="Bijv. AI in klantcontact" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Periode">
              <TextInput value={s.period} onChange={(v) => set('period', v)} placeholder="Bijv. 1 sep – 14 sep 2026" />
            </Field>
            <Field label="Status">
              <Select
                value={s.status}
                onChange={(v: SprintStatus) => set('status', v)}
                options={SPRINT_STATUS_ORDER.map((st) => ({ value: st, label: SPRINT_STATUS[st].label }))}
              />
            </Field>
          </div>
          <Field label="Introductie / samenvatting">
            <TextArea value={s.summary} onChange={(v) => set('summary', v)} rows={4} />
          </Field>
          <Field label="Werkzaamheden — wat heb ik gedaan?" hint="Eén werkzaamheid per regel.">
            <TextArea value={activities} onChange={setActivities} rows={6} />
          </Field>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">Feedback (ontvangen van anderen)</legend>
          {s.feedback.map((f, i) => {
            const upd = (patch: Partial<typeof f>) =>
              set(
                'feedback',
                s.feedback.map((x, j) => (j === i ? { ...x, ...patch } : x)),
              );
            return (
              <div key={f.id} className="space-y-3 rounded-xl border border-line p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Datum">
                    <TextInput type="date" value={f.date} onChange={(v) => upd({ date: v })} />
                  </Field>
                  <Field label="Van wie">
                    <TextInput value={f.from} onChange={(v) => upd({ from: v })} placeholder="Bijv. docent, coach, medestudent" />
                  </Field>
                </div>
                <Field label="Feedback">
                  <TextArea value={f.feedback} onChange={(v) => upd({ feedback: v })} rows={3} />
                </Field>
                <Field label="Mijn actie">
                  <TextArea value={f.action} onChange={(v) => upd({ action: v })} rows={2} />
                </Field>
                <button
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:underline"
                  onClick={() => set('feedback', s.feedback.filter((_, j) => j !== i))}
                >
                  <Trash2 size={13} /> Feedback verwijderen
                </button>
              </div>
            );
          })}
          <Button
            variant="secondary"
            onClick={() =>
              set('feedback', [
                ...s.feedback,
                { id: newId('fb'), date: new Date().toISOString().slice(0, 10), from: '', feedback: '', action: '' },
              ])
            }
          >
            <Plus size={15} /> Feedback toevoegen
          </Button>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">Zelfevaluatie (mastery)</legend>
          {LEARNING_OUTCOMES.map((lu) => {
            const ev = s.selfEvaluation[lu.code];
            const upd = (patch: Partial<typeof ev>) =>
              set('selfEvaluation', { ...s.selfEvaluation, [lu.code]: { ...ev, ...patch } });
            return (
              <div key={lu.code} className="space-y-2 rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold">
                    {lu.code.replace('LU', 'LU ')} · {lu.title}
                  </p>
                  <div className="w-44">
                    <Select
                      value={ev.level}
                      onChange={(v: LuLevel) => upd({ level: v })}
                      options={(Object.keys(LU_LEVEL) as LuLevel[]).map((l) => ({ value: l, label: `${l} — ${LU_LEVEL[l].label}` }))}
                    />
                  </div>
                </div>
                <TextArea value={ev.argument} onChange={(v) => upd({ argument: v })} rows={3} placeholder="Argumentatie en bewijs" />
              </div>
            );
          })}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">Reflectie</legend>
          <Field label="Datum">
            <TextInput type="date" value={s.reflection.date} onChange={(v) => set('reflection', { ...s.reflection, date: v })} />
          </Field>
          <Field label="Wat heb ik geleerd?">
            <TextArea value={s.reflection.learned} onChange={(v) => set('reflection', { ...s.reflection, learned: v })} />
          </Field>
          <Field label="Wat behoud ik?">
            <TextArea value={s.reflection.keep} onChange={(v) => set('reflection', { ...s.reflection, keep: v })} />
          </Field>
          <Field label="Wat ga ik anders doen?">
            <TextArea value={s.reflection.change} onChange={(v) => set('reflection', { ...s.reflection, change: v })} />
          </Field>
        </fieldset>
      </div>
    </Modal>
  );
}
