import React, { useState } from 'react';
import { Cpu, CheckCircle2, Shield, Wrench, Search, Terminal, Code2 } from 'lucide-react';
import { SkillItem } from '../../types';

interface SkillsViewProps {
  skills: SkillItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  'WordPress Security': <Shield className="w-4 h-4 text-rose-400" />,
  'Penetration Testing': <Terminal className="w-4 h-4 text-violet-400" />,
  'Development & Scripting': <Code2 className="w-4 h-4 text-indigo-400" />,
  'OSINT & Reconnaissance': <Search className="w-4 h-4 text-sky-400" />,
  'Security Tools': <Wrench className="w-4 h-4 text-emerald-400" />
};

export const SkillsView: React.FC<SkillsViewProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'WordPress Security',
    'Penetration Testing',
    'Development & Scripting',
    'OSINT & Reconnaissance',
    'Security Tools'
  ];

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  // Group by category for structured overview
  const grouped = filteredSkills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillItem[]>);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <Cpu className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Technical Competencies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Skills, Tools & Security Specializations
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Applied technical disciplines spanning forensic malware analysis, offensive simulation methodologies, Python/Django defense architecture, and passive threat intelligence.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
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
      </div>

      {/* Structured Skills Grid */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div
            key={category}
            className="p-6 sm:p-8 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-6"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-purple-950/40">
              <div className="p-2 rounded-lg bg-[#15111F] border border-purple-900/40">
                {categoryIcons[category] || <Cpu className="w-4 h-4 text-purple-400" />}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {category}
              </h3>
              <span className="text-xs text-slate-400 font-mono ml-auto tabular-nums">
                {items.length} Competencies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {items.map((skill) => (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      {skill.isHighlighted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span>{skill.name}</span>
                    </span>
                    <span className="font-mono text-purple-300 tabular-nums">
                      {skill.proficiency}%
                    </span>
                  </div>
                  {/* Subtle refined progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#15111F] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6D28D9] to-[#C084FC] transition-all duration-700"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
