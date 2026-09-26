import React from 'react';
import { ArrowLeft, ExternalLink, FileText, Link2, MessageSquareQuote, Plus, Target } from 'lucide-react';
import { EvidenceLink, FeedbackReflectionItem, LearningOutcome, SprintData, StoryItem } from '../../portfolioTypes';

interface SprintDetailSectionProps {
  sprint: SprintData;
  stories: StoryItem[];
  evidenceLinks: EvidenceLink[];
  outcomes: LearningOutcome[];
  feedbacks: FeedbackReflectionItem[];
  onBack: () => void;
  onAddEvidence: () => void;
  onToggleComplete: () => void;
}

const storyType = (type: StoryItem['type']) => ({
  'User Story': 'US',
  'Research Story': 'RS',
  'Learning Story': 'LS',
}[type]);

const actionLabel = (item: EvidenceLink) => {
  const url = item.url || '';
  if (url.toLowerCase().includes('github')) return 'Bekijk GitHub';
  if (url.toLowerCase().endsWith('.pdf')) return 'Open PDF';
  if (url) return 'Bekijk bewijs';
  return 'Nog geen link';
};

export const SprintDetailSection: React.FC<SprintDetailSectionProps> = ({
  sprint, stories, evidenceLinks, outcomes, feedbacks, onBack, onAddEvidence, onToggleComplete,
}) => {
  const linkedOutcomeIds = Array.from(new Set(stories.flatMap((story) => story.linkedOutcomeIds)));
  const linkedOutcomes = outcomes.filter((outcome) => linkedOutcomeIds.includes(outcome.id));

  return (
    <section className="sprint-detail space-y-8">
      <button type="button" onClick={onBack} className="back-link"><ArrowLeft /> Terug naar sprintoverzicht</button>
      <header className="detail-header">
        <div><span className="eyebrow">Sprint {sprint.number}</span><h1>{sprint.title}</h1><p>{sprint.summary}</p></div>
        <div className="detail-meta"><span>{sprint.period || 'Nog geen periode ingevuld'}</span><span className={`status ${sprint.status === 'Afgerond' ? 'status-done' : 'status-empty'}`}>{sprint.status === 'Afgerond' ? 'Voltooid' : 'Gepland'}</span><button type="button" onClick={onToggleComplete} className="secondary-button">{sprint.status === 'Afgerond' ? 'Terug naar gepland' : 'Voltooien'}</button></div>
      </header>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">01</span><h2>Stories</h2></div><span className="section-count">{stories.length} stories</span></div>
        {stories.length ? <div className="detail-list">{stories.map((story) => <article className="detail-card" key={story.id}>
          <div className="detail-card-top"><span className="story-code">{storyType(story.type)}</span><span>{story.date}</span></div><h3>{story.title}</h3><p>{story.context}</p><dl className="story-fields"><div><dt>Uitgevoerd</dt><dd>{story.approachOrUserStory}</dd></div><div><dt>Resultaat</dt><dd>{story.outcomeOrConclusion}</dd></div></dl><div className="tag-row">{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {(story.acceptanceCriteria?.length || story.qualityCriteria?.length || story.status) && <dl className="story-fields">
            {!!story.acceptanceCriteria?.length && <div><dt>Acceptatiecriteria</dt><dd><ul>{story.acceptanceCriteria.map((criterion, index) => <li key={index}>{criterion}</li>)}</ul></dd></div>}
            {!!story.qualityCriteria?.length && <div><dt>Kwaliteitscriteria</dt><dd><ul>{story.qualityCriteria.map((criterion, index) => <li key={index}>{criterion}</li>)}</ul></dd></div>}
            {story.status && <div><dt>Status</dt><dd>{story.status}</dd></div>}
          </dl>}
        </article>)}</div> : <EmptyState text="Er zijn nog geen stories aan deze sprint toegevoegd." />}
      </section>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">02</span><h2>Leeruitkomsten</h2></div></div>
        <div className="outcome-grid">{linkedOutcomes.length ? linkedOutcomes.map((outcome) => <article className="outcome-mini" key={outcome.id}><span className="outcome-code">{outcome.code}</span><h3>{outcome.title}</h3><span className="status status-done">{outcome.status}</span><p>{outcome.officialDescription}</p><small>Gekoppeld via stories in deze sprint</small></article>) : <EmptyState text="Leeruitkomsten verschijnen zodra stories aan deze sprint zijn gekoppeld." />}</div>
      </section>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">03</span><h2>Bewijs</h2></div><button type="button" onClick={onAddEvidence} className="secondary-button"><Plus /> Bewijs toevoegen</button></div>
        {evidenceLinks.length ? <div className="evidence-grid">{evidenceLinks.map((item) => <article className="evidence-card" key={item.id}><div className="evidence-icon"><FileText /></div><div><span className="evidence-type">{item.type}</span><h3>{item.title}</h3><p>{item.description || item.whatMade}</p><div className="evidence-links"><span>{(item.learningOutcomeCodes || []).join(' / ') || item.learningOutcomeCode}</span>{item.url && <a href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined} rel={item.url.startsWith('http') ? 'noreferrer' : undefined}>{actionLabel(item)} <ExternalLink /></a>}</div></div></article>)}</div> : <EmptyState text="Er zijn nog geen bewijsstukken aan deze sprint toegevoegd." action={<button type="button" onClick={onAddEvidence} className="secondary-button"><Plus /> Eerste bewijs toevoegen</button>} />}
      </section>

      <section className="detail-columns"><section className="reflection-block"><div className="section-heading"><div><span className="eyebrow">04</span><h2>Zelfevaluatie</h2></div></div>{linkedOutcomes.length ? linkedOutcomes.map((outcome) => <div className="evaluation-row" key={outcome.id}><strong>{outcome.code}</strong><div><span className="status status-done">{outcome.status}</span><p>Deze leeruitkomst is gekoppeld aan het werk en de stories die in deze sprint zijn vastgelegd.</p><span className="evidence-reference"><Link2 /> {evidenceLinks.filter((item) => (item.learningOutcomeCodes || []).includes(outcome.code)).length} bewijsstukken gekoppeld</span></div></div>) : <EmptyState text="Zelfevaluatie volgt wanneer er leeruitkomsten zijn gekoppeld." />}</section>
        <section className="reflection-block"><div className="section-heading"><div><span className="eyebrow">05</span><h2>Reflectie & feedback</h2></div></div>{feedbacks.length ? feedbacks.map((feedback) => <article className="feedback-note" key={feedback.id}><span><MessageSquareQuote /> {feedback.sourcePerson}</span><p>{feedback.receivedFeedback}</p><strong>Wat neem ik mee?</strong><p>{feedback.reflectionAction}</p></article>) : <EmptyState text="Nog geen reflectie of feedback toegevoegd aan deze sprint." />}</section></section>
    </section>
  );
};

const EmptyState: React.FC<{ text: string; action?: React.ReactNode }> = ({ text, action }) => <div className="empty-state"><Target /><p>{text}</p>{action}</div>;
