import { useRef, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { EVIDENCE_TYPES, EVIDENCE_TYPE_ORDER, LEARNING_OUTCOMES } from '../lib/constants';
import { aiToolsInUse, storyCode } from '../lib/selectors';
import { newId, useStore } from '../lib/store';
import type { Evidence, EvidenceType } from '../lib/types';
import { CheckboxGroup, Field, Select, TextArea, TextInput } from './fields';
import { Button, Modal } from './ui';

const MAX_EMBED_BYTES = 1024 * 1024;

const guessType = (fileName: string): EvidenceType => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(ext)) return 'document';
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'excel';
  if (['ppt', 'pptx', 'odp', 'key'].includes(ext)) return 'powerpoint';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'afbeelding';
  if (['mp4', 'webm', 'mov', 'm4v'].includes(ext)) return 'video';
  return 'bestand';
};

const linkTypes: EvidenceType[] = ['website', 'onedrive', 'url'];

export function blankEvidence(sprint: number): Evidence {
  return {
    id: newId('e'),
    sprint,
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'onedrive',
    aiTools: [],
    storyIds: [],
    outcomes: [],
    url: '',
  };
}

export function EvidenceForm({ initial, onClose }: { initial: Evidence; onClose: () => void }) {
  const { data, saveEvidence, deleteEvidence } = useStore();
  const [e, setE] = useState<Evidence>(initial);
  const [toolText, setToolText] = useState('');
  const [fileNote, setFileNote] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !data.evidence.some((x) => x.id === initial.id);
  const set = <K extends keyof Evidence>(key: K, value: Evidence[K]) => setE((prev) => ({ ...prev, [key]: value }));

  const knownTools = aiToolsInUse(data);
  const sprintStories = data.stories.filter((s) => s.sprint === e.sprint);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const type = guessType(file.name);
    setE((prev) => ({ ...prev, type: prev.type === 'screenshot' && type === 'afbeelding' ? 'screenshot' : type, title: prev.title || file.name.replace(/\.[^.]+$/, '') }));
    if (file.size <= MAX_EMBED_BYTES) {
      const reader = new FileReader();
      reader.onload = () => {
        set('url', String(reader.result));
        setFileNote(`“${file.name}” is direct in je portfolio opgeslagen (${Math.round(file.size / 1024)} kB).`);
      };
      reader.readAsDataURL(file);
    } else {
      const safe = file.name.replace(/\s+/g, '-');
      set('url', `/bewijs/sprint-${e.sprint}/${safe}`);
      setFileNote(
        `Dit bestand is groter dan 1 MB. Zet “${safe}” in de map public/bewijs/sprint-${e.sprint}/ van je project, dan werkt de link na publicatie.`,
      );
    }
  };

  const addTool = () => {
    const name = toolText.trim();
    if (name && !e.aiTools.includes(name)) set('aiTools', [...e.aiTools, name]);
    setToolText('');
  };

  const valid = e.title.trim().length > 0;
  const save = () => {
    if (!valid) return;
    saveEvidence({ ...e, storyIds: e.storyIds.filter((id) => data.stories.some((s) => s.id === id && s.sprint === e.sprint)) });
    onClose();
  };

  const isEmbedded = e.url.startsWith('data:');

  return (
    <Modal
      title={isNew ? 'Nieuw bewijsstuk toevoegen' : 'Bewijsstuk bewerken'}
      onClose={onClose}
      footer={
        <>
          {!isNew && (
            <Button
              variant="danger"
              className="mr-auto"
              onClick={() => {
                if (confirm('Dit bewijsstuk verwijderen?')) {
                  deleteEvidence(e.id);
                  onClose();
                }
              }}
            >
              <Trash2 size={15} /> Verwijderen
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Annuleren
          </Button>
          <Button onClick={save} disabled={!valid}>
            Opslaan
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field label="Titel *">
          <TextInput value={e.title} onChange={(v) => set('title', v)} placeholder="Bijv. Onderzoeksverslag AI in accountmanagement" required />
        </Field>
        <Field label="Korte omschrijving">
          <TextArea value={e.description} onChange={(v) => set('description', v)} rows={3} placeholder="Wat is dit bewijs en wat laat het zien?" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Sprint">
            <Select
              value={e.sprint}
              onChange={(v) => set('sprint', v)}
              options={data.sprints.map((s) => ({ value: s.number, label: `Sprint ${s.number}` }))}
            />
          </Field>
          <Field label="Datum">
            <TextInput type="date" value={e.date} onChange={(v) => set('date', v)} />
          </Field>
          <Field label="Type bewijs">
            <Select
              value={e.type}
              onChange={(v) => set('type', v)}
              options={EVIDENCE_TYPE_ORDER.map((t) => ({ value: t, label: EVIDENCE_TYPES[t].label }))}
            />
          </Field>
        </div>

        {e.type === 'tekst' ? (
          <Field label="Tekst">
            <TextArea value={e.text ?? ''} onChange={(v) => set('text', v)} rows={8} placeholder="Plak hier je tekst, bijv. gebruikte prompts." />
          </Field>
        ) : (
          <div className="rounded-xl bg-stone-50 p-4">
            <Field
              label={linkTypes.includes(e.type) ? 'Link' : 'Link of bestand'}
              hint={
                linkTypes.includes(e.type)
                  ? 'Plak de volledige link, bijv. een OneDrive-deellink (“Iedereen met de link kan bekijken”).'
                  : 'Plak een OneDrive-/externe link, of kies hieronder een bestand van je computer.'
              }
            >
              <TextInput
                value={isEmbedded ? '(bestand opgeslagen in portfolio)' : e.url}
                onChange={(v) => {
                  set('url', v);
                  setFileNote(null);
                }}
                placeholder="https://…"
              />
            </Field>
            {!linkTypes.includes(e.type) && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input ref={fileRef} type="file" className="hidden" onChange={(ev) => onFile(ev.target.files?.[0])} />
                <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                  <Upload size={15} /> Kies bestand
                </Button>
                {isEmbedded && (
                  <button className="text-xs font-semibold text-rose-700 hover:underline" onClick={() => set('url', '')}>
                    Bestand verwijderen
                  </button>
                )}
              </div>
            )}
            {fileNote && <p className="mt-2 text-xs text-accent-strong">{fileNote}</p>}
          </div>
        )}

        <Field group label="Gebruikte AI-tool(s)" hint="Optioneel. Klik een bekende tool aan of typ een nieuwe en klik op Toevoegen.">
          <div className="space-y-2">
            <CheckboxGroup
              options={[...new Set([...knownTools, ...e.aiTools])].map((t) => ({ value: t, label: t }))}
              value={e.aiTools}
              onChange={(v) => set('aiTools', v)}
            />
            <div className="flex gap-2">
              <TextInput value={toolText} onChange={setToolText} placeholder="Andere tool…" />
              <Button variant="secondary" onClick={addTool}>
                Toevoegen
              </Button>
            </div>
          </div>
        </Field>

        <Field group label={`Hoort bij story (Sprint ${e.sprint})`}>
          <CheckboxGroup
            options={sprintStories.map((s) => ({ value: s.id, label: `${storyCode(data, s)} · ${s.title || 'Naamloze story'}` }))}
            value={e.storyIds}
            onChange={(v) => set('storyIds', v)}
            empty="Er zijn nog geen stories in deze sprint. Voeg eerst een story toe, of laat dit leeg voor sprintbreed bewijs."
          />
        </Field>

        <Field group label="Toont aan (leeruitkomsten)">
          <CheckboxGroup
            options={LEARNING_OUTCOMES.map((lu) => ({ value: lu.code, label: `${lu.code.replace('LU', 'LU ')} · ${lu.short}` }))}
            value={e.outcomes}
            onChange={(v) => set('outcomes', v)}
          />
        </Field>
      </div>
    </Modal>
  );
}
