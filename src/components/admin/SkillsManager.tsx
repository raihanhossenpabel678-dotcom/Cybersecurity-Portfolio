import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  X,
  AlertCircle
} from 'lucide-react';
import { SkillItem } from '../../types';
import {
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill
} from '../../lib/api';

interface SkillsManagerProps {
  skills: SkillItem[];
  onRefresh: () => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'WordPress Security' as SkillItem['category'],
    proficiency: 85,
    isHighlighted: false,
    isPublic: true,
    sortOrder: 0
  });

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'WordPress Security',
      proficiency: 90,
      isHighlighted: false,
      isPublic: true,
      sortOrder: skills.length + 1
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (s: SkillItem) => {
    setEditingSkill(s);
    setFormData({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      isHighlighted: s.isHighlighted,
      isPublic: s.isPublic,
      sortOrder: s.sortOrder
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
        name: formData.name,
        category: formData.category,
        proficiency: Number(formData.proficiency),
        isHighlighted: formData.isHighlighted,
        isPublic: formData.isPublic,
        sortOrder: Number(formData.sortOrder)
      };

      if (editingSkill) {
        await updateAdminSkill(editingSkill.id, payload);
      } else {
        await createAdminSkill(payload);
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async (s: SkillItem) => {
    try {
      await updateAdminSkill(s.id, { isPublic: !s.isPublic });
      onRefresh();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminSkill(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Skills & Tools Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add, categorize, adjust proficiency percentages, and toggle public visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills Table */}
      <div className="rounded-2xl bg-[#101019] border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15111F] text-slate-400 uppercase tracking-wider font-semibold border-b border-purple-950/50">
              <tr>
                <th className="py-3 px-4">Skill / Tool Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Proficiency</th>
                <th className="py-3 px-4">Highlighted</th>
                <th className="py-3 px-4">Public</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/40 text-slate-300">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-[#15111F]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {skill.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-purple-300">
                    {skill.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-200">
                    {skill.proficiency}%
                  </td>
                  <td className="py-3.5 px-4">
                    {skill.isHighlighted ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublic(skill)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        skill.isPublic
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {skill.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{skill.isPublic ? 'Public' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1.5 rounded-lg bg-[#15111F] border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(skill.id)}
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
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                <label className="font-semibold text-slate-300">Skill / Tool Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillItem['category'] })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                >
                  <option value="WordPress Security">WordPress Security</option>
                  <option value="Penetration Testing">Penetration Testing</option>
                  <option value="Development & Scripting">Development & Scripting</option>
                  <option value="OSINT & Reconnaissance">OSINT & Reconnaissance</option>
                  <option value="Security Tools">Security Tools</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="font-semibold text-slate-300">Proficiency Level</label>
                  <span className="font-mono text-purple-300">{formData.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHighlighted}
                    onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                    className="rounded bg-[#15111F] border-purple-900"
                  />
                  <span className="text-slate-300 font-medium">Highlight / Star competency</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded bg-[#15111F] border-purple-900"
                  />
                  <span className="text-slate-300 font-medium">Show on public portfolio</span>
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
                  {loading ? 'Saving...' : 'Save Skill'}
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
            <h4 className="text-base font-bold text-white">Delete Skill?</h4>
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
