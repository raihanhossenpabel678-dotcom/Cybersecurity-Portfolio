import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProjectItem } from '../../types';
import {
  createAdminProject,
  updateAdminProject,
  deleteAdminProject
} from '../../lib/api';

interface ProjectManagerProps {
  projects: ProjectItem[];
  onRefresh: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    category: 'WordPress Security',
    technologies: 'WordPress, PHP, MySQL',
    coverImage: '',
    challenges: '',
    methodology: '',
    remediation: '',
    verifiedResults: '',
    externalUrl: '',
    isFeatured: false,
    isPublished: true,
    sortOrder: 0
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      description: '',
      category: 'WordPress Security',
      technologies: 'WordPress, PHP, MySQL',
      coverImage: '',
      challenges: '',
      methodology: '',
      remediation: '',
      verifiedResults: '',
      externalUrl: '',
      isFeatured: false,
      isPublished: true,
      sortOrder: projects.length + 1
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      category: p.category,
      technologies: p.technologies.join(', '),
      coverImage: p.coverImage || '',
      challenges: p.challenges || '',
      methodology: p.methodology || '',
      remediation: p.remediation || '',
      verifiedResults: p.verifiedResults || '',
      externalUrl: p.externalUrl || '',
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      sortOrder: p.sortOrder
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
      slug: editingProject ? prev.slug : slug
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
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        coverImage: formData.coverImage,
        challenges: formData.challenges,
        methodology: formData.methodology,
        remediation: formData.remediation,
        verifiedResults: formData.verifiedResults,
        externalUrl: formData.externalUrl,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
        sortOrder: Number(formData.sortOrder)
      };

      if (editingProject) {
        await updateAdminProject(editingProject.id, payload);
      } else {
        await createAdminProject(payload);
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (p: ProjectItem) => {
    try {
      await updateAdminProject(p.id, { isPublished: !p.isPublished });
      onRefresh();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleToggleFeature = async (p: ProjectItem) => {
    try {
      await updateAdminProject(p.id, { isFeatured: !p.isFeatured });
      onRefresh();
    } catch (err: any) {
      alert('Error updating feature status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminProject(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting project: ' + err.message);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-purple-400" />
            <span>Project & Audit Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, feature, and publish security projects and audits.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101019] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Total: {projects.length}
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl bg-[#101019] border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15111F] text-slate-400 uppercase tracking-wider font-semibold border-b border-purple-950/50">
              <tr>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/40 text-slate-300">
              {filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#15111F]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{proj.title}</div>
                    <div className="text-[11px] text-purple-400/80 font-mono">{proj.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {proj.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(proj)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        proj.isPublished
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {proj.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{proj.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeature(proj)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        proj.isFeatured
                          ? 'text-amber-400 bg-amber-950/40 border border-amber-800/50'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title="Toggle Homepage Feature"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 rounded-lg bg-[#15111F] border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(proj.id)}
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

      {/* Create / Edit Modal */}
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
                {editingProject ? 'Edit Security Project' : 'Create New Project'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved changes immediately persist to the database.
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
                  <label className="font-semibold text-slate-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Slug (URL friendly) *</label>
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
                  <label className="font-semibold text-slate-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="WordPress Security">WordPress Security</option>
                    <option value="Penetration Testing">Penetration Testing</option>
                    <option value="Development & Scripting">Development & Scripting</option>
                    <option value="OSINT & Reconnaissance">OSINT & Reconnaissance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Challenges / Threat Vector</label>
                  <textarea
                    rows={2}
                    value={formData.challenges}
                    onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Applied Methodology</label>
                  <textarea
                    rows={2}
                    value={formData.methodology}
                    onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Remediation Implemented</label>
                  <textarea
                    rows={2}
                    value={formData.remediation}
                    onChange={(e) => setFormData({ ...formData, remediation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Verified Results</label>
                  <textarea
                    rows={2}
                    value={formData.verifiedResults}
                    onChange={(e) => setFormData({ ...formData, verifiedResults: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-[#15111F] border-purple-900"
                  />
                  <span className="text-slate-300 font-medium">Publish to public portfolio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-[#15111F] border-purple-900"
                  />
                  <span className="text-slate-300 font-medium">Feature on Homepage</span>
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
                  {loading ? 'Persisting...' : 'Save Project to Database'}
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
            <h4 className="text-base font-bold text-white">Confirm Project Deletion</h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this project? This will permanently remove it from the database.
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
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
