import React, { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';

interface LockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ correctPin, onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === correctPin.trim()) {
      setError('');
      onUnlock();
    } else {
      setError('Onjuiste pincode. Probeer het opnieuw.');
      setPinInput('');
    }
  };

  return (
    <div id="lock-screen-container" className="min-h-screen bg-[#F7F1E8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF8F5] border border-[#EADFCB] rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-[#FFEBEE] text-[#C62828] rounded-full flex items-center justify-center mx-auto mb-5 border border-[#FFCDD2]">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-[#C62828] mb-2">
          Dagboek is vergrendeld
        </h1>
        <p className="text-sm text-stone-700 mb-6 leading-relaxed">
          Dit dagboek is beveiligd zodat je persoonlijke notities privé blijven. Voer je code in om te openen.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin-input" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
              Toegangscode
            </label>
            <div className="relative">
              <input
                id="pin-input"
                type="password"
                maxLength={8}
                inputMode="numeric"
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.4em] py-3 px-4 border border-[#D5CEC5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-stone-900 bg-[#F7F1E8]"
              />
            </div>
            {error && (
              <p className="text-xs text-[#C62828] mt-2 font-semibold">
                {error}
              </p>
            )}
          </div>

          <button
            id="unlock-submit-button"
            type="submit"
            className="w-full py-3 px-6 bg-[#C62828] hover:bg-[#B71C1C] text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Dagboek ontgrendelen</span>
          </button>
        </form>
      </div>
    </div>
  );
};
