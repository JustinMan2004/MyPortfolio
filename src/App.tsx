import { useState, useEffect } from 'react';
import { Lock, Shield, BookOpen, PlusCircle } from 'lucide-react';
import { DiaryEntry } from './types';
import {
  loadEntries,
  saveEntries,
  loadPin,
  savePin,
  loadIsLocked,
  saveIsLocked,
} from './utils';
import { LockScreen } from './components/LockScreen';
import { DiaryForm } from './components/DiaryForm';
import { EntryList } from './components/EntryList';
import { EntryDetailModal } from './components/EntryDetailModal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { DailyQuote } from './components/DailyQuote';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadEntries());
  const [pin, setPin] = useState<string | null>(() => loadPin());
  const [isLocked, setIsLocked] = useState<boolean>(() => loadIsLocked());
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'schrijven' | 'bekijken'>('schrijven');

  // Persist entries on change
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  // Handle unlocking
  const handleUnlock = () => {
    setIsLocked(false);
    saveIsLocked(false);
  };

  // Handle locking
  const handleLock = () => {
    if (pin) {
      setIsLocked(true);
      saveIsLocked(true);
    } else {
      setIsPrivacyModalOpen(true);
    }
  };

  // Handle saving PIN
  const handleSavePin = (newPin: string | null) => {
    setPin(newPin);
    savePin(newPin);
    if (!newPin) {
      setIsLocked(false);
      saveIsLocked(false);
    }
  };

  // Handle adding new diary entry
  const handleAddEntry = (newEntry: DiaryEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    // Switch to view list or keep user informed
    setActiveTab('bekijken');
  };

  // Handle deleting entry
  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  // Handle toggling favorite status (star)
  const handleToggleFavorite = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
    setSelectedEntry((prev) =>
      prev && prev.id === id ? { ...prev, isFavorite: !prev.isFavorite } : prev
    );
  };

  // If locked, present the privacy lock screen
  if (isLocked && pin) {
    return <LockScreen correctPin={pin} onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-[#FFEBEE] selection:text-[#C62828]">
      {/* Top Header */}
      <header className="bg-[#FAF8F5] border-b border-[#EADFCB] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C62828] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
              D
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight text-[#C62828] leading-tight">
                Digitaal Dagboek
              </h1>
              <p className="text-xs text-stone-600">
                Eenvoudig persoonlijk dagboek
              </p>
            </div>
          </div>

          {/* Privacy controls (User Story 5) */}
          <div className="flex items-center gap-2">
            {pin ? (
              <>
                <button
                  id="lock-diary-button"
                  onClick={handleLock}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] rounded-lg transition-colors border border-[#EF9A9A]"
                  title="Dagboek nu vergrendelen"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C62828]" />
                  <span>Vergrendelen</span>
                </button>

                <button
                  id="privacy-settings-button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="p-1.5 text-stone-500 hover:text-[#C62828] rounded-lg hover:bg-[#FFEBEE] transition-colors"
                  title="Pincode beheren"
                >
                  <Shield className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                id="setup-privacy-button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] rounded-lg transition-colors border border-[#EF9A9A]"
                title="Stel een toegangscode in om je dagboek privé te houden"
              >
                <Shield className="w-3.5 h-3.5 text-[#C62828]" />
                <span>Privé beveiligen met code</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* User request: Spreuk van de dag bovenaan het dagboek */}
        <DailyQuote />

        {/* Simple Navigation Switcher */}
        <div className="flex items-center justify-between border-b border-[#EADFCB] pb-3">
          <div className="inline-flex p-1 bg-[#F5F2EC] rounded-xl border border-[#E5E0D8]">
            <button
              id="tab-schrijven"
              onClick={() => setActiveTab('schrijven')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'schrijven'
                  ? 'bg-[#C62828] text-white shadow-xs'
                  : 'text-stone-700 hover:text-[#C62828]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Notitie toevoegen</span>
            </button>

            <button
              id="tab-bekijken"
              onClick={() => setActiveTab('bekijken')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'bekijken'
                  ? 'bg-[#C62828] text-white shadow-xs'
                  : 'text-stone-700 hover:text-[#C62828]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Eerdere notities ({entries.length})</span>
            </button>
          </div>

          <div className="text-xs text-stone-600 hidden sm:block font-serif italic">
            4 vragen voor vandaag
          </div>
        </div>

        {/* View active content */}
        {activeTab === 'schrijven' ? (
          <DiaryForm onAddEntry={handleAddEntry} />
        ) : (
          <EntryList
            entries={entries}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            onDeleteEntry={handleDeleteEntry}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-600 border-t border-[#EADFCB] bg-[#FAF8F5]">
        Digitaal Dagboek &middot; Privé en eenvoudig reflecteren
      </footer>

      {/* Modals */}
      <EntryDetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onToggleFavorite={handleToggleFavorite}
      />

      <PrivacySettingsModal
        currentPin={pin}
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onSavePin={handleSavePin}
      />
    </div>
  );
}
