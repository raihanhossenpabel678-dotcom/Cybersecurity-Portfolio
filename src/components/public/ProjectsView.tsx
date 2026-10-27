import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  X,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectsViewProps {
  projects: ProjectItem[];
  navigate: (path: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'WordPress Security', 'Penetration Testing', 'Development & Scripting'];

  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = selectedCategory === 'All' || proj.category === selectedCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <FolderGit2 className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Security Portfolio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Featured Security Audits & Technical Projects
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Documented security operations, malware extractions, automated OSINT profilers, and penetration assessments under verified methodology.
        </p>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Interactive Filter Segmented Control */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#101019] border border-purple-900/40 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-900/60 text-white border border-purple-600/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101019] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#101019] border border-purple-900/30 text-slate-400 space-y-2">
          <FolderGit2 className="w-8 h-8 text-purple-400 mx-auto opacity-40" />
          <div className="text-sm font-medium">No projects found matching the criteria</div>
          <div className="text-xs text-slate-500">Try adjusting your search terms or category filter</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] group"
            >
              <div className="space-y-4">
                {/* Clean Metadata (Zero-pill compliant) */}
                <div className="flex items-center gap-2 text-xs text-purple-300 font-mono">
                  <span>{proj.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{new Date(proj.createdAt).getFullYear()}</span>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#C084FC] transition-colors leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>

                {/* Technologies List */}
                <div className="pt-2 flex flex-wrap gap-1.5 text-xs text-slate-400">
                  {proj.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="font-mono text-[11px] text-purple-300/80 bg-[#15111F] px-2 py-0.5 rounded border border-purple-950/60">
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 4 && (
                    <span className="font-mono text-[11px] text-slate-500 px-1 py-0.5">
                      +{proj.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Verified Outcome Snippet */}
                {proj.verifiedResults && (
                  <div className="p-3 rounded-xl bg-[#15111F]/70 border border-purple-950/60 space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Outcome</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {proj.verifiedResults}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-6 mt-4 border-t border-purple-950/40 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveProject(proj)}
                  className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Technical Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </button>

                {proj.externalUrl && (
                  <a
                    href={proj.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-1.5 rounded-lg border border-purple-900/40 hover:border-purple-600 text-slate-400 hover:text-white transition-colors"
                    title="External Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                <span>{activeProject.category}</span>
                <span>·</span>
                <span>Documented Security Project</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {activeProject.title}
              </h2>
            </div>

            {/* Technology tags */}
            <div className="flex flex-wrap gap-2">
              {activeProject.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#15111F] border border-purple-900/60 text-purple-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Project Overview & Context
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeProject.description}
              </p>
            </div>

            {/* Technical Breakdown: Challenges & Methodology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {activeProject.challenges && (
                <div className="p-4 rounded-xl bg-[#15111F] border border-amber-950/40 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Challenges & Threat Vectors</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeProject.challenges}
                  </p>
                </div>
              )}

              {activeProject.methodology && (
                <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C084FC] flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" />
                    <span>Applied Methodology</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeProject.methodology}
                  </p>
                </div>
              )}
            </div>

            {/* Remediation & Verified Results */}
            <div className="space-y-4 pt-2">
              {activeProject.remediation && (
                <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Remediation & Defense Implemented</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeProject.remediation}
                  </p>
                </div>
              )}

              {activeProject.verifiedResults && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verified Audit Results</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeProject.verifiedResults}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-purple-950/40 flex items-center justify-between">
              <button
                onClick={() => setActiveProject(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close Project
              </button>
              <button
                onClick={() => {
                  setActiveProject(null);
                  navigate('/contact');
                }}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] rounded-lg shadow-lg"
              >
                Request Similar Security Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
