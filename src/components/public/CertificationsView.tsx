import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, ExternalLink, GraduationCap, X, FileCheck } from 'lucide-react';
import { CertificationItem } from '../../types';

interface CertificationsViewProps {
  certifications: CertificationItem[];
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({ certifications }) => {
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <Award className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Academic & Industry Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verified Certifications & Technical Training
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Authentic educational achievements and specialized cyber security diploma credentials. No fabricated credentials or unverified claims.
        </p>
      </div>

      {/* Grid of Verified Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-2xl bg-[#101019] border border-purple-900/40 hover:border-purple-600/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.2)] group"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#15111F] border border-purple-900/50 flex items-center justify-center text-[#C084FC] group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Credential</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                  {cert.issuer}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                  {cert.title}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-slate-200 font-medium">{cert.issueDate}</span>
                </div>
                {cert.credentialId && (
                  <div className="flex items-center justify-between pt-1 border-t border-purple-950/40 font-mono">
                    <span className="text-slate-400">Credential ID:</span>
                    <span className="text-purple-300">{cert.credentialId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-950/40 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveCert(cert)}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Details</span>
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              </button>

              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1.5 text-xs font-medium text-purple-300 hover:text-white bg-[#15111F] border border-purple-900/40 hover:border-purple-600 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Verify Issuer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Certification Details Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setActiveCert(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#15111F] border border-purple-900/50 flex items-center justify-center text-[#C084FC]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                  {activeCert.issuer}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeCert.title}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Issuer Authority:</span>
                <span className="text-white font-medium">{activeCert.issuer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Award Type:</span>
                <span className="text-slate-200">{activeCert.issueDate}</span>
              </div>
              {activeCert.credentialId && (
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Verification ID:</span>
                  <span className="text-purple-300 font-semibold">{activeCert.credentialId}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verification Integrity:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authenticated Record</span>
                </span>
              </div>
            </div>

            {activeCert.certificateImage && (
              <div className="rounded-xl overflow-hidden border border-purple-900/40 max-h-60">
                <img
                  src={activeCert.certificateImage}
                  alt={activeCert.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveCert(null)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] rounded-lg shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
