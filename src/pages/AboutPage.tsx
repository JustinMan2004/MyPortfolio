import { ExternalLink, GraduationCap, MapPin, User } from 'lucide-react';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { Paragraphs } from '../components/ui';
import { profile } from '../content/profile';

export function AboutPage() {
  return (
    <div className="container-page pt-10 sm:pt-14">
      <p className="eyebrow mb-2">Over mij</p>
      <h1 className="h-page">{profile.name}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <ProfilePhoto className="aspect-square h-auto w-full max-w-xs" />
          <div className="card space-y-3 p-5 text-sm">
            <p className="flex items-center gap-2 text-ink">
              <User className="h-4 w-4 text-accent" aria-hidden /> {profile.age} jaar
            </p>
            <p className="flex items-center gap-2 text-ink">
              <GraduationCap className="h-4 w-4 text-accent" aria-hidden /> {profile.study}, {profile.school} {profile.city}
            </p>
            <p className="flex items-center gap-2 text-ink">
              <MapPin className="h-4 w-4 text-accent" aria-hidden /> Woont in {profile.residence}
            </p>
            {profile.links.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                {profile.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary py-1.5 text-xs">
                    {l.label} <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-6">
          <section className="card p-6 sm:p-8">
            <h2 className="h-section mb-4">Wie ben ik?</h2>
            <Paragraphs items={profile.about} className="leading-relaxed" />
            <h3 className="mb-3 mt-6 text-sm font-semibold text-ink">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="chip bg-accent-soft px-2.5 py-1 text-sm text-accent-dark">
                  {i}
                </span>
              ))}
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="h-section mb-4">Waarom de minor {profile.minor}?</h2>
            <Paragraphs items={profile.whyMinor} className="leading-relaxed" />
          </section>
        </div>
      </div>
    </div>
  );
}
