import React, { useState } from 'react';
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  AlertCircle
} from 'lucide-react';
import { CertificationItem } from '../../types';
import {
  createAdminCertification,
  updateAdminCertification,
  deleteAdminCertification
} from '../../lib/api';

interface CertificationsManagerProps {
  certifications: CertificationItem[];
  onRefresh: () => void;
}

export const CertificationsManager: React.FC<CertificationsManagerProps> = ({
  certifications,
  onRefresh
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    verificationUrl: '',
    certificateImage: '',
    isVerified: true,
    isPublished: true,
    sortOrder: 0
  });

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      issueDate: 'Verified Diploma Credential',
      credentialId: '',
      verificationUrl: '',
      certificateImage: '',
      isVerified: true,
      isPublished: true,
      sortOrder: certifications.length + 1
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (c: CertificationItem) => {
    setEditingCert(c);
    setFormData({
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialId: c.credentialId || '',
      verificationUrl: c.verificationUrl || '',
      certificateImage: c.certificateImage || '',
      isVerified: c.isVerified,
      isPublished: c.isPublished,
      sortOrder: c.sortOrder
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        credentialId: formData.credentialId,
        verificationUrl: formData.verificationUrl,
        certificateImage: formData.certificateImage,
        isVerified: formData.isVerified,
        isPublished: formData.isPublished,
        sortOrder: Number(formData.sortOrder)
      };

      if (editingCert) {
        await updateAdminCertification(editingCert.id, payload);
      } else {
        await createAdminCertification(payload);
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (c: CertificationItem) => {
    try {
      await updateAdminCertification(c.id, { isPublished: !c.isPublished });
      onRefresh();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminCertification(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Certifications & Verified Credentials</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage authentic diplomas, certificate IDs, and issuer verification links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#101019] border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15111F] text-slate-400 uppercase tracking-wider font-semibold border-b border-purple-950/50">
              <tr>
                <th className="py-3 px-4">Credential Title</th>
                <th className="py-3 px-4">Issuer Authority</th>
                <th className="py-3 px-4">Credential ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/40 text-slate-300">
              {certifications.map((c) => (
                <tr key={c.id} className="hover:bg-[#15111F]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {c.title}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-purple-300">
                    {c.issuer}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {c.credentialId || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(c)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        c.isPublished
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {c.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{c.isPublished ? 'Published' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 rounded-lg bg-[#15111F] border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
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
          <div className="relative w-full max-w-md bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">
                {editingCert ? 'Edit Credential' : 'Add Credential'}
              </h3>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Issuer Institution *</label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Issue Date / Status *</label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white font-mono focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Verification URL</label>
                <input
                  type="text"
                  value={formData.verificationUrl}
                  onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-[#15111F] border-purple-900"
                  />
                  <span className="text-slate-300 font-medium">Show on public credentials page</span>
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
                  {loading ? 'Saving...' : 'Save Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-[#101019] border border-rose-900/50 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Delete Credential?</h4>
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
