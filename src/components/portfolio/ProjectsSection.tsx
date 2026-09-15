import React from 'react';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Check,
  UserCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ProjectSolution } from '../../portfolioTypes';

interface ProjectsSectionProps {
  projects: ProjectSolution[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
}) => {
  return (
    <section id="projects-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFCB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#A92222] font-bold text-xs uppercase tracking-wider">
            <FolderGit2 className="w-4 h-4" />
            <span>Showcase & Prototypes</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Projecten en AI-Oplossingen
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Werkende prototypes, geteste concepten en mijn concrete rol en bijdrage binnen de minor.
          </p>
        </div>

        <span className="text-xs text-stone-600 bg-[#F7F1E8] px-3 py-1.5 rounded-xl border border-[#EADFCB] font-medium shrink-0">
          {projects.length} Gerealiseerde oplossingen
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 md:p-7 bg-[#F7F1E8] rounded-3xl border border-[#EADFCB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#A92222] bg-[#FFF3F0] px-3 py-1 rounded-full border border-[#FFCDD2]">
                  Sprint {project.sprintNumber} Oplossing
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-[#FAF7F2] text-stone-700 px-2 py-0.5 rounded-md border border-[#EADFCB]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-stone-900 leading-snug">
                {project.title}
              </h3>

              {/* Problem statement */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EADFCB] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Probleemstelling
                </span>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {project.problemStatement}
                </p>
              </div>

              {/* AI Solution */}
              <div className="p-3.5 bg-[#FFF8F6] rounded-2xl border border-[#FFCDD2]/60 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A92222] block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Oplossing & Implementatie
                </span>
                <p className="text-xs text-stone-900 leading-relaxed">
                  {project.aiSolution}
                </p>
              </div>

              {/* My Role */}
              <div className="space-y-1 pt-1">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Mijn Individuele Rol & Bijdrage:
                </span>
                <p className="text-xs text-stone-600 leading-relaxed pl-5">
                  {project.myRole}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-stone-700 block">
                  Belangrijkste Opleveringen:
                </span>
                <ul className="space-y-1 pl-1">
                  {project.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-stone-600 flex items-start gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Links & CTA */}
            <div className="pt-4 border-t border-[#EADFCB] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A92222] hover:underline"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-[#FAF7F2] hover:bg-[#EADFCB]/50 px-3 py-1.5 rounded-xl border border-[#EADFCB] transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Code op GitHub</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
