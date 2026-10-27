import React, { useState } from 'react';
import {
  FileCheck2,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  X,
  FileCode,
  ArrowRight,
  FlaskConical,
  Briefcase
} from 'lucide-react';
import { CaseStudyItem, SeverityLevel } from '../../types';

interface CaseStudiesViewProps {
  caseStudies: CaseStudyItem[];
  navigate: (path: string) => void;
}

const severityColors: Record<SeverityLevel, { text: string; bg: string; border: string }> = {
  Critical: { text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-900/50' },
  High: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-900/50' },
  Medium: { text: 'text-yellow-400', bg: 'bg-yellow-950/40', border: 'border-yellow-900/50' },
  Low: { text: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-900/50' }
};

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({ caseStudies, navigate }) => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudyItem | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = caseStudies.filter((cs) => {
    if (filterType === 'All') return true;
    return cs.engagementType.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <FileCheck2 className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Security Case Studies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Forensic Analyses & Laboratory Research
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Detailed dissections of authorized client incident remediations and controlled laboratory simulations demonstrating real-world vulnerability impact and defense engineering.
        </p>
      </div>

      {/* Engagement Type Filter Tabs */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#101019] border border-purple-900/40">
          <button
            onClick={() => setFilterType('All')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'All'
                ? 'bg-purple-900/60 text-white border border-purple-600/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Case Studies
          </button>
          <button
            onClick={() => setFilterType('Client')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterType === 'Client'
                ? 'bg-purple-900/60 text-white border border-purple-600/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Authorized Client Audits</span>
          </button>
          <button
            onClick={() => setFilterType('Laboratory')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterType === 'Laboratory'
                ? 'bg-purple-900/60 text-white border border-purple-600/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Laboratory Simulations</span>
          </button>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map((cs) => {
          const sev = severityColors[cs.findingsSeverity] || severityColors.High;
          const isLab = cs.engagementType.includes('Laboratory') || cs.engagementType.includes('Simulation');

          return (
            <div
              key={cs.id}
              className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] group"
            >
              <div className="space-y-5">
                {/* Clean Metadata Line (Zero-pill compliant) */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    {isLab ? (
                      <span className="flex items-center gap-1 text-purple-400">
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Laboratory Simulation</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Authorized Client Engagement</span>
                      </span>
                    )}
                    <span>·</span>
                    <span className={sev.text}>
                      {cs.findingsSeverity} Severity
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#C084FC] transition-colors leading-snug">
                    {cs.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                    {cs.summary}
                  </p>
                </div>

                {/* Scope & Methodology snippet */}
                <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      Authorized Scope:
                    </span>
                    <p className="text-slate-300 mt-0.5">{cs.authorizedScope}</p>
                  </div>
                  <div className="pt-2 border-t border-purple-950/40">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      Core Finding:
                    </span>
                    <p className="text-slate-300 mt-0.5">{cs.findingsSummary}</p>
                  </div>
                </div>
              </div>

              {/* Card Action */}
              <div className="pt-6 mt-6 border-t border-purple-950/40 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCaseStudy(cs)}
                  className="text-xs font-semibold uppercase tracking-wider text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Examine Sanitized Report</span>
                  <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
                </button>
                <div className="text-xs font-mono text-slate-500">
                  {cs.verificationOutcome ? 'Verified' : 'Documented'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Study Detail Modal */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-purple-300">{selectedCaseStudy.engagementType}</span>
                <span className="text-slate-600">·</span>
                <span className={severityColors[selectedCaseStudy.findingsSeverity]?.text || 'text-amber-400'}>
                  {selectedCaseStudy.findingsSeverity} Severity
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {selectedCaseStudy.title}
              </h2>
            </div>

            {/* Scope & Methodology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Authorized Scope & Boundary
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCaseStudy.authorizedScope}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Inspection Methodology
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCaseStudy.methodology}
                </p>
              </div>
            </div>

            {/* Findings & Sanitized Evidence */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Vulnerability / Incident Analysis</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedCaseStudy.findingsSummary}
                </p>
              </div>

              {selectedCaseStudy.sanitizedEvidence && (
                <div className="p-4 rounded-xl bg-[#0B0912] border border-purple-950/60 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>Sanitized Technical Evidence</span>
                  </h4>
                  <pre className="text-xs font-mono text-purple-200/90 bg-[#08080D] p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-purple-950/40">
                    {selectedCaseStudy.sanitizedEvidence}
                  </pre>
                </div>
              )}
            </div>

            {/* Remediation & Verification */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Remediation Protocol</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedCaseStudy.remediationSteps}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verification & Post-Audit Outcome</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedCaseStudy.verificationOutcome}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-purple-950/40 flex items-center justify-between">
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close Report
              </button>
              <button
                onClick={() => {
                  setSelectedCaseStudy(null);
                  navigate('/contact');
                }}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] rounded-lg shadow-lg"
              >
                Schedule Confidential Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
