import React, { useState, useEffect } from 'react';
import {
  User,
  Layers,
  FileText,
  FolderGit2,
  Wrench,
  MessageSquareQuote,
  Award,
  Mail,
  BookOpen,
  Link2,
  Sparkles,
  Plus,
} from 'lucide-react';
import {
  STUDENT_PROFILE,
  SPRINTS_DATA,
  LEARNING_OUTCOMES,
  STORIES_DATA,
  PROJECTS_DATA,
  AI_TOOLS_DATA,
  FEEDBACK_REFLECTIONS_DATA,
  INITIAL_EVIDENCE_LINKS,
} from '../portfolioData';
import {
  loadProfile,
  saveProfile,
  loadStoredStories,
  saveStoredStories,
  loadEvidenceLinks,
  saveEvidenceLinks,
} from '../utils';
import {
  StudentProfile,
  StoryItem,
  EvidenceLink,
} from '../portfolioTypes';
import { IntroSection } from './portfolio/IntroSection';
import { SprintsSection } from './portfolio/SprintsSection';
import { StoriesSection } from './portfolio/StoriesSection';
import { ProjectsSection } from './portfolio/ProjectsSection';
import { ToolsSection } from './portfolio/ToolsSection';
import { FeedbackSection } from './portfolio/FeedbackSection';
import { OutcomesSection } from './portfolio/OutcomesSection';
import { ContactSection } from './portfolio/ContactSection';
import { QuickAddEvidenceModal } from './portfolio/QuickAddEvidenceModal';
import { EvidenceSection } from './portfolio/EvidenceSection';

export type PortfolioTab =
  | 'intro'
  | 'evidence'
  | 'sprints'
  | 'stories'
  | 'projects'
  | 'tools'
  | 'feedback'
  | 'outcomes'
  | 'contact';

interface PortfolioAppProps {}

