import React, { useState } from 'react';
import {
  MessageSquareQuote,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  TrendingUp,
  User,
  ExternalLink,
} from 'lucide-react';
import { FeedbackReflectionItem } from '../../portfolioTypes';

interface FeedbackSectionProps {
  feedbacks: FeedbackReflectionItem[];
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedbacks }) => {
  const [selectedSprint, setSelectedSprint] = useState<number | 'all'>('all');

  const filteredFeedbacks = feedbacks.filter((item) =>
    selectedSprint === 'all' ? true : item.sprintNumber === selectedSprint
  );

  return (
    <section id="feedback-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFCB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#A92222] font-bold text-xs uppercase tracking-wider">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Validering & Zelfreflectie</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Bewijsstukken, Feedback en Reflecties
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Wat vond de docent, peer of opdrachtgever, hoe kijk ik hierop terug en welke concrete actie is ondernomen?
          </p>
        </div>

        {/* Sprint filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-600 font-semibold">Sprint:</span>
          <select
            value={selectedSprint}
            onChange={(e) =>
              setSelectedSprint(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              )
            }
            className="text-xs bg-[#F7F1E8] border border-[#EADFCB] rounded-xl px-3 py-1.5 font-medium text-stone-800 focus:outline-hidden focus:border-[#A92222]"
          >
            <option value="all">Alle feedbackrondes</option>
            <option value={1}>Sprint 1</option>
            <option value={2}>Sprint 2</option>
            <option value={3}>Sprint 3</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredFeedbacks.map((item) => (
          <div
            key={item.id}
            className="p-6 md:p-8 bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] shadow-xs space-y-6"
          >
            {/* Source & Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FAF7F2] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FFF3F0] text-[#A92222] flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">
                      {item.sourcePerson}
                    </span>
                    <span className="text-[11px] font-semibold bg-[#A92222]/10 text-[#A92222] px-2 py-0.5 rounded-full">
                      {item.source}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Sprint {item.sprintNumber} Evaluatie
                  </span>
                </div>
              </div>
            </div>

            {/* Received Feedback Quote */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border-l-4 border-[#A92222] border-y border-r border-[#EADFCB] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A92222] block">
                Ontvangen Feedback
              </span>
              <p className="text-sm text-stone-900 italic leading-relaxed">
                {item.receivedFeedback}
              </p>
            </div>

            {/* Reflectie 3-stappen matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Wat ging er goed?
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {item.reflectionWentWell}
                </p>
              </div>

              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Wat kan beter?
                </span>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {item.reflectionToImprove}
                </p>
              </div>

              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-1.5">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Concrete Verbeteractie:
                </span>
                <p className="text-xs text-blue-950 leading-relaxed font-medium">
                  {item.reflectionAction}
                </p>
              </div>
            </div>

            {/* Bewijsstukken lijst */}
            <div className="pt-2 border-t border-[#EADFCB]/80 space-y-2">
              <span className="text-xs font-bold text-stone-700 block">
                Gekoppelde Bewijsstukken ({item.evidenceItems.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.evidenceItems.map((evidence, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F7F1E8] rounded-xl border border-[#EADFCB] flex items-start gap-2.5"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">
                          {evidence.title}
                        </span>
                        <span className="text-[10px] bg-[#FAF7F2] text-stone-600 px-1.5 py-0.5 rounded border border-[#EADFCB]">
                          {evidence.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-snug">
                        {evidence.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
