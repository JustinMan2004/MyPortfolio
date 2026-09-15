import React from 'react';
import { Smile, BarChart2 } from 'lucide-react';
import { MOOD_OPTIONS } from '../constants';
import { DiaryEntry, MoodType } from '../types';

interface MoodOverviewProps {
  entries: DiaryEntry[];
  selectedMoodFilter: string;
  onSelectMoodFilter: (mood: string) => void;
}

export const MoodOverview: React.FC<MoodOverviewProps> = ({
  entries,
  selectedMoodFilter,
  onSelectMoodFilter,
}) => {
  // Count occurrences of each mood
  const moodCounts: Record<string, number> = {};
  for (const entry of entries) {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  }

  const totalEntries = entries.length;

  return (
    <div
      id="mood-overview-card"
      className="bg-[#FAF8F5] border border-[#EADFCB] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[#FFEBEE] text-[#C62828] flex items-center justify-center border border-[#FFCDD2]">
            <BarChart2 className="w-4 h-4 text-[#C62828]" />
          </span>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#C62828]">
              Stemmingsoverzicht
            </h3>
            <p className="text-xs text-stone-600">
              Hoe vaak iedere stemming is gekozen in jouw notities
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-[#F7F1E8] text-stone-800 rounded-full border border-[#EADFCB]">
          {totalEntries} {totalEntries === 1 ? 'keer ingevuld' : 'notities totaal'}
        </span>
      </div>

      {/* Mood breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
        {MOOD_OPTIONS.map((moodOpt) => {
          const count = moodCounts[moodOpt.label] || 0;
          const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
          const isSelected = selectedMoodFilter === moodOpt.label;

          return (
            <button
              key={moodOpt.label}
              type="button"
              onClick={() => {
                // Clicking toggles filter
                if (isSelected) {
                  onSelectMoodFilter('');
                } else {
                  onSelectMoodFilter(moodOpt.label);
                }
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                isSelected
                  ? 'bg-[#FFEBEE] border-[#C62828] ring-2 ring-[#C62828]/20 shadow-xs'
                  : 'bg-[#F7F1E8] hover:bg-[#F2EFE9] border-[#EADFCB] hover:border-[#EF9A9A]'
              }`}
              title={`Klik om te filteren op '${moodOpt.label}' (${count}x gekozen)`}
            >
              <div className="flex items-center gap-1">
                <span className="text-lg leading-none">{moodOpt.emoji}</span>
              </div>
              <span className="text-xs font-semibold text-stone-800 line-clamp-1">
                {moodOpt.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-base font-bold font-serif ${count > 0 ? 'text-[#C62828]' : 'text-stone-400'}`}>
                  {count}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  ({percentage}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedMoodFilter && (
        <div className="flex items-center justify-between text-xs pt-1 text-stone-700">
          <span>
            Gefilterd op: <strong className="text-[#C62828]">{selectedMoodFilter}</strong> ({moodCounts[selectedMoodFilter] || 0} notities)
          </span>
          <button
            onClick={() => onSelectMoodFilter('')}
            className="text-xs text-[#C62828] hover:underline font-semibold cursor-pointer"
          >
            Filter wissen
          </button>
        </div>
      )}
    </div>
  );
};
