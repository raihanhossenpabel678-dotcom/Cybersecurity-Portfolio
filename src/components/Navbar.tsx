import React, { useState } from 'react';
import { Menu, X, Lock, Terminal } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  siteName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Case Studies', path: '/case-studies' },
    { label: 'Skills', path: '/skills' },
    { label: 'Certifications', path: '/certifications' },
    { label: 'Articles', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060814]/90 backdrop-blur-md border-b border-indigo-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Sleek minimal indicator (Name and Logo moved into Hero as requested) */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 text-left text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_22px_rgba(56,189,248,0.6)] transition-all">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs tracking-widest uppercase text-sky-400 font-semibold">
                SECURITY // PORTFOLIO
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links in Blue-Purple palette */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                    isActive ? 'text-[#38BDF8] font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#8B5CF6] rounded-full shadow-[0_0_8px_#38bdf8]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Admin Portal in Blue-Purple */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('/admin')}
              className="px-3.5 py-2 text-xs font-semibold text-sky-300 hover:text-white bg-[#0C0F24] hover:bg-[#121633] border border-indigo-800/60 hover:border-sky-500/60 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Administrator Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              className="px-5 py-2.5 text-xs font-semibold tracking-wide uppercase text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Secure Your Site
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('/admin')}
              className="px-2.5 py-1.5 text-xs font-medium text-sky-300 hover:text-white rounded-lg border border-indigo-800/50 bg-[#0C0F24] flex items-center gap-1"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg border border-indigo-900/40 bg-[#0C0F24]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-indigo-900/40 bg-[#060814]/98 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-950/60 text-[#38BDF8] font-semibold border-l-2 border-[#38BDF8]'
                    : 'text-slate-300 hover:bg-[#121633] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-3">
            <button
              onClick={() => handleNavClick('/contact')}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] rounded-lg text-center shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              Secure Your Site
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
