import React, { useState } from 'react';
import { ShieldCheck, X, Key, Trash2 } from 'lucide-react';

interface PrivacySettingsModalProps {
  currentPin: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePin: (newPin: string | null) => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  currentPin,
  isOpen,
  onClose,
  onSavePin,
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().length < 3) {
      setError('Kies een code van minimaal 3 tekens of cijfers.');
      return;
    }
    if (pin !== confirmPin) {
      setError('De twee codes komen niet overeen.');
      return;
    }
    onSavePin(pin.trim());
    onClose();
  };

  const handleRemove = () => {
    onSavePin(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#F7F1E8] rounded-2xl border border-[#EADFCB] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-[#EADFCB] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#C62828]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#C62828]">
                {currentPin ? 'Privébeveiliging aanpassen' : 'Privébeveiliging instellen'}
              </h2>
              <p className="text-xs text-stone-600">
                Houd je verhalen afgeschermd met een toegangscode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#C62828] p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label htmlFor="new-pin" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
              {currentPin ? 'Nieuwe toegangscode' : 'Kies een toegangscode (bijv. 4 cijfers)'}
            </label>
            <input
              id="new-pin"
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError('');
              }}
              placeholder="Bijvoorbeeld: 1234"
              className="w-full py-2.5 px-3.5 border border-[#D5CEC5] rounded-xl text-stone-900 bg-[#F7F1E8] focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="confirm-pin" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
              Bevestig toegangscode
            </label>
            <input
              id="confirm-pin"
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                if (error) setError('');
              }}
              placeholder="Typ dezelfde code opnieuw"
              className="w-full py-2.5 px-3.5 border border-[#D5CEC5] rounded-xl text-stone-900 bg-[#F7F1E8] focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
            />
          </div>

          {error && (
            <p className="text-xs text-[#C62828] font-semibold bg-[#FFEBEE] border border-[#EF9A9A] p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              id="save-pin-button"
              type="submit"
              className="w-full py-2.5 px-5 bg-[#C62828] hover:bg-[#B71C1C] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Key className="w-4 h-4" />
              <span>{currentPin ? 'Nieuwe code opslaan' : 'Beveiliging inschakelen'}</span>
            </button>

            {currentPin && (
              <button
                type="button"
                onClick={handleRemove}
                className="w-full py-2 px-4 text-xs text-stone-600 hover:text-[#C62828] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Toegangscode uitschakelen (niet meer beveiligd)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
