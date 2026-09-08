import React, { useState, useMemo } from 'react';
import { BookOpen, Calendar, Eye, Trash2, Search, Star, Filter, RotateCcw, Smile, FileSpreadsheet, Check } from 'lucide-react';
import { DiaryEntry } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { formatDutchDate } from '../utils';
import { MoodOverview } from './MoodOverview';
import { exportEntriesToExcel } from '../excelExport';

interface EntryListProps {
  entries: DiaryEntry[];
  onSelectEntry: (entry: DiaryEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [viewFavoritesOnly, setViewFavoritesOnly] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Handle Excel download of all diary notes
  const handleDownloadExcel = () => {
    try {
      setDownloadError('');
      if (entries.length === 0) {
        setDownloadError('Er zijn nog geen dagboeknotities om te downloaden.');
        return;
      }
      exportEntriesToExcel(entries);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Fout bij exporteren naar Excel:', err);
      setDownloadError(err?.message || 'Er is een fout opgetreden bij het downloaden van het Excel-bestand.');
    }
  };

  // Count favorites
  const favoritesCount = useMemo(() => {
    return entries.filter((e) => !!e.isFavorite).length;
  }, [entries]);

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        // Filter on favorites
        if (viewFavoritesOnly && !entry.isFavorite) {
          return false;
        }

        // Filter on specific date
        if (dateFilter && entry.date !== dateFilter) {
          return false;
        }

        // Filter on mood
        if (moodFilter && entry.mood !== moodFilter) {
          return false;
        }

        // Filter on text search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const searchableText = [
            entry.q1ActivitiesOrLearned || '',
            entry.q1Activities || '',
            entry.q2WentWell || '',
            entry.q3WentLessWell || '',
            entry.q2Feelings || '',
            entry.q3WentWell || '',
            entry.q4Remember || '',
            entry.mood || '',
            entry.date || '',
          ].join(' ').toLowerCase();

