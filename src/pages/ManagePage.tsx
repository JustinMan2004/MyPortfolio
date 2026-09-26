import { useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { Button, Card, PageHeader, cx } from '../components/ui';
import { isValidPortfolioData, useStore } from '../lib/store';

export function ManagePage() {
  const { data, editMode, setEditMode, hasLocalChanges, importData, resetToPublished } = useStore();
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!isValidPortfolioData(parsed)) throw new Error('ongeldig');
      importData(parsed);
      setMessage('portfolio.json is ingeladen in deze browser.');
    } catch {
      setMessage('Dit bestand is geen geldig portfolio.json-bestand.');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Beheer"
        title="Portfolio bijwerken"
        intro="Hier zet je de beheermodus aan om sprints, stories, bewijs en je profiel aan te passen, en publiceer je je wijzigingen."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-bold">1. Beheermodus</h2>
          <p className="mt-1 text-sm text-muted">
            Met beheermodus aan verschijnen overal knoppen om te bewerken en toe te voegen, en kun je de status van een sprint wijzigen.
          </p>
          <button
            onClick={() => setEditMode(!editMode)}
            className={cx(
              'mt-4 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition',
              editMode ? 'border-accent bg-accent-soft' : 'border-line hover:border-stone-400',
            )}
            role="switch"
            aria-checked={editMode}
          >
            <span className="font-semibold">{editMode ? 'Beheermodus staat aan' : 'Beheermodus staat uit'}</span>
            <span className={cx('relative h-6 w-11 rounded-full transition', editMode ? 'bg-accent' : 'bg-stone-300')}>
              <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', editMode ? 'left-[1.375rem]' : 'left-0.5')} />
            </span>
          </button>
          <p className="mt-3 text-xs text-muted">
            Wijzigingen worden direct in deze browser bewaard. Bezoekers zien ze pas nadat je ze hebt gepubliceerd (stap 2).
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold">2. Wijzigingen publiceren</h2>
          <p className="mt-1 text-sm text-muted">
            {hasLocalChanges
              ? 'Je hebt wijzigingen in deze browser die nog niet online staan.'
              : 'Er zijn geen lokale wijzigingen: je ziet de gepubliceerde versie.'}
          </p>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm">
            <li>Klik op <strong>Download portfolio.json</strong>.</li>
            <li>Vervang in je project het bestand <code className="rounded bg-stone-100 px-1">src/data/portfolio.json</code> door het gedownloade bestand.</li>
            <li>Grote bestanden (&gt; 1 MB) zet je in <code className="rounded bg-stone-100 px-1">public/bewijs/sprint-X/</code>.</li>
            <li>Sla op en publiceer (commit &amp; push). De website wordt daarna automatisch bijgewerkt.</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={download}>
              <Download size={15} /> Download portfolio.json
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload size={15} /> portfolio.json inladen
            </Button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
          </div>
          {hasLocalChanges && (
            <button
              onClick={() => {
                if (confirm('Alle lokale wijzigingen weggooien en terug naar de gepubliceerde versie?')) {
                  resetToPublished();
                  setMessage('Lokale wijzigingen zijn verwijderd.');
                }
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline"
            >
              <RotateCcw size={14} /> Lokale wijzigingen weggooien
            </button>
          )}
          {message && <p className="mt-3 rounded-lg bg-stone-100 px-3 py-2 text-sm">{message}</p>}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Bewijs toevoegen na een sprint — zo werkt het</h2>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
            <div className="rounded-xl bg-stone-50 p-4">
              <p className="font-bold">Link (makkelijkst)</p>
              <p className="mt-1 text-muted">
                Zet je bestand op OneDrive, kies “Delen → Iedereen met de link kan bekijken” en plak de link bij een nieuw bewijsstuk.
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 p-4">
              <p className="font-bold">Klein bestand (≤ 1 MB)</p>
              <p className="mt-1 text-muted">
                Kies het bestand in het formulier. Het wordt direct in je portfolio opgeslagen en gaat mee in portfolio.json.
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 p-4">
              <p className="font-bold">Groot bestand</p>
              <p className="mt-1 text-muted">
                Kies het bestand; het formulier vult het pad in. Zet het bestand zelf in de map public/bewijs/sprint-X/ van je project.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
