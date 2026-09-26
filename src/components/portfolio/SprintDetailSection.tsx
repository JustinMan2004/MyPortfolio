import React from 'react';
import { ArrowLeft, CheckCircle2, ExternalLink, FileText, MessageSquareQuote, Plus, Target } from 'lucide-react';
import { EvidenceLink, FeedbackReflectionItem, LearningOutcome, SprintData, StoryItem } from '../../portfolioTypes';
import { SprintStatusBadge, SprintStatusSelect } from './SprintStatus';

interface SprintDetailSectionProps {
  sprint: SprintData;
  stories: StoryItem[];
  evidenceLinks: EvidenceLink[];
  outcomes: LearningOutcome[];
  feedbacks: FeedbackReflectionItem[];
  onBack: () => void;
  onAddEvidence: () => void;
  onSetStatus: (status: SprintData['status']) => void;
}

const storyType = (type: StoryItem['type']) => ({
  'User Story': 'US',
  'Research Story': 'RS',
  'Learning Story': 'LS',
}[type]);

const levelLabel = { V: 'Voldoende', O: 'Onvoldoende', '-': 'Niet beoordeeld' } as const;
const levelClass = { V: 'status-done', O: 'status-active', '-': 'status-empty' } as const;

const actionLabel = (item: EvidenceLink) => {
  const url = (item.url || '').toLowerCase();
  if (url.endsWith('.pdf')) return 'Open PDF';
  if (url.endsWith('.xlsx') || url.endsWith('.xls') || url.endsWith('.docx') || url.endsWith('.pptx')) return 'Download bestand';
  if (url.includes('onedrive') || url.includes('sharepoint') || url.includes('1drv.ms')) return 'Open in OneDrive';
  return 'Bekijk bewijs';
};

const Placeholder: React.FC<{ text: string }> = ({ text }) => <p className="placeholder-text">{text}</p>;

