import React, { useState } from 'react';
import { BookOpen, Search, Clock, Calendar, ArrowRight, X, Tag } from 'lucide-react';
import { marked } from 'marked';
import { BlogPostItem } from '../../types';

interface BlogViewProps {
  articles: BlogPostItem[];
}

export const BlogView: React.FC<BlogViewProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPostItem | null>(null);

  const categories = ['All', 'WordPress Security', 'OSINT & Reconnaissance', 'Development & Scripting'];

  const filtered = articles.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#15111F] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
          <BookOpen className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Security Insights & Research</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Articles, Threat Research & Guides
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          In-depth technical writeups analyzing WordPress webshell patterns, passive intelligence methodologies, and Django defense-in-depth principles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#101019] border border-purple-900/40 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-900/60 text-white border border-purple-600/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101019] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#101019] border border-purple-900/30 text-slate-400 space-y-2">
          <BookOpen className="w-8 h-8 text-purple-400 mx-auto opacity-40" />
          <div className="text-sm font-medium">No articles found matching criteria</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <article
              key={art.id}
              className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] group"
            >
              <div className="space-y-4">
                {/* Metadata Line */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="text-[#C084FC]">{art.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                {/* Tags */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {art.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono text-purple-300/80 bg-[#15111F] px-2 py-0.5 rounded border border-purple-950/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-4 border-t border-purple-950/40 flex items-center justify-between">
                <button
                  onClick={() => setActiveArticle(art)}
                  className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(art.publishedAt || art.createdAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                <span>{activeArticle.category}</span>
                <span>·</span>
                <span>{activeArticle.readTime}</span>
                <span>·</span>
                <span>{new Date(activeArticle.publishedAt || activeArticle.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {activeArticle.title}
              </h2>
            </div>

            {/* Excerpt Lead */}
            <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 text-sm text-purple-200/90 italic leading-relaxed">
              {activeArticle.excerpt}
            </div>

            {/* Markdown Rendered Content */}
            <div
              className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_pre]:bg-[#08080D] [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-purple-950/60 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-purple-300 [&_code]:text-purple-300 [&_code]:font-mono [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5"
              dangerouslySetInnerHTML={{ __html: marked.parse(activeArticle.content) as string }}
            />

            {/* Tags */}
            <div className="pt-4 border-t border-purple-950/40 flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {activeArticle.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#15111F] border border-purple-900/60 text-purple-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-purple-950/40 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] rounded-lg shadow-sm"
              >
                Finished Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
