import React, { useState, useMemo } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Trash2,
  Search,
  CheckCircle2,
  Layers,
  Award,
  Sparkles,
  Edit3,
  X,
  Github,
  BookOpen,
  Check,
  Tag,
  Info,
} from 'lucide-react';
import { WorkItem, LearningOutcome, WorkItemType } from '../../portfolioTypes';

interface WorkItemsSectionProps {
  workItems: WorkItem[];
  outcomes: LearningOutcome[];
  onAddWorkItem: (item: WorkItem) => void;
  onUpdateWorkItem: (item: WorkItem) => void;
  onDeleteWorkItem: (id: string) => void;
  initialSprintFilter?: number | 'all';
}

const WORK_TYPES: WorkItemType[] = [
  'Werkend Prototype',
  'Code Repository',
  'Onderzoeksverslag',
  'Show & Tell Presentatie',
  'Figma / Design',
  'Prompt Systeem',
  'Overig',
];

export const WorkItemsSection: React.FC<WorkItemsSectionProps> = ({
  workItems,
  outcomes,
  onAddWorkItem,
  onUpdateWorkItem,
  onDeleteWorkItem,
  initialSprintFilter = 'all',
}) => {
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<number | 'all'>(
    initialSprintFilter
  );
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formWhatMade, setFormWhatMade] = useState('');
  const [formHowMade, setFormHowMade] = useState('');
  const [formSprint, setFormSprint] = useState<number>(2);
  const [formType, setFormType] = useState<WorkItemType>('Werkend Prototype');
  const [formUrl, setFormUrl] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'Opgeleverd' | 'In ontwikkeling' | 'Gepresenteerd'>('Opgeleverd');
  const [formOutcomeCodes, setFormOutcomeCodes] = useState<string[]>(['LU-2']);
  const [formError, setFormError] = useState('');

  // Counts per sprint
  const countsBySprint = useMemo(() => {
    const map: Record<number, number> = {};
    for (let i = 1; i <= 8; i++) map[i] = 0;
    workItems.forEach((w) => {
      map[w.sprintNumber] = (map[w.sprintNumber] || 0) + 1;
    });
    return map;
  }, [workItems]);

  // Counts per outcome
  const countsByOutcome = useMemo(() => {
    const map: Record<string, number> = {
      'LU-1': 0,
      'LU-2': 0,
      'LU-3': 0,
      'LU-4': 0,
      'LU-5': 0,
    };
    workItems.forEach((w) => {
      const codes = w.learningOutcomeCodes || (w.learningOutcomeCode ? [w.learningOutcomeCode] : []);
      codes.forEach((c) => {
        if (map[c] !== undefined) map[c]++;
      });
    });
    return map;
  }, [workItems]);

  // Filtered list
  const filteredWorkItems = useMemo(() => {
    return workItems.filter((item) => {
      if (selectedSprintFilter !== 'all' && item.sprintNumber !== selectedSprintFilter) {
        return false;
      }
      const itemCodes = item.learningOutcomeCodes || (item.learningOutcomeCode ? [item.learningOutcomeCode] : []);
      if (selectedOutcomeFilter !== 'all' && !itemCodes.includes(selectedOutcomeFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesWhat = (item.whatMade || item.description || '').toLowerCase().includes(q);
        const matchesType = item.type.toLowerCase().includes(q);
        const matchesTech = (item.howMadeOrTech || '').toLowerCase().includes(q);
        return matchesTitle || matchesWhat || matchesType || matchesTech;
      }
      return true;
    });
  }, [workItems, selectedSprintFilter, selectedOutcomeFilter, searchQuery]);

  // Toggle single outcome linking directly on the card
  const handleToggleOutcomeOnCard = (item: WorkItem, outcomeCode: string) => {
    const currentCodes = item.learningOutcomeCodes || (item.learningOutcomeCode ? [item.learningOutcomeCode] : []);
    let newCodes: string[];
    if (currentCodes.includes(outcomeCode)) {
      // remove
      newCodes = currentCodes.filter((c) => c !== outcomeCode);
      if (newCodes.length === 0) {
        newCodes = ['LU-1']; // maintain at least one
      }
    } else {
      // add
      newCodes = [...currentCodes, outcomeCode].sort();
    }

    const updated: WorkItem = {
      ...item,
      learningOutcomeCodes: newCodes,
      learningOutcomeCode: newCodes[0],
    };
    onUpdateWorkItem(updated);
  };

  // Open modal for new item
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setFormTitle('');
    setFormWhatMade('');
    setFormHowMade('');
    setFormSprint(selectedSprintFilter === 'all' ? 2 : selectedSprintFilter);
    setFormType('Werkend Prototype');
    setFormUrl('');
    setFormGithubUrl('');
    setFormStatus('Opgeleverd');
    setFormOutcomeCodes(['LU-2']);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item: WorkItem) => {
    setEditingItemId(item.id);
    setFormTitle(item.title);
    setFormWhatMade(item.whatMade || item.description || '');
    setFormHowMade(item.howMadeOrTech || '');
    setFormSprint(item.sprintNumber);
    setFormType(item.type);
    setFormUrl(item.url || '');
    setFormGithubUrl(item.githubUrl || '');
    setFormStatus(item.status || 'Opgeleverd');
    const codes = item.learningOutcomeCodes || (item.learningOutcomeCode ? [item.learningOutcomeCode] : ['LU-1']);
    setFormOutcomeCodes(codes);
    setFormError('');
    setIsModalOpen(true);
  };

  // Submit modal form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Geef een titel op voor je stuk werk.');
      return;
    }
    if (!formWhatMade.trim()) {
      setFormError('Beschrijf wat je gemaakt hebt.');
      return;
    }
    if (formOutcomeCodes.length === 0) {
      setFormError('Selecteer minimaal één leeruitkomst waaraan dit werkstuk gekoppeld is.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (editingItemId) {
      const existing = workItems.find((w) => w.id === editingItemId);
      if (!existing) return;
      const updatedItem: WorkItem = {
        ...existing,
        title: formTitle.trim(),
        whatMade: formWhatMade.trim(),
        description: formWhatMade.trim(),
        howMadeOrTech: formHowMade.trim(),
        sprintNumber: Number(formSprint),
        type: formType,
        url: formUrl.trim(),
        githubUrl: formGithubUrl.trim(),
        status: formStatus,
        learningOutcomeCodes: formOutcomeCodes,
        learningOutcomeCode: formOutcomeCodes[0],
      };
      onUpdateWorkItem(updatedItem);
    } else {
      const newItem: WorkItem = {
        id: `work-${Date.now()}`,
        title: formTitle.trim(),
        whatMade: formWhatMade.trim(),
        description: formWhatMade.trim(),
        howMadeOrTech: formHowMade.trim(),
        sprintNumber: Number(formSprint),
        type: formType,
        url: formUrl.trim(),
        githubUrl: formGithubUrl.trim(),
        status: formStatus,
        learningOutcomeCodes: formOutcomeCodes,
        learningOutcomeCode: formOutcomeCodes[0],
        dateAdded: todayStr,
      };
      onAddWorkItem(newItem);
    }

    setIsModalOpen(false);
  };

  const handleToggleFormOutcome = (code: string) => {
    setFormOutcomeCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code].sort()
    );
  };

  return (
    <section id="work-items-section" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 bg-[#F7F1E8] rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-[#941F1F] font-bold text-xs uppercase tracking-wider">
            <FolderGit2 className="w-4 h-4" />
            <span>Overzicht Gerealiseerd Werk • Bewijzen per Leeruitkomst</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Elk stuk werk op een kaartje, gekoppeld aan de leeruitkomsten
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-normal">
            Hier zie je per kaartje precies wat er gemaakt is. Klik op de leeruitkomst-knoppen (LU-1 t/m LU-5) op elk kaartje om het werk direct aan één of meerdere leeruitkomsten te koppelen of ontkoppelen.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="add-new-work-item-btn"
            type="button"
            onClick={handleOpenAddModal}
            className="cursor-pointer inline-flex items-center gap-2 bg-[#941F1F] hover:bg-[#781818] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nieuw Stuk Werk Toevoegen</span>
          </button>
        </div>
      </div>

      {/* Interactive Sprint Filter Strip */}
      <div className="bg-[#F7F1E8] p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#941F1F]" />
            <span>Filter op Sprint:</span>
          </span>
          <span className="text-[11px] text-stone-500">
            {filteredWorkItems.length} {filteredWorkItems.length === 1 ? 'stuk werk' : 'stukken werk'} zichtbaar
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedSprintFilter('all')}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSprintFilter === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            Alle sprints ({workItems.length})
          </button>

          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
            const count = countsBySprint[s] || 0;
            const isSelected = selectedSprintFilter === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSprintFilter(isSelected ? 'all' : s)}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#941F1F] text-white border-[#941F1F] shadow-xs'
                    : count > 0
                    ? 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    : 'bg-stone-50/50 text-stone-400 border-stone-200/60 hover:text-stone-600'
                }`}
              >
                <span>Sprint {s}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : count > 0
                      ? 'bg-stone-200/70 text-stone-800'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & LU Filter Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Zoek in wat je gemaakt hebt, titels, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#F7F1E8] border border-stone-200 rounded-2xl text-stone-900 focus:outline-hidden focus:border-[#941F1F] shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        {/* Filter by Learning Outcome */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-stone-600 mr-1 hidden sm:inline flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-stone-500" />
            <span>Filter op Leeruitkomst:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedOutcomeFilter('all')}
            className={`cursor-pointer px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedOutcomeFilter === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-[#F7F1E8] border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Alle
          </button>
          {outcomes.map((o) => {
            const count = countsByOutcome[o.code] || 0;
            const isSelected = selectedOutcomeFilter === o.code;
            return (
              <button
                key={o.code}
                type="button"
                onClick={() =>
                  setSelectedOutcomeFilter(selectedOutcomeFilter === o.code ? 'all' : o.code)
                }
                className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-[#F7F1E8] border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
                title={o.title}
              >
                <span>{o.code}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredWorkItems.length === 0 ? (
          <div className="col-span-1 md:col-span-2 p-12 text-center bg-[#F7F1E8] rounded-3xl border border-stone-200 space-y-3">
            <p className="text-stone-600 font-medium text-sm">
              Geen stukken werk gevonden voor deze selectie.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941F1F] text-white text-xs font-bold shadow-xs hover:bg-[#781818]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Voeg een nieuw stuk werk toe</span>
            </button>
          </div>
        ) : (
          filteredWorkItems.map((item) => {
            const itemCodes =
              item.learningOutcomeCodes ||
              (item.learningOutcomeCode ? [item.learningOutcomeCode] : []);

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 bg-[#F7F1E8] rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Card Top Metadata & Controls */}
                  <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-extrabold bg-[#FFF1EE] text-[#941F1F] px-2.5 py-0.5 rounded-lg border border-[#FFCDD2]">
                        Sprint {item.sprintNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200">
                        {item.type}
                      </span>
                      {item.status && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.status === 'Opgeleverd'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'Gepresenteerd'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="cursor-pointer text-stone-400 hover:text-stone-800 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                        title="Bewerken"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteWorkItem(item.id)}
                        className="cursor-pointer text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title of the piece of work */}
                  <h3 className="font-extrabold text-stone-900 text-base sm:text-lg leading-snug">
                    {item.title}
                  </h3>

                  {/* Wat heb je gemaakt? prominent section */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Wat is er gemaakt:
                    </span>
                    <p className="text-xs sm:text-[13px] text-stone-800 leading-relaxed font-normal">
                      {item.whatMade || item.description || 'Geen toelichting opgegeven.'}
                    </p>
                  </div>

                  {/* Tools / Waarmee gemaakt */}
                  {item.howMadeOrTech && (
                    <div className="flex items-center gap-2 text-xs text-stone-500 pt-0.5">
                      <Tag className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-[11px] text-stone-600 font-medium">
                        {item.howMadeOrTech}
                      </span>
                    </div>
                  )}

                  {/* Koppeling aan de 5 Leeruitkomsten (Interactive toggle right on card!) */}
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Gekoppelde Leeruitkomsten:</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        Klik om direct te koppelen
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {outcomes.map((o) => {
                        const isLinked = itemCodes.includes(o.code);
                        return (
                          <button
                            key={o.code}
                            type="button"
                            onClick={() => handleToggleOutcomeOnCard(item, o.code)}
                            className={`cursor-pointer py-1.5 px-1 rounded-xl text-center border transition-all ${
                              isLinked
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-1 ring-emerald-700'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-400 border-stone-200 hover:text-stone-700'
                            }`}
                            title={`${o.code}: ${o.title} (klik om te ${isLinked ? 'ontkoppelen' : 'koppelen'})`}
                          >
                            <div className="flex items-center justify-center gap-0.5">
                              {isLinked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              <span className="text-[11px] font-extrabold">{o.code}</span>
                            </div>
                            <span
                              className={`text-[9px] block truncate font-medium ${
                                isLinked ? 'text-emerald-100' : 'text-stone-400'
                              }`}
                            >
                              {o.code === 'LU-1'
                                ? 'Impact'
                                : o.code === 'LU-2'
                                ? 'Oplossing'
                                : o.code === 'LU-3'
                                ? 'Ethiek'
                                : o.code === 'LU-4'
                                ? 'Tools'
                                : 'Zelfsturend'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer with action links */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-stone-400">
                    Opgeslagen: {item.dateAdded}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.url && item.url !== '#stories' && item.url !== '#feedback' && item.url !== '#projects' ? (
                      <a
                        href={item.url}
                        target={item.url.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="cursor-pointer inline-flex items-center gap-1.5 font-bold text-[#941F1F] hover:text-[#781818] bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl border border-[#FFCDD2]/60 transition-all active:scale-95"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : null}

                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl border border-stone-200 transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F7F1E8] rounded-3xl border border-stone-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#941F1F]" />
                <h3 className="font-extrabold text-base sm:text-lg text-stone-900">
                  {editingItemId ? 'Stuk Werk Bewerken' : 'Nieuw Stuk Werk Toevoegen'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-[#941F1F] rounded-xl text-xs font-bold border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Titel van het stuk werk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="bijv. Digitaal Dagboek Prototype (Sprint 2)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#941F1F]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Wat heb je gemaakt? * (Korte omschrijving)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Beschrijf wat je precies gebouwd, onderzocht of opgeleverd hebt..."
                  value={formWhatMade}
                  onChange={(e) => setFormWhatMade(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#941F1F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Sprint (1 t/m 8)
                  </label>
                  <select
                    value={formSprint}
                    onChange={(e) => setFormSprint(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#941F1F]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sprint {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Type stuk werk
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as WorkItemType)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#941F1F]"
                  >
                    {WORK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Waarmee gemaakt / Tools &amp; Technologieën (optioneel)
                </label>
                <input
                  type="text"
                  placeholder="bijv. Google AI Studio, React 19, Gemini 3.8 Flash, SheetJS"
                  value={formHowMade}
                  onChange={(e) => setFormHowMade(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#941F1F]"
                />
              </div>

              {/* Koppel Leeruitkomsten checkboxes */}
              <div className="space-y-1.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="font-bold text-stone-800 block text-xs">
                  Koppel aan Leeruitkomsten * (kies 1 of meer):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 pt-1">
                  {outcomes.map((o) => {
                    const isChecked = formOutcomeCodes.includes(o.code);
                    return (
                      <button
                        key={o.code}
                        type="button"
                        onClick={() => handleToggleFormOutcome(o.code)}
                        className={`cursor-pointer p-2 rounded-xl text-left border transition-all ${
                          isChecked
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                            : 'bg-[#F7F1E8] hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs">{o.code}</span>
                          {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                        <span
                          className={`text-[10px] block truncate font-medium ${
                            isChecked ? 'text-emerald-100' : 'text-stone-500'
                          }`}
                        >
                          {o.title.split(' ')[0]}...
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Link / Demo URL (optioneel)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... of #diary"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#941F1F]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    GitHub Repo URL (optioneel)
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-[#F7F1E8] focus:outline-hidden focus:border-[#941F1F]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-5 py-2 bg-[#941F1F] hover:bg-[#781818] text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingItemId ? 'Wijzigingen Opslaan' : 'Stuk Werk Toevoegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
