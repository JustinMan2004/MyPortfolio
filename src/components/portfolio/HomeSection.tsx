import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { SprintData, StudentProfile } from '../../portfolioTypes';
import { SprintStatusBadge } from './SprintStatus';

interface HomeSectionProps {
  profile: StudentProfile;
  sprints: SprintData[];
  evidenceCount: number;
  storyCount: number;
  onNavigateToSprints: () => void;
  onSelectSprint: (sprintNumber: number) => void;
  onSetSprintStatus: (sprintNumber: number, status: SprintData['status']) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  profile,
  sprints,
  evidenceCount,
  storyCount,
  onNavigateToSprints,
  onSelectSprint,
}) => (
  <section className="portfolio-home space-y-10">
    <div className="home-intro">
      <div className="home-kicker"><Layers className="h-4 w-4" /> Minor Futureproof met AI</div>
      <h1>{profile.name}</h1>
      <p className="home-lead">Een persoonlijk bewijsportfolio over mijn ontwikkeling, onderzoeken, projecten en leerproces tijdens de minor.</p>
      <p className="home-copy">Hier verzamel ik per sprint wat ik heb gedaan, welke leeruitkomsten ik aantoon en welk bewijs daarbij hoort.</p>
      <button type="button" onClick={onNavigateToSprints} className="primary-button">
        Bekijk alle sprints <ArrowRight className="h-4 w-4" />
      </button>
    </div>

    <div className="home-stats" aria-label="Portfolio samenvatting">
      <div><strong>8</strong><span>Sprints</span></div>
      <div><strong>5</strong><span>Leeruitkomsten</span></div>
      <div><strong>{storyCount}</strong><span>Stories</span></div>
      <div><strong>{evidenceCount}</strong><span>Bewijsstukken</span></div>
    </div>

    <div className="section-heading">
      <div><span className="eyebrow">Mijn route</span><h2>Sprintoverzicht</h2></div>
      <p>Open een sprint om activiteiten, leeruitkomsten, bewijs en reflectie samen te bekijken.</p>
    </div>

    <div className="sprint-grid">
      {sprints.map((sprint) => {
        return (
          <article
            key={sprint.number}
            onClick={() => onSelectSprint(sprint.number)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onSelectSprint(sprint.number);
            }}
            className="sprint-card"
            role="button"
            tabIndex={0}
          >
            <div className="sprint-card-top"><span>Sprint {sprint.number}</span><SprintStatusBadge status={sprint.status} /></div>
            <h3>{sprint.title}</h3>
            <p>{sprint.summary}</p>
            <span className="sprint-link">Bekijk sprint <ArrowRight /></span>
          </article>
        );
      })}
    </div>
  </section>
);
