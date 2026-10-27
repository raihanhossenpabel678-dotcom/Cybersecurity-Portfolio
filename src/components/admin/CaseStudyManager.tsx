import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  AlertCircle
} from 'lucide-react';
import { CaseStudyItem, EngagementType, SeverityLevel } from '../../types';
import {
  createAdminCaseStudy,
  updateAdminCaseStudy,
  deleteAdminCaseStudy
} from '../../lib/api';

interface CaseStudyManagerProps {
  caseStudies: CaseStudyItem[];
  onRefresh: () => void;
}

export const CaseStudyManager: React.FC<CaseStudyManagerProps> = ({
  caseStudies,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudyItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    engagementType: 'Authorized Client Engagement' as EngagementType,
    authorizedScope: '',
    methodology: '',
    findingsSummary: '',
    findingsSeverity: 'High' as SeverityLevel,
    sanitizedEvidence: '',
    remediationSteps: '',
    verificationOutcome: '',
    isPublished: true,
    sortOrder: 0
  });

  const openCreateModal = () => {
    setEditingCaseStudy(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      engagementType: 'Authorized Client Engagement',
      authorizedScope: '',
      methodology: '',
      findingsSummary: '',
      findingsSeverity: 'High',
      sanitizedEvidence: '',
      remediationSteps: '',
      verificationOutcome: '',
      isPublished: true,
      sortOrder: caseStudies.length + 1
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (cs: CaseStudyItem) => {
    setEditingCaseStudy(cs);
    setFormData({
      title: cs.title,
      slug: cs.slug,
      summary: cs.summary,
      engagementType: cs.engagementType,
      authorizedScope: cs.authorizedScope,
      methodology: cs.methodology,
      findingsSummary: cs.findingsSummary,
      findingsSeverity: cs.findingsSeverity,
      sanitizedEvidence: cs.sanitizedEvidence || '',
      remediationSteps: cs.remediationSteps,
      verificationOutcome: cs.verificationOutcome,
      isPublished: cs.isPublished,
      sortOrder: cs.sortOrder
    });
    setError('');
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingCaseStudy ? prev.slug : slug
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        engagementType: formData.engagementType,
        authorizedScope: formData.authorizedScope,
        methodology: formData.methodology,
        findingsSummary: formData.findingsSummary,
        findingsSeverity: formData.findingsSeverity,
        sanitizedEvidence: formData.sanitizedEvidence,
        remediationSteps: formData.remediationSteps,
        verificationOutcome: formData.verificationOutcome,
        isPublished: formData.isPublished,
        sortOrder: Number(formData.sortOrder)
      };

      if (editingCaseStudy) {
        await updateAdminCaseStudy(editingCaseStudy.id, payload);
      } else {
        await createAdminCaseStudy(payload);
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (cs: CaseStudyItem) => {
    try {
      await updateAdminCaseStudy(cs.id, { isPublished: !cs.isPublished });
      onRefresh();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminCaseStudy(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting case study: ' + err.message);
    }
  };

  const filtered = caseStudies.filter(
    (cs) =>
      cs.title.toLowerCase().includes(search.toLowerCase()) ||
      cs.engagementType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-purple-400" />
            <span>Case Study & Threat Analysis Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage authorized client assessments, laboratory research, and sanitized reports.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Case Study</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search case studies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101019] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Total: {caseStudies.length}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#101019] border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15111F] text-slate-400 uppercase tracking-wider font-semibold border-b border-purple-950/50">
              <tr>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Engagement Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/40 text-slate-300">
              {filtered.map((cs) => (
                <tr key={cs.id} className="hover:bg-[#15111F]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{cs.title}</div>
                    <div className="text-[11px] text-purple-400/80 font-mono">{cs.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {cs.engagementType}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[11px]">
                    <span
                      className={
                        cs.findingsSeverity === 'Critical'
                          ? 'text-rose-400'
                          : cs.findingsSeverity === 'High'
                          ? 'text-amber-400'
                          : 'text-yellow-400'
                      }
                    >
                      {cs.findingsSeverity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(cs)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        cs.isPublished
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {cs.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{cs.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cs)}
                      className="p-1.5 rounded-lg bg-[#15111F] border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cs.id)}
                      className="p-1.5 rounded-lg bg-[#15111F] border border-rose-900/30 text-rose-400 hover:text-rose-200 hover:border-rose-600 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">
                {editingCaseStudy ? 'Edit Case Study' : 'Create Case Study'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clearly label whether this is an authorized client audit or laboratory simulation.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white font-mono focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Engagement Type *</label>
                  <select
                    value={formData.engagementType}
                    onChange={(e) => setFormData({ ...formData, engagementType: e.target.value as EngagementType })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="Authorized Client Engagement">Authorized Client Engagement</option>
                    <option value="Laboratory Assessment">Laboratory Assessment</option>
                    <option value="Ethical Security Simulation">Ethical Security Simulation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Findings Severity *</label>
                  <select
                    value={formData.findingsSeverity}
                    onChange={(e) => setFormData({ ...formData, findingsSeverity: e.target.value as SeverityLevel })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Authorized Scope *</label>
                  <input
                    type="text"
                    required
                    value={formData.authorizedScope}
                    onChange={(e) => setFormData({ ...formData, authorizedScope: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Methodology *</label>
                  <input
                    type="text"
                    required
                    value={formData.methodology}
                    onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Findings Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.findingsSummary}
                  onChange={(e) => setFormData({ ...formData, findingsSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Sanitized Evidence / PoC Code</label>
                <textarea
                  rows={3}
                  value={formData.sanitizedEvidence}
                  onChange={(e) => setFormData({ ...formData, sanitizedEvidence: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white font-mono focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Remediation Steps *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.remediationSteps}
                    onChange={(e) => setFormData({ ...formData, remediationSteps: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Verification Outcome *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.verificationOutcome}
                    onChange={(e) => setFormData({ ...formData, verificationOutcome: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-[#15111F] border-purple-900"
                  />
                  <span className="text-slate-300 font-medium">Publish to public case studies</span>
                </label>
              </div>

              <div className="pt-4 border-t border-purple-950 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-[#101019] border border-rose-900/50 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Delete Case Study?</h4>
            <p className="text-xs text-slate-400">
              This action permanently deletes the case study from the database.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
