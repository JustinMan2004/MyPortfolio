import { useState } from 'react';
import { ExternalLink, Pencil, Plus, Sparkles, Trash2, Wrench } from 'lucide-react';
import { CheckboxGroup, Field, Select, TextArea, TextInput } from '../components/fields';
import { Button, Card, EmptyState, Modal, PageHeader } from '../components/ui';
import { href } from '../lib/router';
import { newId, useStore } from '../lib/store';
import type { Tool } from '../lib/types';

function ToolForm({ initial, onClose }: { initial: Tool; onClose: () => void }) {
  const { data, saveTool, deleteTool } = useStore();
  const [t, setT] = useState(initial);
  const isNew = !data.tools.some((x) => x.id === initial.id);
  const set = <K extends keyof Tool>(k: K, v: Tool[K]) => setT((p) => ({ ...p, [k]: v }));
  return (
    <Modal
      title={isNew ? 'Tool toevoegen' : 'Tool bewerken'}
      onClose={onClose}
      footer={
        <>
          {!isNew && (
            <Button variant="danger" className="mr-auto" onClick={() => { deleteTool(t.id); onClose(); }}>
              <Trash2 size={15} /> Verwijderen
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>Annuleren</Button>
          <Button disabled={!t.name.trim()} onClick={() => { saveTool(t); onClose(); }}>Opslaan</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Naam *">
            <TextInput value={t.name} onChange={(v) => set('name', v)} />
          </Field>
          <Field label="Soort">
            <Select
              value={t.category}
              onChange={(v) => set('category', v)}
              options={[
                { value: 'AI-tool', label: 'AI-tool' },
                { value: 'Digitale tool', label: 'Digitale tool' },
              ]}
            />
          </Field>
        </div>
        <Field label="Waarvoor heb ik deze tool gebruikt?">
          <TextArea value={t.purpose} onChange={(v) => set('purpose', v)} rows={3} />
        </Field>
        <Field label="Website van de tool (optioneel)">
          <TextInput value={t.url ?? ''} onChange={(v) => set('url', v)} placeholder="https://…" />
        </Field>
        <Field group label="Gebruikt in sprint">
          <CheckboxGroup
            options={data.sprints.map((s) => ({ value: String(s.number), label: `Sprint ${s.number}` }))}
            value={t.sprints.map(String)}
            onChange={(v) => set('sprints', v.map(Number).sort((a, b) => a - b))}
          />
        </Field>
      </div>
    </Modal>
  );
}

export function ToolsPage() {
  const { data, editMode } = useStore();
  const [editing, setEditing] = useState<Tool | null>(null);
  const groups: Tool['category'][] = ['AI-tool', 'Digitale tool'];

  return (
    <>
      <PageHeader
        eyebrow="Gereedschap"
        title="Gebruikte AI-tools"
        intro="Welke AI- en digitale tools ik heb ingezet, waarvoor, en in welke sprint. Bewijsstukken waarin een tool is gebruikt staan eronder."
        actions={
          editMode ? (
            <Button onClick={() => setEditing({ id: newId('t'), name: '', category: 'AI-tool', purpose: '', sprints: [] })}>
              <Plus size={16} /> Tool toevoegen
            </Button>
          ) : undefined
        }
      />
      {data.tools.length === 0 && <EmptyState>Nog geen tools vastgelegd.</EmptyState>}
      <div className="space-y-10">
        {groups.map((g) => {
          const tools = data.tools.filter((t) => t.category === g);
          if (!tools.length) return null;
          return (
            <section key={g}>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                {g === 'AI-tool' ? <Sparkles size={18} className="text-accent" /> : <Wrench size={18} className="text-accent" />}
                {g === 'AI-tool' ? 'AI-tools' : 'Digitale tools'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tools.map((t) => {
                  const used = data.evidence.filter((e) => e.aiTools.some((n) => n.toLowerCase() === t.name.toLowerCase()));
                  return (
                    <Card key={t.id} className="flex flex-col p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold">{t.name}</h3>
                        <div className="flex items-center gap-1">
                          {t.url && (
                            <a href={t.url} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-muted hover:bg-stone-100" aria-label={`Website ${t.name}`}>
                              <ExternalLink size={15} />
                            </a>
                          )}
                          {editMode && (
                            <button onClick={() => setEditing(t)} className="rounded-lg p-1.5 text-muted hover:bg-stone-100" aria-label="Tool bewerken">
                              <Pencil size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{t.purpose || 'Doel nog invullen.'}</p>
                      <div className="mt-auto space-y-2 pt-4 text-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {t.sprints.map((n) => (
                            <a key={n} href={href.sprint(n)} className="rounded-md bg-stone-100 px-2 py-0.5 font-semibold hover:bg-stone-200">
                              Sprint {n}
                            </a>
                          ))}
                        </div>
                        {used.length > 0 && (
                          <p className="text-muted">
                            Gebruikt in:{' '}
                            {used.map((e, i) => (
                              <span key={e.id}>
                                {i > 0 && ', '}
                                <a href={href.bewijs(e.id)} className="font-semibold text-accent hover:underline">
                                  {e.title}
                                </a>
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      {editing && <ToolForm initial={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