export const PortfolioApp: React.FC<PortfolioAppProps> = () => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('intro');
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<number | 'all'>('all');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Interactive user-editable states with local persistence
  const [profile, setProfile] = useState<StudentProfile>(() =>
    loadProfile<StudentProfile>(STUDENT_PROFILE)
  );
  const [stories, setStories] = useState<StoryItem[]>(() =>
    loadStoredStories<StoryItem>(STORIES_DATA)
  );
  const [evidenceLinks, setEvidenceLinks] = useState<EvidenceLink[]>(() =>
    loadEvidenceLinks<EvidenceLink>(INITIAL_EVIDENCE_LINKS)
  );

  // Sync with localStorage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredStories(stories);
  }, [stories]);

  useEffect(() => {
    saveEvidenceLinks(evidenceLinks);
  }, [evidenceLinks]);

  const handleSelectSprint = (sprintNumber: number) => {
    setSelectedSprintFilter(sprintNumber);
    setActiveTab('stories');
  };

  const handleNavigateToStoriesForOutcome = (outcomeId: number) => {
    setSelectedSprintFilter('all');
    setActiveTab('stories');
  };

  const handleNavigateToEvidenceForOutcome = (outcomeCode: string) => {
    setActiveTab('evidence');
  };

  // Add / delete story
  const handleAddStory = (newStory: StoryItem) => {
    setStories((prev) => [newStory, ...prev]);
  };

  const handleDeleteStory = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  // Add / update / delete evidence / work item
  const handleAddEvidenceLink = (newLink: EvidenceLink) => {
    setEvidenceLinks((prev) => [newLink, ...prev]);
  };

  const handleUpdateEvidenceLink = (updatedLink: EvidenceLink) => {
    setEvidenceLinks((prev) =>
      prev.map((item) => (item.id === updatedLink.id ? updatedLink : item))
    );
  };

  const handleDeleteEvidenceLink = (id: string) => {
    setEvidenceLinks((prev) => prev.filter((e) => e.id !== id));
  };

  // Focused, essential tabs without clutter
  const navItems = [
    { id: 'intro' as const, label: 'Profiel & Verhaal', icon: User },
    { id: 'evidence' as const, label: 'Mijn Werk & Bewijzen', icon: FolderGit2, badge: `${evidenceLinks.length}` },
    { id: 'sprints' as const, label: '8 Sprints', icon: Layers },
    { id: 'outcomes' as const, label: '5 Leeruitkomsten', icon: Award },
    { id: 'stories' as const, label: 'Stories', icon: FileText, badge: `${stories.length}` },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col selection:bg-[#A92222]/15 selection:text-[#A92222]">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-rose-50/70 via-stone-100/30 to-transparent blur-3xl opacity-60" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-stone-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo / Brand */}
            <div
              onClick={() => setActiveTab('intro')}
              className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B1A1A] via-[#A92222] to-[#C62828] text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-950/10 group-hover:scale-105 transition-transform duration-200 ring-2 ring-white">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('') || 'JM'}
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-stone-900 block leading-tight tracking-tight group-hover:text-[#A92222] transition-colors">
                  {profile.name}
                </span>
                <span className="text-[11px] font-semibold text-[#A92222] block tracking-wide">
                  Portfolio • Futureproof met AI
                </span>
              </div>
            </div>

            {/* Quick Add Evidence button & Switch to Diary Application */}
            <div className="flex items-center gap-2">
              <button
                id="quick-add-evidence-nav-btn"
                type="button"
                onClick={() => setIsQuickAddOpen(true)}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#941F1F] hover:bg-[#781818] text-white shadow-xs hover:shadow-md transition-all active:scale-95"
                title="Voeg een nieuw stuk werk toe en koppel aan leeruitkomsten"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Stuk Werk Toevoegen</span>
                <span className="sm:hidden">+ Stuk Werk</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('evidence')}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/90 transition-all shadow-2xs"
                title="Naar Mijn Werk & Bewijzen"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#941F1F]" />
                <span>Mijn Werk ({evidenceLinks.length})</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex space-x-1.5 overflow-x-auto py-2 scrollbar-none border-t border-stone-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`portfolio-nav-${item.id}`}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`cursor-pointer whitespace-nowrap inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? 'bg-[#A92222] text-white shadow-xs shadow-red-900/20'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 active:bg-stone-200/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-white' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-stone-100 text-stone-600 border border-stone-200/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'intro' && (
          <IntroSection
            profile={profile}
            onUpdateProfile={setProfile}
            onNavigateToSprints={() => setActiveTab('sprints')}
            onNavigateToProjects={() => setActiveTab('projects')}
            onNavigateToContact={() => setActiveTab('contact')}
            onNavigateToEvidence={() => setActiveTab('evidence')}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceSection
            evidenceLinks={evidenceLinks}
            outcomes={LEARNING_OUTCOMES}
            onAddEvidenceLink={handleAddEvidenceLink}
            onUpdateEvidenceLink={handleUpdateEvidenceLink}
            onDeleteEvidenceLink={handleDeleteEvidenceLink}
            onSelectSprintFilter={handleSelectSprint}
          />
        )}

        {activeTab === 'sprints' && (
          <SprintsSection
            sprints={SPRINTS_DATA}
            selectedSprintNumber={
              selectedSprintFilter === 'all' ? 2 : selectedSprintFilter
            }
            onSelectSprint={(sprintNum) => {
              setSelectedSprintFilter(sprintNum);
            }}
            onViewSprintDetail={(sprintNum) => {
              handleSelectSprint(sprintNum);
            }}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesSection
            stories={stories}
            selectedSprintFilter={selectedSprintFilter}
            onSelectSprintFilter={setSelectedSprintFilter}
            onAddStory={handleAddStory}
            onDeleteStory={handleDeleteStory}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsSection
            projects={PROJECTS_DATA}
          />
        )}

        {activeTab === 'tools' && <ToolsSection tools={AI_TOOLS_DATA} />}

        {activeTab === 'feedback' && (
          <FeedbackSection feedbacks={FEEDBACK_REFLECTIONS_DATA} />
        )}

        {activeTab === 'outcomes' && (
          <OutcomesSection
            outcomes={LEARNING_OUTCOMES}
            evidenceLinks={evidenceLinks}
            onNavigateToStoriesForOutcome={handleNavigateToStoriesForOutcome}
            onNavigateToEvidenceForOutcome={handleNavigateToEvidenceForOutcome}
          />
        )}

        {activeTab === 'contact' && <ContactSection />}
      </main>

      {/* Global Quick Add Evidence Modal */}
      <QuickAddEvidenceModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddEvidence={handleAddEvidenceLink}
        outcomes={LEARNING_OUTCOMES}
        initialSprint={selectedSprintFilter === 'all' ? 2 : selectedSprintFilter}
      />

      {/* Footer with secondary quick links */}
      <footer className="bg-white border-t border-stone-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">{profile.name}</span>
            <span>•</span>
            <span>{profile.minor}</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              className={`cursor-pointer hover:text-stone-900 transition-colors ${
                activeTab === 'tools' ? 'font-bold text-[#941F1F]' : ''
              }`}
            >
              AI-Tools &amp; Stack
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`cursor-pointer hover:text-stone-900 transition-colors ${
                activeTab === 'feedback' ? 'font-bold text-[#941F1F]' : ''
              }`}
            >
              Feedback &amp; Reflecties
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`cursor-pointer hover:text-stone-900 transition-colors ${
                activeTab === 'contact' ? 'font-bold text-[#941F1F]' : ''
              }`}
            >
              Contact
            </button>
          </div>

          <p>© 2026 HU Minor Futureproof met AI.</p>
        </div>
      </footer>
    </div>
  );
};
