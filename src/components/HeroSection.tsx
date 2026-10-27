import React from 'react';
import { ArrowRight, ShieldCheck, Mail, ExternalLink, Github, Linkedin, Shield, CheckCircle2, Lock } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { TypewriterText } from './TypewriterText';

interface HeroSectionProps {
  settings: WebsiteSettings;
  navigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, navigate }) => {
  return (
    <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Background Cyber Blue-Purple Atmosphere Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two-Column Split Hero with anchored top alignment to prevent any shaking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Personal Identity, Typewriter Headline, and Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Prominent Name and Shield Logo Placed Nicely Here */}
            <div className="inline-flex items-center gap-3 p-2 pr-5 rounded-2xl bg-[#0C0F24]/90 border border-indigo-900/50 shadow-[0_0_25px_rgba(56,189,248,0.15)] backdrop-blur-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2563EB] via-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] shrink-0">
                <Shield className="w-6 h-6 text-cyan-200" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-black tracking-tight text-white font-sans flex items-center gap-1.5">
                  <span>{settings.siteName || 'MD. RAIHAN HOSSEN RAJIB'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="text-[11px] font-mono text-cyan-300 tracking-wider uppercase font-semibold">
                  CYBERSECURITY SPECIALIST & ETHICAL DEFENDER
                </div>
              </div>
            </div>

            {/* Typewriter Animated Headline with Rock-Solid Fixed Height & Top-Anchor */}
            <div className="h-[125px] sm:h-[110px] md:h-[115px] lg:h-[135px] flex items-start overflow-hidden">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-black text-white tracking-tight leading-[1.2]">
                <TypewriterText
                  phrases={[
                    'Securing Digital Assets. Strengthening Web Applications.',
                    'Eradicating WordPress Malware & Stealth Backdoors.',
                    'Authorized Web Application Penetration Testing.',
                    'Ethical OSINT & Digital Threat Profiling.',
                    'Python & Django Secure Software Architecture.'
                  ]}
                  typingSpeed={55}
                  deletingSpeed={28}
                  pauseTime={2400}
                  className="bg-gradient-to-r from-white via-sky-100 to-indigo-200 bg-clip-text text-transparent"
                />
              </h1>
            </div>

            {/* Introduction Lead Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {settings.heroDescription ||
                'Specialized in WordPress Malware Removal, Defense Hardening, Authorized Web Application Penetration Testing, Ethical OSINT, and Python/Django Security.'}
            </p>

            {/* Primary Action Buttons in Blue-Purple */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/projects')}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#3B82F6] hover:via-[#6366F1] hover:to-[#8B5CF6] rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-300" />
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-[#0C0F24] hover:bg-[#121633] border border-indigo-900/50 hover:border-sky-500/50 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Contact Me</span>
                <Mail className="w-4 h-4 text-sky-400" />
              </button>
            </div>

            {/* Configurable Fiverr & Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-3">
              {settings.fiverrUrl && (
                <a
                  href={settings.fiverrUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0C0F24] border border-indigo-900/50 text-xs font-medium text-slate-300 hover:text-white hover:border-emerald-500/50 transition-colors shadow-sm"
                >
                  <span className="font-bold text-emerald-400 text-sm">fi.</span>
                  <span>Hire on Fiverr</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2.5 rounded-xl bg-[#0C0F24] border border-indigo-900/50 text-slate-300 hover:text-white hover:border-sky-500/50 transition-colors shadow-sm"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-sky-400" />
                </a>
              )}

              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2.5 rounded-xl bg-[#0C0F24] border border-indigo-900/50 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors shadow-sm"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-2.5 rounded-xl bg-[#0C0F24] border border-indigo-900/50 text-slate-300 hover:text-white hover:border-purple-500/50 transition-colors shadow-sm"
                  aria-label="Email Directly"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Profile Circular Frame anchored with self-start */}
          <div className="lg:col-span-5 flex justify-center self-start items-center lg:pt-2">
            <div className="relative group animate-avatar-float">
              {/* Outer Blue-Purple Ambient Aura Pulse */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 blur-[40px] opacity-50 group-hover:opacity-80 transition-opacity animate-pulse-aura" />

              {/* Rotating Gradient Border Ring */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-88 md:h-88 rounded-full p-[5px] overflow-hidden flex items-center justify-center">
                {/* Continuous rotating gradient layer */}
                <div
                  className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#38bdf8,#2563eb,#7c3aed,#c084fc,#38bdf8)] animate-spin-slow opacity-90"
                  style={{ willChange: 'transform' }}
                />

                {/* Inner circular frame holding the actual image */}
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0C0F24] z-10 flex items-center justify-center shadow-2xl border-2 border-[#060814]">
                  {settings.profilePhotoUrl ? (
                    <img
                      src={settings.profilePhotoUrl}
                      alt={settings.siteName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.photo-fallback');
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}

                  {/* Fallback container */}
                  <div
                    className="photo-fallback w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#121633] to-[#060814] text-center p-6 select-none"
                    style={{ display: settings.profilePhotoUrl ? 'none' : 'flex' }}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#2563EB]/40 to-[#8B5CF6]/40 border border-sky-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                      <Shield className="w-10 h-10 text-cyan-300" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                      {settings.siteName.split(' ')[0]} {settings.siteName.split(' ').slice(-1)[0]}
                    </span>
                    <span className="text-xs text-sky-300 font-medium tracking-wide mt-1">
                      Ethical Security Specialist
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Mini Card */}
              <div className="absolute -bottom-2 right-2 bg-[#0C0F24]/95 backdrop-blur-md border border-indigo-700/50 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Active Security Audits</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-[11px] text-slate-400">Arena Web Security Alumnus</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width KPI / Trust Metrics Row in Blue-Purple */}
        <div className="mt-16 pt-10 border-t border-indigo-950/40 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-[#0C0F24]/70 border border-indigo-950/60 shadow-sm hover:border-sky-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 font-mono tracking-tight tabular-nums">
              100%
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              Manual Malware Remediation
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F24]/70 border border-indigo-950/60 shadow-sm hover:border-indigo-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-mono tracking-tight tabular-nums">
              0%
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              Reinfection Recurrence
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F24]/70 border border-indigo-950/60 shadow-sm hover:border-purple-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-mono tracking-tight tabular-nums">
              1-Year
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              Ethical Hacking Diploma
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F24]/70 border border-indigo-950/60 shadow-sm hover:border-sky-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono tracking-tight tabular-nums">
              7 Core
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              Specialized Service Domains
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
