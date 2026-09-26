import React, { useState } from 'react';
import { Calendar, Smile, Send, CheckCircle2 } from 'lucide-react';
import { DiaryEntry, MoodType } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { getTodayDateString } from '../utils';

interface DiaryFormProps {
  onAddEntry: (entry: DiaryEntry) => void;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({ onAddEntry }) => {
  const [date, setDate] = useState(getTodayDateString());
  const [mood, setMood] = useState<MoodType>('Blij');
  const [q1ActivitiesOrLearned, setQ1ActivitiesOrLearned] = useState('');
  const [q2WentWell, setQ2WentWell] = useState('');
  const [q3WentLessWell, setQ3WentLessWell] = useState('');
  const [q4Remember, setQ4Remember] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure at least some content is filled in
    if (!q1ActivitiesOrLearned.trim() && !q2WentWell.trim() && !q3WentLessWell.trim() && !q4Remember.trim()) {
      setErrorMessage('Vul ten minste één vraag in om je dagboeknotitie op te slaan.');
      return;
    }

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: date || getTodayDateString(),
      mood,
      q1ActivitiesOrLearned: q1ActivitiesOrLearned.trim(),
      q2WentWell: q2WentWell.trim(),
      q3WentLessWell: q3WentLessWell.trim(),
      q4Remember: q4Remember.trim(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    onAddEntry(newEntry);

    // Reset form
    setQ1ActivitiesOrLearned('');
    setQ2WentWell('');
    setQ3WentLessWell('');
    setQ4Remember('');
    setErrorMessage('');
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3500);
  };

  return (
    <section id="new-entry-form-section" className="bg-[#F7F1E8] border border-[#EADFCB] rounded-2xl shadow-xs overflow-hidden">
      <div className="p-6 border-b border-[#EADFCB] bg-[#FAF8F5]">
        <h2 className="font-serif text-xl font-bold text-[#C62828] mb-1">
          Nieuwe dagboeknotitie
        </h2>
        <p className="text-sm text-stone-700">
          Beantwoord de 4 vragen van vandaag om je dag vast te leggen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* User Story 2: Datum voorzien & User Story 4: Gevoel/stemming */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-5 border-b border-[#EADFCB]">
          {/* Datum */}
          <div>
            <label htmlFor="entry-date" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
              <span>Datum van notitie</span>
            </label>
            <input
              id="entry-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full py-2.5 px-3.5 border border-[#D5CEC5] rounded-xl text-stone-900 bg-[#F7F1E8] focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm"
              required
            />
          </div>

          {/* Gevoel / stemming */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#C62828]" />
              <span>Gevoel / stemming</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_OPTIONS.map((item) => {
                const isSelected = mood === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setMood(item.label)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFEBEE] border-[#C62828] text-[#C62828]'
                        : 'bg-[#FAF8F5] hover:bg-[#F2EFE9] border-[#D5CEC5] text-stone-800'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* De 4 vragen in het dagboek */}
        <div className="space-y-5">
          {/* Vraag 1 */}
          <div className="space-y-1.5">
            <label htmlFor="q1-activities-learned" className="block text-sm font-semibold text-stone-900">
              <span className="inline-block w-5 text-[#C62828] font-serif font-bold">1.</span>
              Wat heb je vandaag gedaan of geleerd?
            </label>
            <textarea
              id="q1-activities-learned"
              rows={3}
              value={q1ActivitiesOrLearned}
              onChange={(e) => {
                setQ1ActivitiesOrLearned(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Beschrijf je activiteiten, nieuwe inzichten of vaardigheden..."
              className="w-full p-3 border border-[#D5CEC5] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm resize-y placeholder:text-stone-500 bg-[#F7F1E8]"
            />
          </div>

          {/* Vraag 2 */}
          <div className="space-y-1.5">
            <label htmlFor="q2-went-well" className="block text-sm font-semibold text-stone-900">
              <span className="inline-block w-5 text-[#C62828] font-serif font-bold">2.</span>
              Wat ging er vandaag goed?
            </label>
            <textarea
              id="q2-went-well"
              rows={3}
              value={q2WentWell}
              onChange={(e) => {
                setQ2WentWell(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Successen, fijne momenten of dingen waar je trots of tevreden over bent..."
              className="w-full p-3 border border-[#D5CEC5] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm resize-y placeholder:text-stone-500 bg-[#F7F1E8]"
            />
          </div>

          {/* Vraag 3 */}
          <div className="space-y-1.5">
            <label htmlFor="q3-went-less-well" className="block text-sm font-semibold text-stone-900">
              <span className="inline-block w-5 text-[#C62828] font-serif font-bold">3.</span>
              Wat ging er vandaag minder goed?
            </label>
            <textarea
              id="q3-went-less-well"
              rows={3}
              value={q3WentLessWell}
              onChange={(e) => {
                setQ3WentLessWell(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Tegenslagen, lastige momenten of dingen die anders liepen dan gehoopt..."
              className="w-full p-3 border border-[#D5CEC5] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm resize-y placeholder:text-stone-500 bg-[#F7F1E8]"
            />
          </div>

          {/* Vraag 4 */}
          <div className="space-y-1.5">
            <label htmlFor="q4-remember" className="block text-sm font-semibold text-stone-900">
              <span className="inline-block w-5 text-[#C62828] font-serif font-bold">4.</span>
              Wat wil je onthouden van vandaag?
            </label>
            <textarea
              id="q4-remember"
              rows={3}
              value={q4Remember}
              onChange={(e) => {
                setQ4Remember(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Een les, inzicht, herinnering of gedachte voor later..."
              className="w-full p-3 border border-[#D5CEC5] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm resize-y placeholder:text-stone-500 bg-[#F7F1E8]"
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-xs text-[#C62828] font-semibold bg-[#FFEBEE] border border-[#EF9A9A] p-2.5 rounded-lg">
            {errorMessage}
          </p>
        )}

        {showSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Je dagboeknotitie is succesvol opgeslagen!</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            id="save-entry-button"
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C62828] hover:bg-[#B71C1C] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Notitie opslaan</span>
          </button>
        </div>
      </form>
    </section>
  );
};
