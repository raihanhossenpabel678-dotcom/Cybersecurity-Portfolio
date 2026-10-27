import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Bug,
  Search,
  Terminal,
  Lock,
  Code2,
  ArrowRight,
  CheckCircle2,
  X,
  FileCheck2
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServicesViewProps {
  services: ServiceItem[];
  navigate: (path: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-rose-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
  Bug: <Bug className="w-6 h-6 text-amber-400" />,
  Search: <Search className="w-6 h-6 text-sky-400" />,
  Terminal: <Terminal className="w-6 h-6 text-purple-400" />,
  Lock: <Lock className="w-6 h-6 text-violet-400" />,
  Code2: <Code2 className="w-6 h-6 text-indigo-400" />
};

export const ServicesView: React.FC<ServicesViewProps> = ({ services, navigate }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Professional Security Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Defensive Hardening & Application Security
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Surgical malware removal, proactive CMS defense hardening, authorized penetration assessments, and custom Python/Django security tools.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] group"
          >
            <div className="space-y-4">
              {/* Icon & Scope */}
              <div className="flex items-center justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#15111F] border border-purple-900/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {iconMap[srv.iconName] || <Lock className="w-6 h-6 text-purple-400" />}
                </div>
                <div className="text-xs font-mono text-purple-300/80 text-right truncate">
                  {srv.scope}
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {srv.summary}
                </p>
              </div>

              {/* Key Deliverables Preview */}
              <div className="pt-2 border-t border-purple-950/40 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Key Deliverables:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {srv.deliverables.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                  {srv.deliverables.length > 3 && (
                    <li className="text-[11px] text-purple-400 font-medium pl-5">
                      +{srv.deliverables.length - 3} additional deliverables
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-4 border-t border-purple-950/40 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedService(srv)}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Read Full Scope</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>

              <button
                onClick={() => navigate(`/contact?service=${encodeURIComponent(srv.title)}`)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-900/60 hover:bg-[#7C3AED] border border-purple-700/50 rounded-lg transition-colors cursor-pointer"
              >
                Inquire Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#15111F] border border-purple-900/50 flex items-center justify-center">
                  {iconMap[selectedService.iconName] || <Lock className="w-6 h-6 text-purple-400" />}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedService.title}
                  </h2>
                  <div className="text-xs text-purple-400 font-mono mt-0.5">
                    Engagement Scope: {selectedService.scope}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Detailed Service Overview
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedService.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-purple-950/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Comprehensive Deliverables & Guarantees</span>
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedService.deliverables.map((deliv, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#15111F] border border-purple-950/50 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-purple-950/40 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close Scope
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    navigate(`/contact?service=${encodeURIComponent(selectedService.title)}`);
                  }}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] rounded-lg shadow-lg"
                >
                  Request Assessment for this Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
