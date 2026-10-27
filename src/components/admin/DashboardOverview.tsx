import React from 'react';
import {
  FolderGit2,
  FileCheck2,
  ShieldCheck,
  Cpu,
  Award,
  BookOpen,
  Mail,
  Image as ImageIcon,
  ArrowRight,
  ShieldAlert,
  Clock,
  Plus
} from 'lucide-react';
import { AdminStats, AuditLogItem, ContactMessage } from '../../types';
import { AdminTab } from './AdminLayout';

interface DashboardOverviewProps {
  stats: AdminStats | null;
  recentMessages: ContactMessage[];
  recentLogs: AuditLogItem[];
  setTab: (tab: AdminTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  recentMessages,
  recentLogs,
  setTab
}) => {
  const statCards = [
    { title: 'Projects', count: stats?.projectsCount ?? 0, tab: 'projects' as AdminTab, icon: <FolderGit2 className="w-5 h-5 text-purple-400" /> },
    { title: 'Case Studies', count: stats?.caseStudiesCount ?? 0, tab: 'case-studies' as AdminTab, icon: <FileCheck2 className="w-5 h-5 text-[#C084FC]" /> },
    { title: 'Active Services', count: stats?.servicesCount ?? 0, tab: 'services' as AdminTab, icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
    { title: 'Skills & Tools', count: stats?.skillsCount ?? 0, tab: 'skills' as AdminTab, icon: <Cpu className="w-5 h-5 text-indigo-400" /> },
    { title: 'Certifications', count: stats?.certificationsCount ?? 0, tab: 'certifications' as AdminTab, icon: <Award className="w-5 h-5 text-amber-400" /> },
    { title: 'Blog Articles', count: stats?.blogCount ?? 0, tab: 'blog' as AdminTab, icon: <BookOpen className="w-5 h-5 text-sky-400" /> },
    { title: 'Unread Inquiries', count: stats?.unreadMessagesCount ?? 0, tab: 'inbox' as AdminTab, icon: <Mail className="w-5 h-5 text-rose-400" />, highlight: (stats?.unreadMessagesCount ?? 0) > 0 },
    { title: 'Media Files', count: stats?.mediaCount ?? 0, tab: 'media' as AdminTab, icon: <ImageIcon className="w-5 h-5 text-slate-400" /> }
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101019] border border-purple-900/30">
        <div>
          <h1 className="text-xl font-bold text-white">
            Security Management Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time database records for MD. Raihan Hossen Rajib portfolio and client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTab('projects')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
          <button
            onClick={() => setTab('blog')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#15111F] hover:bg-[#1A1626] border border-purple-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => setTab(card.tab)}
            className={`p-5 rounded-2xl bg-[#101019] border text-left transition-all hover:border-purple-600/60 cursor-pointer ${
              card.highlight
                ? 'border-rose-900/50 bg-rose-950/10'
                : 'border-purple-900/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className="p-2 rounded-lg bg-[#15111F] border border-purple-950/60">
                {card.icon}
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono text-white tabular-nums">
              {card.count}
            </div>
          </button>
        ))}
      </div>

      {/* Two Column Grid: Recent Inquiries & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Contact Submissions */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-950/40">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C084FC]" />
              <h3 className="text-sm font-bold text-white">Recent Inquiries</h3>
            </div>
            <button
              onClick={() => setTab('inbox')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
            >
              <span>View All Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No inquiries submitted yet. Form submissions will appear here.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentMessages.slice(0, 5).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setTab('inbox')}
                  className="p-3.5 rounded-xl bg-[#15111F] border border-purple-950/60 hover:border-purple-700/50 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                      )}
                      <span>{msg.name}</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300 truncate font-medium">
                    {msg.subject}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Security Audit Logs */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-950/40">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Audit Trail</h3>
            </div>
            <button
              onClick={() => setTab('audit-logs')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
            >
              <span>Full Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No audit logs registered yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-[#15111F] border border-purple-950/60 text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-purple-300 font-semibold">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {log.details || log.entityType}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
