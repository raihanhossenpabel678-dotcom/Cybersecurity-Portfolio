import React from 'react';
import { Award, ShieldCheck, GraduationCap, Code, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface AboutViewProps {
  settings: WebsiteSettings;
  navigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings, navigate }) => {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Professional Background</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About MD. Raihan Hossen Rajib
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          {settings.professionalTitle}. Dedicated to proactive defense, authorized vulnerability assessment, and meticulous manual remediation.
        </p>
      </div>

      {/* Main Profile Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Biography & Background */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-8 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#8B5CF6]" />
              <span>Executive Summary</span>
            </h2>
            <div className="text-slate-300 space-y-4 leading-relaxed text-sm sm:text-base">
              <p>
                {settings.bioContent}
              </p>
              <p>
                Unlike automated vulnerability scanners that dump false positives and fail to remediate deep stealth backdoors, my approach combines deep manual inspection, source code analysis, and strict adherence to ethical rules of engagement.
              </p>
              <p>
                Every investigation or security assessment is performed with surgical precision to ensure zero operational downtime, preserved data integrity, and complete eradication of malicious artifacts.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/services')}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] rounded-lg shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>View Service Areas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-[#15111F] border border-purple-800/40 rounded-lg cursor-pointer"
              >
                <span>Initiate Consultation</span>
              </button>
            </div>
          </div>

          {/* Ethical Rules of Engagement */}
          <div className="p-8 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Ethical Code & Rules of Engagement</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cybersecurity is built on unwavering integrity and trust. I uphold strict principles across every engagement:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Authorized Scope Only</span>
                </div>
                <p className="text-xs text-slate-400">
                  Assessments are conducted strictly with verified system ownership or explicit client authorization.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero-Downtime Care</span>
                </div>
                <p className="text-xs text-slate-400">
                  Non-destructive penetration payloads and staged malware removal ensure uninterrupted customer operations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Strict Confidentiality</span>
                </div>
                <p className="text-xs text-slate-400">
                  All forensic evidence, findings, and infrastructure details remain protected under strict non-disclosure.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Re-testing</span>
                </div>
                <p className="text-xs text-slate-400">
                  Post-remediation re-testing is mandatory to confirm that security gaps are completely closed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Education & Specialized Focus */}
        <div className="lg:col-span-5 space-y-8">
          {/* Verified Education & Credentials */}
          <div className="p-8 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-[#C084FC]" />
              <span>Verified Education & Training</span>
            </h2>

            <div className="space-y-6">
              {/* Item 1: Arena Web Security */}
              <div className="relative pl-6 border-l-2 border-[#7C3AED] space-y-2">
                <span className="text-xs text-[#C084FC] font-semibold tracking-wider uppercase">
                  Arena Web Security
                </span>
                <h3 className="text-base font-bold text-white">
                  Diploma in Cyber Security & Ethical Hacking
                </h3>
                <p className="text-xs text-slate-400">
                  Completed intensive 1-year academic and hands-on laboratory curriculum covering web application security, offensive counter-measures, malware analysis, network vulnerability auditing, and forensic response.
                </p>
                <div className="text-[11px] text-purple-300/80 font-mono">
                  Credential ID: AWS-DCS-VERIFIED · Status: Active
                </div>
              </div>

              {/* Item 2: Python with Django */}
              <div className="relative pl-6 border-l-2 border-[#8B5CF6] space-y-2">
                <span className="text-xs text-[#C084FC] font-semibold tracking-wider uppercase">
                  Software Engineering
                </span>
                <h3 className="text-base font-bold text-white">
                  Python with Django Development Training
                </h3>
                <p className="text-xs text-slate-400">
                  Comprehensive specialized training in Python scripting, Django framework architecture, secure ORM database models, REST API authentication, and security tool engineering.
                </p>
                <div className="text-[11px] text-purple-300/80 font-mono">
                  Status: Completed & Applied in Security Automation
                </div>
              </div>
            </div>
          </div>

          {/* Core Technical Capabilities Card */}
          <div className="p-8 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Code className="w-5 h-5 text-[#8B5CF6]" />
              <span>Core Specialization</span>
            </h2>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                <span>WordPress Malware Disinfection & Persistent Backdoor Removal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                <span>CMS Defense Hardening & Access Control Lockdown</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                <span>Authorized Web Application Penetration Testing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                <span>Ethical OSINT & Digital Footprint Reconnaissance</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                <span>Python Scripting for Security Automation & Tooling</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                <span>Django Secure Web Architecture & API Security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
