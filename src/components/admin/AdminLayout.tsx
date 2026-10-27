import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  FileCheck2,
  ShieldCheck,
  Cpu,
  Award,
  BookOpen,
  Image as ImageIcon,
  Settings,
  Mail,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { AdminStats } from '../../types';

export type AdminTab =
  | 'overview'
  | 'projects'
  | 'case-studies'
  | 'services'
  | 'skills'
  | 'certifications'
  | 'blog'
  | 'media'
  | 'settings'
  | 'inbox'
  | 'audit-logs';

interface AdminLayoutProps {
  currentTab: AdminTab;
  setTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onExitToPublic: () => void;
  stats: AdminStats | null;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setTab,
  onLogout,
  onExitToPublic,
  stats,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Project Manager', icon: <FolderGit2 className="w-4 h-4" />, badge: stats?.projectsCount },
    { id: 'case-studies', label: 'Case Studies', icon: <FileCheck2 className="w-4 h-4" />, badge: stats?.caseStudiesCount },
    { id: 'services', label: 'Services Manager', icon: <ShieldCheck className="w-4 h-4" />, badge: stats?.servicesCount },
    { id: 'skills', label: 'Skills & Tools', icon: <Cpu className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'blog', label: 'Blog CMS', icon: <BookOpen className="w-4 h-4" />, badge: stats?.blogCount },
    { id: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" />, badge: stats?.mediaCount },
    { id: 'inbox', label: 'Contact Inbox', icon: <Mail className="w-4 h-4" />, badge: stats?.unreadMessagesCount },
    { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'audit-logs', label: 'Audit Trail', icon: <History className="w-4 h-4" /> }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#08080D] flex flex-col">
      {/* Admin Top Bar */}
      <header className="h-16 bg-[#101019] border-b border-purple-950/50 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white md:hidden border border-purple-950/60"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block leading-tight">
                MD. RAIHAN HOSSEN RAJIB
              </span>
              <span className="text-[10px] text-purple-400 font-mono">
                ADMINISTRATION CONSOLE
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitToPublic}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white border border-purple-900/40 hover:border-purple-600 bg-[#15111F] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/40 border border-rose-900/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Terminate session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-[#101019] border-r border-purple-950/50 hidden md:flex flex-col justify-between p-4 overflow-y-auto">
          <nav className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Content Management
            </div>
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-purple-900/50 text-white border border-purple-600/50 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#15111F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#C084FC]' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        item.id === 'inbox'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : 'bg-[#15111F] text-purple-300 border border-purple-950/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-purple-950/40 text-[11px] text-slate-500 space-y-1">
            <div>Session: Active Encrypted</div>
            <div className="text-purple-400/80 font-mono">v1.0.0 Production CMS</div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 md:hidden flex">
            <div className="w-72 bg-[#101019] border-r border-purple-900/40 p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-purple-950/40">
                  <span className="font-bold text-sm text-white">Navigation</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                        currentTab === item.id
                          ? 'bg-purple-900/50 text-white font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-[#15111F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-purple-950/40">
                <button
                  onClick={onLogout}
                  className="w-full py-2 px-3 rounded-lg text-xs text-rose-300 hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
