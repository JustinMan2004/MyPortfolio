import { useState } from 'react';
import { profile } from '../content/profile';
import { assetUrl } from '../lib/content';

/** Profielfoto uit profile.ts; zonder foto (of als hij niet laadt) worden initialen getoond. */
export function ProfilePhoto({ className = '' }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  if (profile.photo && !failed) {
    return (
      <img
        src={assetUrl(profile.photo)}
        alt={`Foto van ${profile.name}`}
        onError={() => setFailed(true)}
        className={`flex-none rounded-2xl border border-line object-cover shadow-sm ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex flex-none items-center justify-center rounded-2xl border border-line bg-accent-soft text-4xl font-semibold text-accent ${className}`}
      aria-label="Plek voor profielfoto"
      title="Voeg een foto toe in src/content/profile.ts"
    >
      {initials}
    </div>
  );
}
