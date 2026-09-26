import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Field, TextArea, TextInput } from '../components/fields';
import { Button, Card, Modal, PageHeader, TextOrPlaceholder } from '../components/ui';
import { useStore } from '../lib/store';
import type { Profile } from '../lib/types';

function ProfileForm({ onClose }: { onClose: () => void }) {
  const { data, saveProfile } = useStore();
  const [p, setP] = useState<Profile>(data.profile);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((prev) => ({ ...prev, [k]: v }));
  return (
    <Modal
      title="Over mij bewerken"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuleren</Button>
          <Button onClick={() => { saveProfile(p); onClose(); }}>Opslaan</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
          <Field label="Naam"><TextInput value={p.name} onChange={(v) => set('name', v)} /></Field>
          <Field label="Initialen"><TextInput value={p.initials} onChange={(v) => set('initials', v)} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Opleiding"><TextInput value={p.study} onChange={(v) => set('study', v)} /></Field>
          <Field label="Toekomstig beroep"><TextInput value={p.profession} onChange={(v) => set('profession', v)} /></Field>
          <Field label="Minor"><TextInput value={p.minor} onChange={(v) => set('minor', v)} /></Field>
          <Field label="Studiejaar"><TextInput value={p.schoolYear} onChange={(v) => set('schoolYear', v)} /></Field>
        </div>
        <Field label="Introductie (homepagina)"><TextArea value={p.intro} onChange={(v) => set('intro', v)} rows={3} /></Field>
        <Field label="Wie ben ik?"><TextArea value={p.whoAmI} onChange={(v) => set('whoAmI', v)} /></Field>
        <Field label="Waarom deze minor?"><TextArea value={p.whyMinor} onChange={(v) => set('whyMinor', v)} /></Field>
        <Field label="Mijn leerdoelen en ambities"><TextArea value={p.ambitions} onChange={(v) => set('ambitions', v)} /></Field>
        <Field label="Foto" hint="Link naar een foto, of zet een foto in public/ en vul bijv. /foto.jpg in.">
          <TextInput value={p.photoUrl} onChange={(v) => set('photoUrl', v)} />
        </Field>
        <Field label="Contact (optioneel)" hint="Bijv. je e-mailadres of LinkedIn-link. Dit is zichtbaar voor iedereen.">
          <TextInput value={p.contact} onChange={(v) => set('contact', v)} />
        </Field>
      </div>
    </Modal>
  );
}

export function AboutPage() {
  const { data, editMode } = useStore();
  const [editing, setEditing] = useState(false);
  const p = data.profile;

  const facts = [
    ['Opleiding', p.study],
    ['Toekomstig beroep', p.profession],
    ['Minor', p.minor],
    ['Studiejaar', p.schoolYear],
  ].filter(([, v]) => v);

  return (
    <>
      <PageHeader
        eyebrow="Over mij"
        title={p.name}
        intro={`Student ${p.study} · Minor ${p.minor}`}
        actions={
          editMode ? (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil size={15} /> Bewerken
            </Button>
          ) : undefined
        }
      />
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            {p.photoUrl ? (
              <img src={p.photoUrl} alt={p.name} className="aspect-square w-full object-cover" />
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-ink text-white">
                <span className="font-display text-6xl font-semibold">{p.initials}</span>
                <span className="text-xs text-white/60">Foto nog toevoegen</span>
              </div>
            )}
            <dl className="divide-y divide-line">
              {facts.map(([k, v]) => (
                <div key={k} className="px-5 py-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
              {p.contact && (
                <div className="px-5 py-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-muted">Contact</dt>
                  <dd className="mt-0.5 break-words font-semibold">{p.contact}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
        <div className="space-y-4">
          {[
            ['Wie ben ik?', p.whoAmI, 'Vertel hier kort wie je bent: je achtergrond, je opleiding en wat je drijft.'],
            ['Waarom deze minor?', p.whyMinor, 'Leg hier uit waarom je voor Futureproof met AI hebt gekozen.'],
            ['Mijn leerdoelen en ambities', p.ambitions, 'Beschrijf hier wat je in deze minor wilt leren en bereiken als toekomstig accountmanager.'],
          ].map(([title, value, ph]) => (
            <Card key={title} className="p-6">
              <h2 className="mb-3 font-display text-xl font-semibold">{title}</h2>
              <TextOrPlaceholder value={value} placeholder={ph} />
            </Card>
          ))}
        </div>
      </div>
      {editing && <ProfileForm onClose={() => setEditing(false)} />}
    </>
  );
}
