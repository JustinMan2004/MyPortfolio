import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Quote } from 'lucide-react';

const STORAGE_KEY = 'dagboek_spreuk_van_de_dag';

interface StoredQuote {
  date: string;
  quote: string;
}

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchQuote = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quote');
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Serverfout (${response.status}) bij het ophalen van de spreuk.`);
      }

      const data = await response.json();
      if (!data.quote) {
        throw new Error('Geen geldige spreuk ontvangen van de server.');
      }

      setQuote(data.quote);
      const today = getTodayDateString();
      const itemToStore: StoredQuote = { date: today, quote: data.quote };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemToStore));
    } catch (err: any) {
      console.error('Fout bij ophalen van spreuk:', err);
      setError(err?.message || 'Er is een onverwachte fout opgetreden bij het ophalen van de spreuk.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = getTodayDateString();
    const rawStored = localStorage.getItem(STORAGE_KEY);

    if (rawStored) {
      try {
        const parsed: StoredQuote = JSON.parse(rawStored);
        if (parsed.date === today && parsed.quote?.trim()) {
          setQuote(parsed.quote);
          return;
        }
      } catch (e) {
        console.warn('Kon opgeslagen spreuk niet lezen:', e);
      }
    }

    // New day or no stored quote yet -> automatically fetch daily quote
    fetchQuote(false);
  }, []);

  return (
    <section
      id="spreuk-van-de-dag-section"
      className="bg-[#FAF8F5] border border-[#EADFCB] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all"
    >
      {/* Subtle decorative background quote icon */}
      <Quote className="absolute -right-3 -bottom-4 w-24 h-24 text-[#C62828]/5 pointer-events-none select-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#FFEBEE] text-[#C62828] flex items-center justify-center border border-[#FFCDD2]">
              <Sparkles className="w-4 h-4 text-[#C62828]" />
            </span>
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#C62828]">
              Spreuk van de dag
            </h2>
          </div>

          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider bg-white px-2.5 py-1 rounded-md border border-[#EADFCB]">
            Dagelijkse inspiratie
          </span>
        </div>

        {/* Content Area: Loading, Error or Quote */}
        <div className="min-h-[64px] flex flex-col justify-center">
          {isLoading ? (
            <div id="quote-loading-indicator" className="flex items-center gap-3 py-2 text-stone-700">
              <RefreshCw className="w-5 h-5 text-[#C62828] animate-spin shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-stone-800">
                  Even geduld, Gemini genereert een nieuwe spreuk...
                </p>
                <div className="h-2 w-48 bg-[#FFEBEE] rounded-full animate-pulse" />
              </div>
            </div>
          ) : error ? (
            <div
              id="quote-error-banner"
              className="p-3.5 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl text-[#C62828] text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#C62828] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">Kon geen spreuk ophalen</p>
                  <p className="text-stone-700 text-xs leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                id="retry-quote-button"
                type="button"
                onClick={() => fetchQuote(true)}
                className="self-start sm:self-center shrink-0 px-3 py-1 bg-white hover:bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Opnieuw proberen
              </button>
            </div>
          ) : quote ? (
            <div id="quote-text-container" className="py-1">
              <blockquote className="font-serif text-base sm:text-lg text-stone-900 italic leading-relaxed">
                "{quote}"
              </blockquote>
            </div>
          ) : (
            <p className="text-sm text-stone-600 italic">
              Klik hieronder om een inspirerende spreuk van de dag te genereren.
            </p>
          )}
        </div>

        {/* Action Button: "Nieuwe spreuk" */}
        <div className="pt-1 flex items-center justify-between gap-3 border-t border-[#EADFCB]/70">
          <p className="text-[11px] text-stone-600">
            Gegenereerd door Gemini &middot; Iedere dag automatisch vernieuwd
          </p>

          <button
            id="new-quote-button"
            type="button"
            onClick={() => fetchQuote(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C62828] hover:bg-[#B71C1C] disabled:bg-stone-300 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Laden...' : 'Nieuwe spreuk'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
