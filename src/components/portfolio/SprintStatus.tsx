import React from 'react';
import { CheckCircle2, CircleDashed, Clock } from 'lucide-react';
import { SprintData } from '../../portfolioTypes';

type Status = SprintData['status'];

export const SPRINT_STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'Gepland', label: 'Nog niet gestart' },
  { value: 'In uitvoering', label: 'Bezig' },
  { value: 'Afgerond', label: 'Voltooid' },
];

export const sprintStatusLabel = (status: Status) =>
  SPRINT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? 'Nog niet gestart';

/** Rustig statuslabel: groen = voltooid, oranje = bezig, grijs = nog niet gestart. */
export const SprintStatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const style =
    status === 'Afgerond'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'In uitvoering'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-stone-50 text-stone-500 border-stone-200';
  const Icon = status === 'Afgerond' ? CheckCircle2 : status === 'In uitvoering' ? Clock : CircleDashed;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${style}`}>
      <Icon className="w-3 h-3" />
      <span>{sprintStatusLabel(status)}</span>
    </span>
  );
};

/** Keuzelijst om de status van een sprint zelf te wijzigen. */
export const SprintStatusSelect: React.FC<{
  status: Status;
  onChange: (status: Status) => void;
  sprintNumber: number;
}> = ({ status, onChange, sprintNumber }) => (
  <select
    aria-label={`Status van sprint ${sprintNumber}`}
    value={status}
    onClick={(event) => event.stopPropagation()}
    onChange={(event) => onChange(event.target.value as Status)}
    className="cursor-pointer text-[11px] font-semibold text-stone-700 bg-[#FAF7F2] border border-[#EADFCB] rounded-lg px-2 py-1 hover:border-[#A92222]/50 focus:outline-hidden focus:border-[#A92222]"
  >
    {SPRINT_STATUS_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
