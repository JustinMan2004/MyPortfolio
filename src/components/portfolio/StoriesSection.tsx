import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Sparkles,
  BookMarked,
  HelpCircle,
  Lightbulb,
  X,
  Check,
} from 'lucide-react';
import { StoryItem, StoryType } from '../../portfolioTypes';

interface StoriesSectionProps {
  stories: StoryItem[];
  selectedSprintFilter: number | 'all';
  onSelectSprintFilter: (sprint: number | 'all') => void;
  onAddStory?: (story: StoryItem) => void;
  onDeleteStory?: (id: string) => void;
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  selectedSprintFilter,
  onSelectSprintFilter,
  onAddStory,
  onDeleteStory,
}) => {
  const [activeType, setActiveType] = useState<StoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New story form state
  const [formSprint, setFormSprint] = useState<number>(1);
  const [formType, setFormType] = useState<StoryType>('Research Story');
  const [formTitle, setFormTitle] = useState('');
  const [formContext, setFormContext] = useState('');
  const [formApproach, setFormApproach] = useState('');
  const [formOutcome, setFormOutcome] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formOutcomeIds, setFormOutcomeIds] = useState<number[]>([1]);
  const [error, setError] = useState('');

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (selectedSprintFilter !== 'all' && story.sprintNumber !== selectedSprintFilter) {
        return false;
      }
      if (activeType !== 'all' && story.type !== activeType) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = story.title.toLowerCase().includes(q);
        const matchesContext = story.context.toLowerCase().includes(q);
        const matchesApproach = story.approachOrUserStory.toLowerCase().includes(q);
        const matchesOutcome = story.outcomeOrConclusion.toLowerCase().includes(q);
        const matchesTags = story.tags.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesContext || matchesApproach || matchesOutcome || matchesTags;
      }
      return true;
    });
  }, [stories, selectedSprintFilter, activeType, searchQuery]);

  const typeBadgeColors = (type: StoryType) => {
    switch (type) {
      case 'Research Story':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'User Story':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Learning Story':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const typeIcon = (type: StoryType) => {
    switch (type) {
      case 'Research Story':
        return <HelpCircle className="w-3.5 h-3.5" />;
      case 'User Story':
        return <BookMarked className="w-3.5 h-3.5" />;
      case 'Learning Story':
        return <Lightbulb className="w-3.5 h-3.5" />;
    }
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formTitle.trim() || !formContext.trim() || !formApproach.trim() || !formOutcome.trim()) {
      setError('Vul alstublieft alle 3 de onderdelen (Context, Aanpak, Uitkomst) in.');
      return;
    }

    if (onAddStory) {
      const newStory: StoryItem = {
        id: `story-${Date.now()}`,
        sprintNumber: Number(formSprint),
        type: formType,
        title: formTitle.trim(),
        context: formContext.trim(),
        approachOrUserStory: formApproach.trim(),
        outcomeOrConclusion: formOutcome.trim(),
        tags: formTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        date: new Date().toISOString().split('T')[0],
        linkedOutcomeIds: formOutcomeIds.length > 0 ? formOutcomeIds : [1],
      };
      onAddStory(newStory);
    }

    // Reset
    setFormTitle('');
    setFormContext('');
    setFormApproach('');
    setFormOutcome('');
    setFormTags('');
    setIsAdding(false);
  };

  const toggleOutcomeCheckbox = (id: number) => {
    setFormOutcomeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section id="stories-section" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EADFCB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#A92222] font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Story Framework</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Research, User & Learning Stories
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Wat heb ik onderzocht (Research), welke gebruikersbehoefte is opgelost (User) en welke inzichten zijn opgedaan (Learning).
          </p>
        </div>

        {/* Action button & Sprint filter */}
        <div className="flex flex-wrap items-center gap-2">
          {onAddStory && (
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#A92222] text-white hover:bg-[#8B1A1A] transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Sluiten' : 'Eigen Story Toevoegen'}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-semibold whitespace-nowrap">
              Sprint:
            </span>
            <select
              id="story-sprint-select"
              value={selectedSprintFilter}
              onChange={(e) =>
                onSelectSprintFilter(
                  e.target.value === 'all' ? 'all' : Number(e.target.value)
                )
              }
              className="text-xs bg-[#F7F1E8] border border-[#EADFCB] rounded-xl px-3 py-1.5 font-medium text-stone-800 focus:outline-hidden focus:border-[#A92222]"
            >
              <option value="all">Alle sprints (1 t/m 8)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Sprint {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Custom Story Form */}
      {isAdding && onAddStory && (
        <div className="p-6 bg-[#F7F1E8] rounded-3xl border-2 border-[#A92222]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#EADFCB] pb-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#A92222]" />
              <span>Nieuwe Story Toevoegen</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Documenteer je eigen sprintactiviteiten
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-[#A92222] rounded-xl text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateStory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Type Story</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as StoryType)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                >
                  <option value="Research Story">Research Story</option>
                  <option value="User Story">User Story</option>
                  <option value="Learning Story">Learning Story</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Sprint</label>
                <select
                  value={formSprint}
                  onChange={(e) => setFormSprint(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Sprint {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Tags (komma-gescheiden)</label>
                <input
                  type="text"
                  placeholder="AI, Gemini, Prototyping"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Titel van de Story *</label>
              <input
                type="text"
                required
                placeholder="bijv. Onderzoek naar AI Studio capabilities voor portfolio"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">1. Context & Vraagstelling *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Wat was de aanleiding of uitdaging?"
                  value={formContext}
                  onChange={(e) => setFormContext(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">2. Aanpak / User Story *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Wat heb je gedaan / getest / gebouwd?"
                  value={formApproach}
                  onChange={(e) => setFormApproach(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">3. Uitkomst & Conclusie *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Wat is het resultaat of inzicht?"
                  value={formOutcome}
                  onChange={(e) => setFormOutcome(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADFCB] rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#A92222] resize-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Koppeling met Leeruitkomsten:</label>
              <div className="flex flex-wrap gap-3 pt-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="inline-flex items-center gap-1.5 text-xs text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formOutcomeIds.includes(num)}
                      onChange={() => toggleOutcomeCheckbox(num)}
                      className="rounded border-stone-300 text-[#A92222] focus:ring-[#A92222]"
                    />
                    <span>LU-{num}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EADFCB]">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="cursor-pointer px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#A92222] hover:bg-[#8B1A1A] text-white rounded-xl shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Story Opslaan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Story Type Tabs */}
        <div className="flex flex-wrap p-1 bg-[#FAF7F2] rounded-xl border border-[#EADFCB] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveType('all')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeType === 'all'
                ? 'bg-[#F7F1E8] text-[#A92222] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Alle Stories ({stories.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveType('Research Story')}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeType === 'Research Story'
                ? 'bg-[#F7F1E8] text-blue-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Research Stories</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('User Story')}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeType === 'User Story'
                ? 'bg-[#F7F1E8] text-emerald-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
            <span>User Stories</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('Learning Story')}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeType === 'Learning Story'
                ? 'bg-[#F7F1E8] text-purple-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
            <span>Learning Stories</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Zoek in verhalen of tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F7F1E8] border border-[#EADFCB] rounded-xl text-xs placeholder:text-stone-400 focus:outline-hidden focus:border-[#A92222]"
          />
        </div>
      </div>

      {/* Stories Listing */}
      {filteredStories.length === 0 ? (
        <div className="p-12 text-center bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] text-stone-500 text-xs">
          Geen stories gevonden voor het gekozen filter of zoekterm.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="p-5 md:p-6 bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] shadow-xs hover:border-[#A92222]/30 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF7F2] pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${typeBadgeColors(
                      story.type
                    )}`}
                  >
                    {typeIcon(story.type)}
                    <span>{story.type}</span>
                  </span>
                  <span className="text-xs font-bold text-[#A92222] bg-[#FFF3F0] px-2.5 py-1 rounded-md border border-[#FFCDD2]">
                    Sprint {story.sprintNumber}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    • {story.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {story.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-[#FAF7F2] text-stone-600 px-2 py-0.5 rounded border border-[#EADFCB]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {onDeleteStory && (
                    <button
                      type="button"
                      onClick={() => onDeleteStory(story.id)}
                      className="cursor-pointer text-stone-300 hover:text-red-600 p-1 transition-colors"
                      title="Verwijder deze story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base md:text-lg font-bold text-stone-900 leading-snug">
                {story.title}
              </h3>

              {/* Three Structured Columns: Context, Aanpak/Story, Resultaat */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EADFCB] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                    1. Context & Vraagstelling
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed">
                    {story.context}
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EADFCB] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                    2. Aanpak / User Story
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">
                    {story.approachOrUserStory}
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    3. Uitkomst & Conclusie
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {story.outcomeOrConclusion}
                  </p>
                </div>
              </div>

              {/* Linked Learning Outcomes */}
              <div className="pt-2 flex items-center gap-2 text-xs text-stone-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Koppeling met minor leeruitkomsten:</span>
                <div className="flex gap-1.5">
                  {story.linkedOutcomeIds.map((outcomeId) => (
                    <span
                      key={outcomeId}
                      className="text-[11px] font-bold text-stone-700 bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EADFCB]"
                    >
                      LU-{outcomeId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
