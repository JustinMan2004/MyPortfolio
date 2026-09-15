import React, { useState } from 'react';
import {
  Wrench,
  Code2,
  Terminal,
  Copy,
  Check,
  Cpu,
  Layers,
} from 'lucide-react';
import { AIToolItem } from '../../portfolioTypes';

interface ToolsSectionProps {
  tools: AIToolItem[];
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ tools }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'LLM & API', 'AI Coding & Agents', 'Design & Prompts', 'Data & ML'];

  const filteredTools = tools.filter((tool) =>
    selectedCategory === 'all' ? true : tool.category === selectedCategory
  );

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="tools-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFCB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#A92222] font-bold text-xs uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Tech Stack & Instrumentarium</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Gebruikte AI-Tools en Technieken
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Het actuele register van modellen, SDK’s, promptingtechnieken en frameworks ingezet tijdens de sprints.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EADFCB]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-[#F7F1E8] text-[#A92222] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat === 'all' ? 'Alle categorieën' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="p-6 bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] shadow-xs hover:border-[#A92222]/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF3F0] text-[#A92222] flex items-center justify-center font-bold">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 leading-tight">
                      {tool.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-stone-500">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {tool.usedInSprints.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-bold bg-[#FAF7F2] text-[#A92222] px-2 py-0.5 rounded border border-[#EADFCB]"
                    >
                      Sprint {s}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                {tool.description}
              </p>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADFCB] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Hoe toegepast in de praktijk:
                </span>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {tool.howApplied}
                </p>
              </div>
            </div>

            {/* Code / Prompt snippet */}
            {tool.promptOrCodeSnippet && (
              <div className="pt-2 border-t border-[#EADFCB]/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-stone-600">
                    <Terminal className="w-3.5 h-3.5 text-stone-500" />
                    Voorbeeld Code / Prompt fragment
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyCode(tool.promptOrCodeSnippet!, tool.id)
                    }
                    className="cursor-pointer inline-flex items-center gap-1 text-[11px] text-[#A92222] hover:text-[#7A1212] font-semibold"
                  >
                    {copiedId === tool.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Gekopieerd!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Kopieer</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 bg-stone-900 text-stone-100 text-[11px] font-mono rounded-xl overflow-x-auto leading-relaxed border border-stone-800">
                  {tool.promptOrCodeSnippet}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
