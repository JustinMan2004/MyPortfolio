import { useState, useEffect } from 'react';
import { DiaryEntry } from './types';
import {
  loadEntries,
  saveEntries,
  loadPin,
  savePin,
  loadIsLocked,
  saveIsLocked,
} from './utils';
import { PortfolioApp } from './components/PortfolioApp';
import { DiaryApp } from './components/DiaryApp';

export default function App() {
  const [currentAppView, setCurrentAppView] = useState<'portfolio' | 'diary'>('portfolio');
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadEntries());
  const [pin, setPin] = useState<string | null>(() => loadPin());
  const [isLocked, setIsLocked] = useState<boolean>(() => loadIsLocked());

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
  };

  // Handle deleting entry
  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Handle toggling favorite status (star)
  const handleToggleFavorite = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
  };

  if (currentAppView === 'diary') {
    return (
      <DiaryApp
        entries={entries}
        pin={pin}
        isLocked={isLocked}
        onUnlock={handleUnlock}
        onLock={handleLock}
        onSavePin={handleSavePin}
        onAddEntry={handleAddEntry}
        onDeleteEntry={handleDeleteEntry}
        onToggleFavorite={handleToggleFavorite}
        onBackToPortfolio={() => setCurrentAppView('portfolio')}
      />
    );
  }

  return (
    <PortfolioApp
      onSwitchToDiaryApp={() => setCurrentAppView('diary')}
    />
  );
}

