import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Link2,
} from 'lucide-react';
import { LearningOutcome, EvidenceLink } from '../../portfolioTypes';

interface OutcomesSectionProps {
  outcomes: LearningOutcome[];
  evidenceLinks?: EvidenceLink[];
  onNavigateToStoriesForOutcome?: (outcomeId: number) => void;
  onNavigateToEvidenceForOutcome?: (outcomeCode: string) => void;
}

export const OutcomesSection: React.FC<OutcomesSectionProps> = ({
  outcomes,
  evidenceLinks = [],
  onNavigateToStoriesForOutcome,
  onNavigateToEvidenceForOutcome,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusColor = (status: LearningOutcome['status']) => {
    switch (status) {
      case 'Bewezen':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Aangetoond':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In ontwikkeling':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const averageProgress = Math.round(
    outcomes.reduce((acc, outcome) => {
      const evidenceCount = evidenceLinks.filter((evidence) => {
        const codes = evidence.learningOutcomeCodes ||
          (evidence.learningOutcomeCode ? [evidence.learningOutcomeCode] : []);
        return codes.includes(outcome.code);
      }).length;
      const requiredEvidence = outcome.requiredMinPass || 1;
      return acc + Math.min(100, Math.round((evidenceCount / requiredEvidence) * 100));
    }, 0) / outcomes.length
  );

  return (
    <section id="outcomes-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFCB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#A92222] font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Eindtermen & Assessment</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            De Vijf Leeruitkomsten van de Minor
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Mijn actuele voortgang en bewijslast gekoppeld aan de officiële competenties van Futureproof met AI.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="p-3 bg-[#F7F1E8] rounded-2xl border border-[#EADFCB] flex items-center gap-3 shrink-0 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Totale Voortgang
            </span>
            <span className="text-xl font-black text-[#A92222]">
              {averageProgress}%
            </span>
          </div>
          <div className="w-20 h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EADFCB]">
            <div
              className="h-full bg-[#A92222] rounded-full transition-all duration-500"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Official HU Beoordelingsnormen banner */}
      <div className="p-4 bg-[#FFF8F6] border border-[#FFCDD2] rounded-2xl flex flex-col sm:flex-row items-start gap-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-[#A92222] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
          HU
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-stone-900">
            Officiële Beoordelingsnormen & Show & Tell cyclus (8 sprints)
          </h4>
          <p className="text-stone-600 leading-relaxed">
            Per 2-wekelijkse sprint presenteer je tijdens de <strong>Show & Tell</strong> minimaal 3 bewijzen van verschillende leeruitkomsten. Voor het eindassessment geldt:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 bg-[#F7F1E8] rounded-xl border border-[#EADFCB]">
              <span className="font-bold text-stone-800 block text-[11px]">🎯 Op Niveau (Voldoende):</span>
              <span className="text-[11px] text-stone-600">
                Minimaal 24x een leeruitkomst laten beoordelen met minimaal LU1: 2x, LU2: 4x, LU3: 2x, LU4: 4x, LU5: 6x. Maximaal 1 sprint gemist.
              </span>
            </div>
            <div className="p-2.5 bg-[#F7F1E8] rounded-xl border border-[#EADFCB]">
              <span className="font-bold text-emerald-800 block text-[11px]">⭐ Boven Niveau (Goed):</span>
              <span className="text-[11px] text-stone-600">
                Minimaal 24x voldoende, geen sprint gemist, proactieve kennisdeling en overtuigende diepgang in de opdrachten.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {outcomes.map((outcome) => {
          const isExpanded = expandedId === outcome.id;
          const linkedEvidences = evidenceLinks.filter((ev) => {
            const codes =
              ev.learningOutcomeCodes ||
              (ev.learningOutcomeCode ? [ev.learningOutcomeCode] : []);
            return codes.includes(outcome.code);
          });
          const totalEvCount = linkedEvidences.length;
          const requiredEvidence = outcome.requiredMinPass || 1;
          const progressPercentage = Math.min(
            100,
            Math.round((totalEvCount / requiredEvidence) * 100)
          );
          const currentStatus: LearningOutcome['status'] =
            progressPercentage >= 100 ? 'Aangetoond' : 'In ontwikkeling';

          return (
            <div
              key={outcome.id}
              className="p-6 bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] shadow-xs hover:border-[#A92222]/30 transition-all space-y-4"
            >
              {/* Outcome Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFF3F0] text-[#A92222] font-black text-sm flex items-center justify-center border border-[#FFCDD2] shrink-0">
                    {outcome.code}
                  </span>
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-stone-900">
                      {outcome.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${statusColor(
                          currentStatus
                        )}`}
                      >
                        {currentStatus}
                      </span>
                      {outcome.requiredMinPass && (
                        <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-md border border-stone-200">
                          Minimaal {outcome.requiredMinPass}x voldoende vereist
                        </span>
                      )}
                      <span className="text-xs text-stone-500 font-medium">
                        • {totalEvCount} gekoppelde bewijsstukken
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar per outcome */}
                <div className="flex items-center gap-3 sm:w-48">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-stone-700">
                      <span>Niveau</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EADFCB]">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(outcome.id)}
                    className="cursor-pointer p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EADFCB]/50 text-stone-700 transition-all"
                    title={isExpanded ? 'Inklappen' : 'Details bekijken'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Official Description */}
              <p className="text-xs md:text-sm text-stone-700 leading-relaxed pl-1">
                {outcome.officialDescription}
              </p>

              {/* Criteria & Action dropdown */}
              {isExpanded && (
                <div className="pt-3 border-t border-[#EADFCB]/70 space-y-3">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Toetscriteria & Aantoonbare Indicatoren:
                  </span>
                  <ul className="space-y-1.5 pl-1">
                    {outcome.criteria.map((c, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-stone-700 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Show linked work items if any exist */}
                  {linkedEvidences.length > 0 && (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-stone-900 block">
                          Gekoppelde stukken werk &amp; bewijzen ({linkedEvidences.length}):
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Toont aan dat aan {outcome.code} is gewerkt
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {linkedEvidences.map((ev) => (
                          <div
                            key={ev.id}
                            className="bg-[#F7F1E8] p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold bg-[#FFF1EE] text-[#941F1F] px-2 py-0.5 rounded-md border border-[#FFCDD2]">
                                  Sprint {ev.sprintNumber}
                                </span>
                                <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                                  {ev.type}
                                </span>
                              </div>
                              {ev.url && ev.url !== '#stories' && (
                                <a
                                  href={ev.url}
                                  target={ev.url.startsWith('http') ? '_blank' : '_self'}
                                  rel="noreferrer"
                                  className="text-[#941F1F] font-bold text-xs hover:underline inline-flex items-center gap-1"
                                >
                                  <span>Bekijk</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <h5 className="font-extrabold text-stone-900 text-xs">
                              {ev.title}
                            </h5>
                            {(ev.whatMade || ev.description) && (
                              <p className="text-[11px] text-stone-600 leading-relaxed">
                                <strong className="text-stone-700 font-semibold">Wat gemaakt:</strong> {ev.whatMade || ev.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    {onNavigateToStoriesForOutcome && (
                      <button
                        type="button"
                        onClick={() => onNavigateToStoriesForOutcome(outcome.id)}
                        className="cursor-pointer text-xs font-bold text-[#A92222] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Bekijk alle stories gekoppeld aan {outcome.code}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {onNavigateToEvidenceForOutcome && (
                      <button
                        type="button"
                        onClick={() => onNavigateToEvidenceForOutcome(outcome.code)}
                        className="cursor-pointer text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Bewijzenbank filteren op {outcome.code}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