export const SprintDetailSection: React.FC<SprintDetailSectionProps> = ({
  sprint, stories, evidenceLinks, outcomes, feedbacks, onBack, onAddEvidence, onSetStatus,
}) => {
  const linkedOutcomeIds = Array.from(new Set(stories.flatMap((story) => story.linkedOutcomeIds)));
  const evidenceCodes = new Set(evidenceLinks.flatMap((item) => item.learningOutcomeCodes || []));
  const linkedOutcomes = outcomes.filter((outcome) => linkedOutcomeIds.includes(outcome.id) || evidenceCodes.has(outcome.code));
  const selfEvaluation = sprint.selfEvaluation || [];
  const sprintFeedback = sprint.feedback || [];
  const reflection = sprint.reflection;

  return (
    <section className="sprint-detail space-y-8">
      <button type="button" onClick={onBack} className="back-link"><ArrowLeft /> Terug naar sprintoverzicht</button>
      <header className="detail-header">
        <div>
          <span className="eyebrow">Sprint {sprint.number}{sprint.theme ? ` · ${sprint.theme}` : ''}</span>
          <h1>{sprint.title}</h1>
          {sprint.summary ? <p>{sprint.summary}</p> : <Placeholder text="Samenvatting van deze sprint nog invullen." />}
        </div>
        <div className="detail-meta">
          <span>{sprint.period || 'Nog geen periode ingevuld'}</span>
          <SprintStatusBadge status={sprint.status} />
          <SprintStatusSelect sprintNumber={sprint.number} status={sprint.status} onChange={onSetStatus} />
        </div>
      </header>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">01</span><h2>Stories</h2></div><span className="section-count">{stories.length} stories</span></div>
        {stories.length ? <div className="detail-list">{stories.map((story) => <article className="detail-card" key={story.id}>
          <div className="detail-card-top"><span className="story-code">{storyType(story.type)} · {story.type}</span><span>{story.date}</span></div>
          <h3>{story.title}</h3>
          {story.description && <p className="story-description">“{story.description}”</p>}
          <dl className="story-fields">
            <div><dt>Context</dt><dd>{story.context || <span className="placeholder-inline">Nog aanvullen</span>}</dd></div>
            <div><dt>Aanpak</dt><dd>{story.approachOrUserStory || <span className="placeholder-inline">Nog aanvullen</span>}</dd></div>
            <div className="story-field-wide"><dt>Resultaat</dt><dd>{story.outcomeOrConclusion || <span className="placeholder-inline">Nog aanvullen</span>}</dd></div>
            {!!story.acceptanceCriteria?.length && <div><dt>Acceptatiecriteria</dt><dd><ol className="criteria-list">{story.acceptanceCriteria.map((criterion, index) => <li key={index}>{criterion}</li>)}</ol></dd></div>}
            {!!story.qualityCriteria?.length && <div><dt>Kwaliteitscriteria</dt><dd><ol className="criteria-list">{story.qualityCriteria.map((criterion, index) => <li key={index}>{criterion}</li>)}</ol></dd></div>}
          </dl>
          <div className="tag-row">
            {outcomes.filter((outcome) => story.linkedOutcomeIds.includes(outcome.id)).map((outcome) => <span key={outcome.id} className="tag-outcome">{outcome.code}</span>)}
            {story.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </article>)}</div> : <EmptyState text="Er zijn nog geen stories aan deze sprint toegevoegd." />}
      </section>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">02</span><h2>Werkzaamheden</h2></div><span className="section-count">Wat heb ik gedaan?</span></div>
        {sprint.activities?.length ? <ul className="activity-list">{sprint.activities.map((activity, index) => <li key={index}><CheckCircle2 />{activity}</li>)}</ul> : <EmptyState text="De werkzaamheden van deze sprint zijn nog niet ingevuld." />}
      </section>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">03</span><h2>Bewijs</h2></div><button type="button" onClick={onAddEvidence} className="secondary-button"><Plus /> Bewijs toevoegen</button></div>
        {evidenceLinks.length ? <div className="evidence-grid">{evidenceLinks.map((item) => {
          const storyTitles = stories.filter((story) => item.storyIds?.includes(story.id)).map((story) => story.title);
          return <article className="evidence-card" key={item.id}><div className="evidence-icon"><FileText /></div><div>
            <span className="evidence-type">{item.type}</span><h3>{item.title}</h3><p>{item.description || item.whatMade}</p>
            {item.howMadeOrTech && <p className="evidence-meta"><strong>Gebruikte tools:</strong> {item.howMadeOrTech}</p>}
            {storyTitles.length > 0 && <p className="evidence-meta"><strong>Hoort bij:</strong> {storyTitles.join(', ')}</p>}
            <p className="evidence-meta"><strong>Toont aan:</strong> {(item.learningOutcomeCodes || []).join(' / ') || item.learningOutcomeCode || '—'}</p>
            <div className="evidence-links">{item.url
              ? <a href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined} rel={item.url.startsWith('http') ? 'noreferrer' : undefined} download={item.url.startsWith('/bewijs/') ? '' : undefined}>{actionLabel(item)} <ExternalLink /></a>
              : <span className="placeholder-inline">Bewijs volgt — link of bestand nog toevoegen</span>}</div>
          </div></article>;
        })}</div> : <EmptyState text="Er zijn nog geen bewijsstukken aan deze sprint toegevoegd." action={<button type="button" onClick={onAddEvidence} className="secondary-button"><Plus /> Eerste bewijs toevoegen</button>} />}
      </section>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">04</span><h2>Leeruitkomsten</h2></div></div>
        <div className="outcome-grid">{linkedOutcomes.length ? linkedOutcomes.map((outcome) => {
          const evaluation = selfEvaluation.find((item) => item.code === outcome.code);
          return <article className="outcome-mini" key={outcome.id}><span className="outcome-code">{outcome.code}</span><h3>{outcome.title}</h3>{evaluation && <span className={`status ${levelClass[evaluation.level]}`}>{levelLabel[evaluation.level]}</span>}<p>{outcome.officialDescription}</p><small>{evidenceLinks.filter((item) => (item.learningOutcomeCodes || []).includes(outcome.code)).length} bewijsstukken in deze sprint</small></article>;
        }) : <EmptyState text="Leeruitkomsten verschijnen zodra stories of bewijs aan deze sprint zijn gekoppeld." />}</div>
      </section>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">05</span><h2>Feedback</h2></div><span className="section-count">Ontvangen van anderen</span></div>
        {sprintFeedback.length || feedbacks.length ? <div className="detail-list">
          {sprintFeedback.map((item, index) => <article className="detail-card" key={`sprint-feedback-${index}`}>
            <div className="detail-card-top"><span className="story-code"><MessageSquareQuote className="inline w-3.5 h-3.5 mr-1" />{item.from || 'Afzender nog invullen'}</span><span>{item.date}</span></div>
            <dl className="story-fields">
              <div><dt>Feedback</dt><dd>{item.feedback || <span className="placeholder-inline">Geen feedback ontvangen</span>}</dd></div>
              <div><dt>Mijn actie</dt><dd>{item.action || <span className="placeholder-inline">Nog invullen</span>}</dd></div>
            </dl>
          </article>)}
          {feedbacks.map((feedback) => <article className="detail-card" key={feedback.id}><div className="detail-card-top"><span className="story-code">{feedback.sourcePerson}</span></div><p>{feedback.receivedFeedback}</p><dl className="story-fields"><div className="story-field-wide"><dt>Mijn actie</dt><dd>{feedback.reflectionAction}</dd></div></dl></article>)}
        </div> : <EmptyState text="Nog geen feedback vastgelegd voor deze sprint." />}
      </section>

      <section className="detail-section reflection-block"><div className="section-heading"><div><span className="eyebrow">06</span><h2>Zelfevaluatie</h2></div><span className="section-count">Argumentatie en bewijs per leeruitkomst</span></div>
        {selfEvaluation.length ? selfEvaluation.map((item) => {
          const outcome = outcomes.find((o) => o.code === item.code);
          return <div className="evaluation-row" key={item.code}><strong>{item.code}</strong><div><span className={`status ${levelClass[item.level]}`}>{levelLabel[item.level]}</span>{outcome && <span className="evaluation-title">{outcome.title}</span>}{item.argument ? <p>{item.argument}</p> : <p className="placeholder-inline">{item.level === '-' ? 'In deze sprint (nog) niet beoordeeld.' : 'Argumentatie nog invullen.'}</p>}</div></div>;
        }) : <EmptyState text="De zelfevaluatie voor deze sprint is nog niet ingevuld." />}
      </section>

      <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">07</span><h2>Reflectie</h2></div>{reflection?.date && <span className="section-count">{reflection.date}</span>}</div>
        {reflection ? <div className="reflection-grid">
          {[['Wat heb ik geleerd?', reflection.learned], ['Wat behoud ik?', reflection.keep], ['Wat ga ik anders doen?', reflection.change]].map(([question, answer]) => <article className="detail-card" key={question}><h3>{question}</h3>{answer ? <p>{answer}</p> : <Placeholder text="Nog invullen." />}</article>)}
        </div> : <EmptyState text="De reflectie volgt na afronding van deze sprint." />}
      </section>
    </section>
  );
};

const EmptyState: React.FC<{ text: string; action?: React.ReactNode }> = ({ text, action }) => <div className="empty-state"><Target /><p>{text}</p>{action}</div>;
