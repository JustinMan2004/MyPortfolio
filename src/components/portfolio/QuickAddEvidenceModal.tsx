import React, { useState } from 'react';
import { X, Link2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { EvidenceLink, LearningOutcome } from '../../portfolioTypes';

interface QuickAddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvidence: (link: EvidenceLink) => void;
  outcomes: LearningOutcome[];
  initialSprint?: number;
}

const PRESET_TYPES = [
  { label: '💻 GitHub Repo', type: 'GitHub Repo' as const, prefix: 'GitHub Repo: ' },
  { label: '🚀 Live Demo / App', type: 'Live Demo' as const, prefix: 'Live Demo: ' },
  { label: '📋 Show & Tell Presentatie', type: 'Presentatie' as const, prefix: 'Presentatie: ' },
  { label: '📄 Verslag / Document', type: 'Document / Verslag' as const, prefix: 'Document: ' },
  { label: '🎨 Figma / UI Design', type: 'Figma / Design' as const, prefix: 'Figma Design: ' },
  { label: '🎥 Video Demo', type: 'Video / Demo' as const, prefix: 'Video Opname: ' },
];

export const QuickAddEvidenceModal: React.FC<QuickAddEvidenceModalProps> = ({
  isOpen,
  onClose,
  onAddEvidence,
  outcomes,
  initialSprint = 2,
}) => {
  const [sprint, setSprint] = useState<number>(initialSprint);
  const [outcomeCode, setOutcomeCode] = useState<string>('LU-2');
  const [type, setType] = useState<EvidenceLink['type']>('GitHub Repo');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_TYPES[0]) => {
    setType(preset.type);
    if (!title) {
      setTitle(preset.prefix);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError('Vul ten minste een titel en een werkende link in.');
      return;
    }

    const what = description.trim() || `Stuk werk voor ${outcomeCode} opgeleverd in Sprint ${sprint}.`;
    const newEvidence: EvidenceLink = {
      id: `work-${Date.now()}`,
      sprintNumber: sprint,
      learningOutcomeCode: outcomeCode,
      learningOutcomeCodes: [outcomeCode],
      title: title.trim(),
      url: url.trim(),
      type:
        type === 'Presentatie'
          ? 'Show & Tell Presentatie'
          : type === 'Document / Verslag'
          ? 'Onderzoeksverslag'
          : type === 'Live Demo'
          ? 'Werkend Prototype'
          : type === 'GitHub Repo'
          ? 'Code Repository'
          : 'Werkend Prototype',
      whatMade: what,
      description: what,
      status: 'Opgeleverd',
      dateAdded: new Date().toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    onAddEvidence(newEvidence);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setTitle('');
      setUrl('');
      setDescription('');
      setError('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF9F6] border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A92222] text-white flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                Snel Bewijs Toevoegen
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Koppel je werk direct aan een sprint en leeruitkomst
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-[#A92222] rounded-xl text-xs font-bold border border-red-200">
              {error}
            </div>
          )}

          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider">
              Snelle Type Selectie:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TYPES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`cursor-pointer text-xs px-2.5 py-1 rounded-lg font-medium border transition-all ${
                    type === preset.type
                      ? 'bg-[#A92222] text-white border-[#A92222] shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & URL */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Titel van het bewijsstuk *
              </label>
              <input
                type="text"
                required
                placeholder="bijv. Prototype Digitale Dagboek - Vibe-coding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#A92222] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Link / URL naar je bewijs *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="https://github.com/... of https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#A92222] transition-colors"
                />
                <Link2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Sprint selection (1-8 pills) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-stone-700 block">
              Bij welke Sprint hoort dit bewijs?
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSprint(s)}
                  className={`cursor-pointer py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    sprint === s
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  S{s}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Outcome selection (LU-1 to LU-5 pills) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-stone-700 block">
              Koppel aan Leeruitkomst:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
              {outcomes.map((o) => {
                const isSelected = outcomeCode === o.code;
                return (
                  <button
                    key={o.code}
                    type="button"
                    onClick={() => setOutcomeCode(o.code)}
                    className={`cursor-pointer p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-[#A92222] text-[#A92222] ring-1 ring-[#A92222]'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="font-extrabold text-xs block">{o.code}</span>
                    <span className="text-[10px] line-clamp-1 block text-stone-500 font-medium">
                      {o.title.split(' ')[0]}...
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="pt-1">
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Korte toelichting (optioneel)
            </label>
            <textarea
              rows={2}
              placeholder="Wat toont dit bewijsstuk aan voor je sprint of beoordeling?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#A92222] resize-none transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A92222] hover:bg-[#8F1D1D] text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-80"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Opgeslagen!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Bewijs Toevoegen</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
