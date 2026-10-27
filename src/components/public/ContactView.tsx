import React, { useState, useEffect } from 'react';
import { Mail, Send, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, Lock, Linkedin, Github } from 'lucide-react';
import { submitContactForm } from '../../lib/api';
import { WebsiteSettings } from '../../types';

interface ContactViewProps {
  settings: WebsiteSettings;
  initialService?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings, initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialService ? `Inquiry: ${initialService}` : '',
    message: initialService
      ? `Hello MD. Raihan Hossen Rajib,\n\nI would like to inquire about your ${initialService} service for our platform...`
      : '',
    honeypot: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({
        ...prev,
        subject: `Inquiry: ${initialService}`,
        message: `Hello MD. Raihan Hossen Rajib,\n\nI would like to discuss securing our web applications through your ${initialService} service.\n\nTarget Environment Scope:\nPrimary Concerns / Symptoms:\nTimeline:`
      }));
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      setStatus('submitting');
      setErrorMessage('');
      const response = await submitContactForm(formData);
      setStatus('success');
      setSuccessMessage(response.message || 'Your inquiry was delivered securely.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit message. Please try again.');
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <Mail className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Encrypted Communication</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Initiate an Inquiry or Security Consultation
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Request an urgent WordPress malware cleanup, schedule an authorized penetration assessment, or hire my services through Fiverr.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Contacts & Professional Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
              <span>Direct Professional Channels</span>
            </h3>

            <div className="space-y-4 text-sm">
              {/* Email */}
              <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Direct Email
                </span>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="block text-purple-300 hover:text-white font-mono break-all transition-colors"
                >
                  {settings.contactEmail}
                </a>
                <span className="text-[11px] text-slate-500 block">
                  Average response time: &lt; 4 hours
                </span>
              </div>

              {/* Fiverr Profile */}
              {settings.fiverrUrl && (
                <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Fiverr Pro Freelance Marketplace
                  </span>
                  <a
                    href={settings.fiverrUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between text-slate-200 hover:text-emerald-400 transition-colors pt-1"
                  >
                    <span className="font-semibold text-emerald-400">Order via Fiverr Protection</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                  <span className="text-[11px] text-slate-500 block">
                    Escrow-backed client protection & milestones
                  </span>
                </div>
              )}

              {/* Social Channels */}
              <div className="pt-2 flex items-center gap-3">
                {settings.linkedinUrl && (
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 p-3 rounded-xl bg-[#15111F] border border-purple-950/60 hover:border-purple-600 flex items-center justify-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-[#C084FC]" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {settings.githubUrl && (
                  <a
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 p-3 rounded-xl bg-[#15111F] border border-purple-950/60 hover:border-purple-600 flex items-center justify-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4 text-slate-400" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="p-6 rounded-2xl bg-[#101019] border border-purple-900/30 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#15111F] border border-purple-900/50 flex items-center justify-center shrink-0 text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Confidentiality Guarantee
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All inquiries concerning system breaches, vulnerability findings, and infrastructure credentials are held strictly confidential and never disclosed to unauthorized parties.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-2xl bg-[#101019] border border-purple-900/30 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Notification */}
              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Inquiry Transmitted Successfully</div>
                    <div className="text-xs text-emerald-400/90 mt-0.5">{successMessage}</div>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Failed to Submit Inquiry</div>
                    <div className="text-xs text-rose-400/90 mt-0.5">{errorMessage}</div>
                  </div>
                </div>
              )}

              {/* Honeypot field (hidden from genuine users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company_website">Company Website</label>
                <input
                  type="text"
                  id="company_website"
                  name="honeypot"
                  tabIndex={-1}
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#15111F] border border-purple-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Your Business Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="e.g. client@organization.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#15111F] border border-purple-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Engagement Subject / Objective <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  placeholder="e.g. Urgent Malware Removal / Pre-Bug-Bounty Assessment"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#15111F] border border-purple-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Detailed Scope or Symptoms <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Please describe the target platform, known error messages, suspicious redirects, or requested security evaluation scope..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#15111F] border border-purple-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              {/* Rate limit & Privacy Notice */}
              <div className="text-[11px] text-slate-500 leading-relaxed">
                Submissions are rate-limited and validated server-side. Sensitive logs or credentials can be provided following initial mutual NDA or safe channel establishment.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] disabled:opacity-50 shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <span>Encrypting & Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Security Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
