import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  AlertCircle
} from 'lucide-react';
import { BlogPostItem } from '../../types';
import {
  createAdminBlogPost,
  updateAdminBlogPost,
  deleteAdminBlogPost
} from '../../lib/api';

interface BlogManagerProps {
  articles: BlogPostItem[];
  onRefresh: () => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ articles, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogPostItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'WordPress Security',
    tags: 'WordPress, Security, Hardening',
    readTime: '5 min read',
    isPublished: true
  });

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '### Overview\n\nWrite your technical security analysis here using Markdown syntax...',
      category: 'WordPress Security',
      tags: 'WordPress, Security, Malware',
      readTime: '5 min read',
      isPublished: true
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (a: BlogPostItem) => {
    setEditingArticle(a);
    setFormData({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      tags: a.tags.join(', '),
      readTime: a.readTime,
      isPublished: a.isPublished
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
      slug: editingArticle ? prev.slug : slug
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
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        readTime: formData.readTime,
        isPublished: formData.isPublished
      };

      if (editingArticle) {
        await updateAdminBlogPost(editingArticle.id, payload);
      } else {
        await createAdminBlogPost(payload);
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (a: BlogPostItem) => {
    try {
      await updateAdminBlogPost(a.id, { isPublished: !a.isPublished });
      onRefresh();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminBlogPost(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting article: ' + err.message);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <span>Blog CMS & Threat Research</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Write, publish, format in Markdown, and manage technical cybersecurity articles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101019] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Total: {articles.length}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#101019] border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15111F] text-slate-400 uppercase tracking-wider font-semibold border-b border-purple-950/50">
              <tr>
                <th className="py-3 px-4">Article Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/40 text-slate-300">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-[#15111F]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div>{art.title}</div>
                    <div className="text-[11px] text-purple-400/80 font-mono">{art.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-purple-300">
                    {art.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {art.readTime}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(art)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        art.isPublished
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {art.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{art.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(art)}
                      className="p-1.5 rounded-lg bg-[#15111F] border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(art.id)}
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
                {editingArticle ? 'Edit Article' : 'Write New Article'}
              </h3>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-1">
                  <label className="font-semibold text-slate-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  >
                    <option value="WordPress Security">WordPress Security</option>
                    <option value="OSINT & Reconnaissance">OSINT & Reconnaissance</option>
                    <option value="Penetration Testing">Penetration Testing</option>
                    <option value="Development & Scripting">Development & Scripting</option>
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="font-semibold text-slate-300">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="font-semibold text-slate-300">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Excerpt / Brief Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  Article Markdown Content * (Supports ### headings, code blocks ```, bullet points)
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white font-mono focus:outline-none focus:border-purple-600 leading-relaxed"
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
                  <span className="text-slate-300 font-medium">Publish article immediately</span>
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
                  {loading ? 'Saving...' : 'Save Article'}
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
            <h4 className="text-base font-bold text-white">Delete Article?</h4>
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
