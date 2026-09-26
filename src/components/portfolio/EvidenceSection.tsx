import React from 'react';
import { WorkItem, LearningOutcome } from '../../portfolioTypes';
import { WorkItemsSection } from './WorkItemsSection';

interface EvidenceSectionProps {
  evidenceLinks: WorkItem[];
  outcomes: LearningOutcome[];
  onAddEvidenceLink: (link: WorkItem) => void;
  onUpdateEvidenceLink?: (link: WorkItem) => void;
  onDeleteEvidenceLink: (id: string) => void;
  onSelectSprintFilter?: (sprint: number) => void;
}

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({
  evidenceLinks,
  outcomes,
  onAddEvidenceLink,
  onUpdateEvidenceLink = onAddEvidenceLink,
  onDeleteEvidenceLink,
}) => {
  return (
    <WorkItemsSection
      workItems={evidenceLinks}
      outcomes={outcomes}
      onAddWorkItem={onAddEvidenceLink}
      onUpdateWorkItem={onUpdateEvidenceLink}
      onDeleteWorkItem={onDeleteEvidenceLink}
    />
  );
};