          if (!searchableText.includes(query)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, viewFavoritesOnly, dateFilter, moodFilter, searchQuery]);

  const hasActiveFilters = searchQuery !== '' || dateFilter !== '' || moodFilter !== '' || viewFavoritesOnly;

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setMoodFilter('');
    setViewFavoritesOnly(false);
  };

  return (
    <div className="space-y-6">
      {/* 2. Stemmingsoverzicht: Toon hoeveel keer iedere stemming is gekozen */}
      <MoodOverview
        entries={entries}
        selectedMoodFilter={moodFilter}
        onSelectMoodFilter={setMoodFilter}
      />

      {/* Main Entries Section with Search, Filters & Favorites */}
      <section
        id="previous-entries-section"
        className="bg-white border border-[#EADFCB] rounded-2xl shadow-xs overflow-hidden"
      >
        {/* Header with tabs: Alle Notities vs Favorieten */}
        <div className="p-5 sm:p-6 border-b border-[#EADFCB] bg-[#FAF8F5] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#C62828] mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C62828]" />
                <span>Eerdere dagboeknotities</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-700">
                Zoek, filter en herlees je eerdere dagen en favoriete herinneringen.
              </p>
            </div>

            {/* Actions: Download als Excel & View Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                id="download-excel-btn"
                type="button"
                onClick={handleDownloadExcel}
                disabled={entries.length === 0}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  downloadSuccess
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white hover:bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2] hover:border-[#C62828]'
                }`}
                title="Download alle dagboeknotities als Excel-bestand (.xlsx)"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gedownload!</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#C62828]" />
                    <span>Download als Excel</span>
                  </>
                )}
              </button>

              {/* View Mode Switcher: Alle Notities vs ⭐ Favorieten */}
              <div className="inline-flex p-1 bg-white rounded-xl border border-[#EADFCB]">
                <button
                  id="filter-all-notes-btn"
                  type="button"
                  onClick={() => setViewFavoritesOnly(false)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    !viewFavoritesOnly
                      ? 'bg-[#C62828] text-white shadow-2xs'
                      : 'text-stone-700 hover:text-[#C62828]'
                  }`}
                >
                  Alle notities ({entries.length})
                </button>
                <button
                  id="filter-favorites-only-btn"
                  type="button"
                  onClick={() => setViewFavoritesOnly(true)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    viewFavoritesOnly
                      ? 'bg-[#C62828] text-white shadow-2xs'
                      : 'text-stone-700 hover:text-[#C62828]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${viewFavoritesOnly ? 'fill-white text-white' : 'text-amber-500 fill-amber-400'}`} />
                  <span>Favorieten ({favoritesCount})</span>
                </button>
              </div>
            </div>
          </div>

          {downloadError && (
            <div className="p-2.5 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl text-[#C62828] text-xs">
              {downloadError}
            </div>
          )}

          {/* 1. Zoeken en filteren op tekst, datum en stemming */}
          <div className="pt-2 border-t border-[#EADFCB]/70 flex flex-col md:flex-row gap-2.5">
            {/* Tekst zoekveld */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoeken op woorden in notities..."
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-[#EADFCB] rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Datum filter */}
            <div className="relative sm:w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="date-filter-input"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#EADFCB] rounded-xl text-stone-800 focus:outline-hidden focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]"
                title="Filter op specifieke datum"
              />
            </div>

            {/* Stemming filter */}
            <div className="relative sm:w-48">
              <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <select
                id="mood-filter-select"
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#EADFCB] rounded-xl text-stone-800 focus:outline-hidden focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] appearance-none cursor-pointer"
              >
                <option value="">Alle stemmingen</option>
                {MOOD_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.emoji} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button if active */}
            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#C62828] bg-[#FFEBEE] hover:bg-[#FFCDD2] border border-[#FFCDD2] rounded-xl transition-colors cursor-pointer shrink-0"
                title="Alle filters wissen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Filters wissen</span>
              </button>
            )}
          </div>

          {/* Result counter indicator */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <span>
                Resultaten: <strong>{filteredEntries.length}</strong> van de {entries.length} notities
              </span>
              <span className="italic">
                {viewFavoritesOnly ? 'Alleen favorieten' : ''}
                {moodFilter ? ` • Stemming: ${moodFilter}` : ''}
                {dateFilter ? ` • Datum: ${dateFilter}` : ''}
                {searchQuery ? ` • Zoekterm: "${searchQuery}"` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Entries list */}
        <div className="p-5 sm:p-6">
          {entries.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-[#D5CEC5] rounded-xl bg-[#FAF8F5]">
              <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <p className="text-stone-800 font-semibold text-sm mb-1">
                Nog geen eerdere notities
              </p>
              <p className="text-stone-600 text-xs max-w-sm mx-auto">
                Voeg hierboven je eerste dagboeknotitie toe om te beginnen met het vastleggen van je dagen.
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-[#EF9A9A] rounded-xl bg-[#FFEBEE]/30 space-y-2.5">
              {viewFavoritesOnly && favoritesCount === 0 ? (
                <>
                  <Star className="w-9 h-9 text-amber-400 mx-auto fill-amber-100" />
                  <p className="text-stone-800 font-semibold text-sm">
                    Nog geen favoriete notities gemarkeerd
                  </p>
                  <p className="text-stone-600 text-xs max-w-md mx-auto leading-relaxed">
                    Klik op het <strong>sterretje</strong> bij een notitie om deze als favoriet te bewaren en snel terug te vinden.
                  </p>
                </>
              ) : (
                <>
                  <Filter className="w-9 h-9 text-stone-400 mx-auto" />
                  <p className="text-stone-800 font-semibold text-sm">
                    Geen notities gevonden
                  </p>
                  <p className="text-stone-600 text-xs max-w-md mx-auto">
                    Er zijn geen notities die overeenkomen met je huidige zoek- en filtercriteria.
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Toon alle notities</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredEntries.map((entry) => {
                const moodOption = MOOD_OPTIONS.find((m) => m.label === entry.mood);
                const isFav = !!entry.isFavorite;
                const previewText =
                  entry.q1ActivitiesOrLearned ||
                  entry.q1Activities ||
                  entry.q2WentWell ||
                  entry.q3WentLessWell ||
                  entry.q4Remember ||
                  'Geen tekst ingevuld';

                return (
                  <div
                    key={entry.id}
                    id={`entry-card-${entry.id}`}
                    className={`group p-4 rounded-xl border transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isFav
                        ? 'bg-[#FFFDF9] border-amber-200 hover:border-amber-300'
                        : 'bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] border-[#EADFCB] hover:border-[#EF9A9A]'
                    }`}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 3. Favorieten: Ster knop */}
                        <button
                          id={`favorite-btn-${entry.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(entry.id);
                          }}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isFav
                              ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                              : 'text-stone-300 hover:text-amber-500 hover:bg-stone-100'
                          }`}
                          title={isFav ? 'Verwijder uit favorieten' : 'Markeer als favoriet'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>

                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                          <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
                          <span className="capitalize">{formatDutchDate(entry.date)}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-semibold">
                          <span>{moodOption?.emoji || '🙂'}</span>
                          <span>{entry.mood}</span>
                        </span>

                        {isFav && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            <span>Favoriet</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed pl-1">
                        {previewText}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        id={`view-entry-btn-${entry.id}`}
                        onClick={() => onSelectEntry(entry)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] hover:border-[#C62828] rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C62828]" />
                        <span>Bekijk notitie</span>
                      </button>

                      {onDeleteEntry && (
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-1.5 text-stone-400 hover:text-[#C62828] hover:bg-[#FFEBEE] rounded-lg transition-colors cursor-pointer"
                          title="Verwijder notitie"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
