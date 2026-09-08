import React from 'react';
import { X, Calendar, Smile, BookOpen, Star } from 'lucide-react';
import { DiaryEntry } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { formatDutchDate } from '../utils';

interface EntryDetailModalProps {
  entry: DiaryEntry | null;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({ entry, onClose, onToggleFavorite }) => {
  if (!entry) return null;

  const moodOption = MOOD_OPTIONS.find((m) => m.label === entry.mood);
  const isFav = !!entry.isFavorite;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl border border-[#EADFCB] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-[#EADFCB] bg-[#FAF8F5] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C62828] mb-1">
              <BookOpen className="w-4 h-4 text-[#C62828]" />
              <span>Dagboeknotitie</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#C62828] capitalize">
              {formatDutchDate(entry.date)}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#C62828] p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details & Questions */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EADFCB] text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-stone-800">
                <Calendar className="w-4 h-4 text-[#C62828]" />
                <span className="font-semibold">Datum:</span>
                <span>{entry.date}</span>
              </div>

              <div className="w-1 h-1 rounded-full bg-stone-300" />

              <div className="flex items-center gap-1.5 text-stone-800">
                <Smile className="w-4 h-4 text-[#C62828]" />
                <span className="font-semibold">Stemming:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] font-semibold text-xs">
                  <span>{moodOption?.emoji || '🙂'}</span>
                  <span>{entry.mood}</span>
                </span>
              </div>
            </div>

            {onToggleFavorite && (
              <button
                id="modal-toggle-favorite-btn"
                type="button"
                onClick={() => onToggleFavorite(entry.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isFav
                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    : 'bg-white text-stone-600 border-[#EADFCB] hover:bg-[#FAF8F5] hover:text-[#C62828]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-stone-400'}`} />
                <span>{isFav ? 'Gemarkeerd als favoriet' : 'Markeer als favoriet'}</span>
              </button>
            )}
          </div>

          {/* 4 Questions & Answers */}
          <div className="space-y-6">
            {/* Vraag 1 */}
            <div className="bg-white border border-[#EADFCB] rounded-xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>Wat heb je vandaag gedaan of geleerd?</span>
              </h3>
              <p className="text-stone-900 text-sm leading-relaxed whitespace-pre-wrap pl-6">
                {(entry.q1ActivitiesOrLearned || entry.q1Activities) || <span className="text-stone-400 italic">Geen antwoord ingevuld</span>}
              </p>
            </div>

            {/* Vraag 2 */}
            <div className="bg-white border border-[#EADFCB] rounded-xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>Wat ging er vandaag goed?</span>
              </h3>
              <p className="text-stone-900 text-sm leading-relaxed whitespace-pre-wrap pl-6">
                {(entry.q2WentWell || entry.q3WentWell) || <span className="text-stone-400 italic">Geen antwoord ingevuld</span>}
              </p>
            </div>

            {/* Vraag 3 */}
            <div className="bg-white border border-[#EADFCB] rounded-xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>Wat ging er vandaag minder goed?</span>
              </h3>
              <p className="text-stone-900 text-sm leading-relaxed whitespace-pre-wrap pl-6">
                {(entry.q3WentLessWell || entry.q2Feelings) || <span className="text-stone-400 italic">Geen antwoord ingevuld</span>}
              </p>
            </div>

            {/* Vraag 4 */}
            <div className="bg-white border border-[#EADFCB] rounded-xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <span>Wat wil je onthouden van vandaag?</span>
              </h3>
              <p className="text-stone-900 text-sm leading-relaxed whitespace-pre-wrap pl-6">
                {entry.q4Remember || <span className="text-stone-400 italic">Geen antwoord ingevuld</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EADFCB] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-[#FAF8F5] text-stone-800 text-sm font-semibold rounded-xl border border-[#D5CEC5] transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
