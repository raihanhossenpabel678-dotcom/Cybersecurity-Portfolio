import React from 'react';
import { Shield, Lock, ExternalLink, Mail, Github, Linkedin } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  navigate: (path: string) => void;
  settings: WebsiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ navigate, settings }) => {
  return (
    <footer className="w-full bg-[#04060f] border-t border-indigo-950/40 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-indigo-950/30">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-slate-100 tracking-tight">
                {settings.siteName}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {settings.professionalTitle}. Dedicated to proactive web defense, verified WordPress malware remediation, ethical penetration assessments, and custom Python/Django security tools.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {settings.fiverrUrl && (
                <a
                  href={settings.fiverrUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-900/40 hover:border-sky-500 bg-[#0C0F24] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-400 font-bold">fiverr.</span>
                  <span>Fiverr Services</span>
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2 rounded-lg border border-purple-900/40 hover:border-purple-600 bg-[#101019] text-slate-300 hover:text-white transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2 rounded-lg border border-purple-900/40 hover:border-purple-600 bg-[#101019] text-slate-300 hover:text-white transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-2 rounded-lg border border-purple-900/40 hover:border-purple-600 bg-[#101019] text-slate-300 hover:text-white transition-colors"
                  aria-label="Email Directly"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Core Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Core Directory
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-[#C084FC] transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-[#C084FC] transition-colors">
                  Professional Profile
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-[#C084FC] transition-colors">
                  Security Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/projects')} className="hover:text-[#C084FC] transition-colors">
                  Audits & Projects
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/case-studies')} className="hover:text-[#C084FC] transition-colors">
                  Security Case Studies
                </button>
              </li>
            </ul>
          </div>

          {/* Credentials & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Verification & Ethics
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/certifications')} className="hover:text-[#C084FC] transition-colors">
                  Verified Certifications
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/skills')} className="hover:text-[#C084FC] transition-colors">
                  Technical Skill Matrix
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-[#C084FC] transition-colors">
                  Security Articles & Guides
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-[#C084FC] transition-colors">
                  Encrypted Inquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors text-xs font-mono pt-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Authentication</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left">
            {settings.footerText || `© 2026 ${settings.siteName}. All rights reserved.`}
          </p>
          <div className="text-center md:text-right text-slate-500">
            <span>Notice: All security assessments strictly executed under explicit authorization & ethical non-disclosure.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
