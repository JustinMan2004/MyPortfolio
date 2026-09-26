import React from 'react';
import {
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  CircleDashed,
} from 'lucide-react';
import { SprintData } from '../../portfolioTypes';
import { SprintStatusBadge, SprintStatusSelect } from './SprintStatus';

interface SprintsSectionProps {
  sprints: SprintData[];
  selectedSprintNumber: number;
  onSelectSprint: (sprintNumber: number) => void;
  onViewSprintDetail: (sprintNumber: number) => void;
  onSetSprintStatus: (sprintNumber: number, status: SprintData['status']) => void;
}

export const SprintsSection: React.FC<SprintsSectionProps> = ({
  sprints,
  selectedSprintNumber,
  onSelectSprint,
  onViewSprintDetail,
  onSetSprintStatus,
}) => {
  return (
    <section id="sprints-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFCB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#A92222] font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Curriculum & Voortgang</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Overzicht van de Acht Sprints
          </h2>
        </div>
        <p className="text-xs text-stone-700 bg-[#F7F1E8] px-3 py-1.5 rounded-xl border border-[#EADFCB]">
          Klik op een sprint om direct gerelateerde stories en bewijzen te zien
        </p>
      </div>

      {/* Grid of 8 Sprints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sprints.map((sprint) => {
          const isSelected = sprint.number === selectedSprintNumber;

          return (
            <div
              key={sprint.number}
              onClick={() => onSelectSprint(sprint.number)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#F7F1E8] border-[#A92222] shadow-md ring-2 ring-[#A92222]/20'
                  : 'bg-[#F7F1E8] hover:bg-[#FAF7F2] border-[#EADFCB]'
              }`}
            >
              <div className="space-y-3">
                {/* Sprint Header & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-base text-[#A92222]">
                    Sprint 0{sprint.number}
                  </span>
                  <SprintStatusBadge status={sprint.status} />
                </div>

                <h3 className="font-bold text-sm text-stone-900 leading-snug">
                  {sprint.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2">
                  {sprint.summary}
                </p>

                {/* Focus areas tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {sprint.focusAreas.slice(0, 2).map((area, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#FAF7F2] text-stone-600 px-1.5 py-0.5 rounded border border-[#EADFCB]"
                    >
                      {area}
                    </span>
                  ))}
                  {sprint.focusAreas.length > 2 && (
                    <span className="text-[10px] text-stone-400 self-center">
                      +{sprint.focusAreas.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[#EADFCB]/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {sprint.period.split('(')[0] || '—'}
                </span>
                <div className="flex items-center gap-3">
                  <SprintStatusSelect
                    sprintNumber={sprint.number}
                    status={sprint.status}
                    onChange={(status) => onSetSprintStatus(sprint.number, status)}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSprintDetail(sprint.number);
                    }}
                    className="text-[#A92222] hover:text-[#7A1212] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Bekijk</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
