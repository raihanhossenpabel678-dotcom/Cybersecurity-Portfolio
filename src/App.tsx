import React, { useState, useEffect, useCallback } from 'react';
import {
  WebsiteSettings,
  ServiceItem,
  ProjectItem,
  CaseStudyItem,
  SkillItem,
  CertificationItem,
  BlogPostItem,
  ContactMessage,
  MediaItem,
  AuditLogItem,
  AdminStats
} from './types';
import {
  fetchPublicSettings,
  fetchPublicServices,
  fetchPublicProjects,
  fetchPublicCaseStudies,
  fetchPublicSkills,
  fetchPublicCertifications,
  fetchPublicBlog,
  checkAuth,
  adminLogout,
  fetchAdminStats,
  fetchAdminContactMessages,
  fetchAuditLogs,
  fetchAdminProjects,
  fetchAdminCaseStudies,
  fetchAdminServices,
  fetchAdminSkills,
  fetchAdminCertifications,
  fetchAdminBlog,
  fetchAdminMedia,
  fetchAdminSettings
} from './lib/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AboutView } from './components/public/AboutView';
import { ServicesView } from './components/public/ServicesView';
import { ProjectsView } from './components/public/ProjectsView';
import { CaseStudiesView } from './components/public/CaseStudiesView';
import { SkillsView } from './components/public/SkillsView';
import { CertificationsView } from './components/public/CertificationsView';
import { BlogView } from './components/public/BlogView';
import { ContactView } from './components/public/ContactView';
import { NotFoundView } from './components/public/NotFoundView';
import { MouseTracer } from './components/MouseTracer';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ProjectManager } from './components/admin/ProjectManager';
import { CaseStudyManager } from './components/admin/CaseStudyManager';
import { ServicesManager } from './components/admin/ServicesManager';
import { SkillsManager } from './components/admin/SkillsManager';
import { CertificationsManager } from './components/admin/CertificationsManager';
import { BlogManager } from './components/admin/BlogManager';
import { MediaLibrary } from './components/admin/MediaLibrary';
import { WebsiteSettingsManager } from './components/admin/WebsiteSettingsManager';
import { ContactInbox } from './components/admin/ContactInbox';
import { AuditTrailView } from './components/admin/AuditTrailView';

import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  FileCheck2,
  Cpu,
  BookOpen,
  Mail,
  Award
} from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [initialContactService, setInitialContactService] = useState<string>('');

  // Public Data State
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Admin Data State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminMessages, setAdminMessages] = useState<ContactMessage[]>([]);
  const [adminLogs, setAdminLogs] = useState<AuditLogItem[]>([]);
  const [adminMedia, setAdminMedia] = useState<MediaItem[]>([]);

  // Navigation Handler with popstate support
  const navigate = useCallback((path: string) => {
    // Check if query params exist (e.g., /contact?service=...)
    const [pathOnly, queryString] = path.split('?');
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const srv = params.get('service');
      if (srv) setInitialContactService(srv);
    } else {
      setInitialContactService('');
    }

    window.history.pushState({}, '', path);
    setCurrentPath(pathOnly);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch Public Data
  const loadPublicData = useCallback(async () => {
    try {
      const [s, srv, p, cs, sk, cert, b] = await Promise.all([
        fetchPublicSettings(),
        fetchPublicServices(),
        fetchPublicProjects(),
        fetchPublicCaseStudies(),
        fetchPublicSkills(),
        fetchPublicCertifications(),
        fetchPublicBlog()
      ]);
      setSettings(s);
      setServices(srv);
      setProjects(p);
      setCaseStudies(cs);
      setSkills(sk);
      setCertifications(cert);
      setBlogPosts(b);
    } catch (err) {
      console.error('Failed to load public data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Admin Data
  const loadAdminData = useCallback(async () => {
    try {
      const isAuth = await checkAuth();
      setIsAdminAuthenticated(isAuth);
      if (isAuth) {
        const [stats, msgs, logs, p, cs, srv, sk, cert, b, m, s] = await Promise.all([
          fetchAdminStats(),
          fetchAdminContactMessages(),
          fetchAuditLogs(),
          fetchAdminProjects(),
          fetchAdminCaseStudies(),
          fetchAdminServices(),
          fetchAdminSkills(),
          fetchAdminCertifications(),
          fetchAdminBlog(),
          fetchAdminMedia(),
          fetchAdminSettings()
        ]);
        setAdminStats(stats);
        setAdminMessages(msgs);
        setAdminLogs(logs);
        setProjects(p);
        setCaseStudies(cs);
        setServices(srv);
        setSkills(sk);
        setCertifications(cert);
        setBlogPosts(b);
        setAdminMedia(m);
        setSettings(s);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }, []);

  useEffect(() => {
    loadPublicData();
    checkAuth().then((auth) => {
      setIsAdminAuthenticated(auth);
      if (auth) loadAdminData();
    });
  }, [loadPublicData, loadAdminData]);

  // Handle Logout
  const handleLogout = async () => {
    await adminLogout();
    setIsAdminAuthenticated(false);
    navigate('/');
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#08080D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-mono text-purple-400">
            Initializing Cybersecurity Platform...
          </span>
        </div>
      </div>
    );
  }

  // Admin Route
  if (currentPath === '/admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            loadAdminData();
          }}
          onCancel={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        setTab={setAdminTab}
        onLogout={handleLogout}
        onExitToPublic={() => navigate('/')}
        stats={adminStats}
      >
        {adminTab === 'overview' && (
          <DashboardOverview
            stats={adminStats}
            recentMessages={adminMessages}
            recentLogs={adminLogs}
            setTab={setAdminTab}
          />
        )}
        {adminTab === 'projects' && (
          <ProjectManager projects={projects} onRefresh={loadAdminData} />
        )}
        {adminTab === 'case-studies' && (
          <CaseStudyManager caseStudies={caseStudies} onRefresh={loadAdminData} />
        )}
        {adminTab === 'services' && (
          <ServicesManager services={services} onRefresh={loadAdminData} />
        )}
        {adminTab === 'skills' && (
          <SkillsManager skills={skills} onRefresh={loadAdminData} />
        )}
        {adminTab === 'certifications' && (
          <CertificationsManager certifications={certifications} onRefresh={loadAdminData} />
        )}
        {adminTab === 'blog' && (
          <BlogManager articles={blogPosts} onRefresh={loadAdminData} />
        )}
        {adminTab === 'media' && (
          <MediaLibrary media={adminMedia} onRefresh={loadAdminData} />
        )}
        {adminTab === 'settings' && (
          <WebsiteSettingsManager settings={settings} onRefresh={loadAdminData} />
        )}
        {adminTab === 'inbox' && (
          <ContactInbox messages={adminMessages} onRefresh={loadAdminData} />
        )}
        {adminTab === 'audit-logs' && (
          <AuditTrailView logs={adminLogs} onRefresh={loadAdminData} />
        )}
      </AdminLayout>
    );
  }

  // Public View Router
  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col font-sans relative selection:bg-sky-500/30 selection:text-white">
      <MouseTracer />
      <Navbar currentPath={currentPath} navigate={navigate} />

      <main className="flex-1">
        {currentPath === '/' && (
          <div className="space-y-24">
            {/* 1. Hero Section */}
            <HeroSection settings={settings} navigate={navigate} />

            {/* 2. Selected Services Section */}
            {settings.sectionVisibility.services && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-purple-950/40">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                      Defensive Capabilities
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Professional Security Services
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/services')}
                    className="text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View All 7 Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.slice(0, 3).map((srv) => (
                    <div
                      key={srv.id}
                      className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 flex flex-col justify-between transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.18)]"
                    >
                      <div className="space-y-4">
                        <div className="text-xs font-mono text-purple-300">
                          {srv.scope}
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {srv.title}
                        </h3>
                        <p className="text-sm text-slate-300 line-clamp-3">
                          {srv.summary}
                        </p>
                      </div>

                      <div className="pt-6 mt-4 border-t border-purple-950/40 flex items-center justify-between">
                        <button
                          onClick={() => navigate('/services')}
                          className="text-xs text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <span>Full Scope</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/contact?service=${encodeURIComponent(srv.title)}`)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-900/60 hover:bg-[#7C3AED] rounded-lg transition-colors cursor-pointer"
                        >
                          Inquire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Featured Projects Showcase */}
            {settings.sectionVisibility.projects && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-purple-950/40">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                      Verified Remediation
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Featured Security Projects & Audits
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/projects')}
                    className="text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View All Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => navigate('/projects')}
                      className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 flex flex-col justify-between transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] cursor-pointer"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-purple-300 font-mono">
                          <span>{proj.category}</span>
                          <span>·</span>
                          <span>{new Date(proj.createdAt).getFullYear()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug">
                          {proj.title}
                        </h3>
                        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                          {proj.summary}
                        </p>
                        {proj.verifiedResults && (
                          <div className="p-3 rounded-xl bg-[#15111F] border border-purple-950 text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{proj.verifiedResults}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 mt-4 border-t border-purple-950/40 flex items-center justify-between text-xs text-purple-300 font-medium">
                        <span>Examine Audit Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Highlighted Case Studies */}
            {settings.sectionVisibility.caseStudies && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-purple-950/40">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                      Threat Intelligence
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Security Case Studies & Research
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/case-studies')}
                    className="text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View All Case Studies</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {caseStudies.slice(0, 2).map((cs) => (
                    <div
                      key={cs.id}
                      onClick={() => navigate('/case-studies')}
                      className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 sm:p-8 flex flex-col justify-between transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] cursor-pointer"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                          <span>{cs.engagementType}</span>
                          <span>·</span>
                          <span className="text-amber-400">{cs.findingsSeverity} Severity</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {cs.title}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                          {cs.summary}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-purple-950/40 flex items-center justify-between text-xs text-purple-300 font-semibold uppercase tracking-wider">
                        <span>Read Sanitized Analysis</span>
                        <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Verified Certifications & Diploma Spotlight */}
            {settings.sectionVisibility.certifications && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#101019] via-[#15111F] to-[#101019] border border-purple-900/40 shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08080D] border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wider uppercase">
                        <Award className="w-3.5 h-3.5 text-[#C084FC]" />
                        <span>Verified Educational Credentials</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Arena Web Security Diploma Alumnus
                      </h2>
                      <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                        Completed an intensive 1-year academic Diploma in Cyber Security and Ethical Hacking alongside specialized Python with Django development training. Verified without fabrication.
                      </p>
                    </div>

                    <div className="lg:col-span-4 flex justify-start lg:justify-end">
                      <button
                        onClick={() => navigate('/certifications')}
                        className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] shadow-lg cursor-pointer"
                      >
                        Inspect Credentials
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 6. Recent Security Articles */}
            {settings.sectionVisibility.blog && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-purple-950/40">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                      Threat Publications
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Recent Technical Articles
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/blog')}
                    className="text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read All Articles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blogPosts.slice(0, 3).map((art) => (
                    <article
                      key={art.id}
                      onClick={() => navigate('/blog')}
                      className="rounded-2xl bg-[#101019] border border-purple-900/30 hover:border-purple-600/60 p-6 flex flex-col justify-between transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] cursor-pointer"
                    >
                      <div className="space-y-4">
                        <div className="text-xs font-mono text-purple-300">
                          {art.category} · {art.readTime}
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 mt-4 border-t border-purple-950/40 flex items-center justify-between text-xs text-purple-300 font-semibold">
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Bottom Call to Action */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#15111F] to-[#0A0812] border border-purple-800/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center mx-auto text-white shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Suspect Malware or Require an Authorized Audit?
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Protect your platforms against stealth web shells, credential harvesting, and logic vulnerabilities. Fast response with verified post-audit guarantees.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate('/contact')}
                    className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] shadow-[0_0_25px_rgba(124,58,237,0.35)] cursor-pointer"
                  >
                    Submit Confidential Scope
                  </button>
                  {settings.fiverrUrl && (
                    <a
                      href={settings.fiverrUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-[#101019] border border-purple-900/60 hover:border-purple-600 transition-colors"
                    >
                      Order on Fiverr
                    </a>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPath === '/about' && (
          <AboutView settings={settings} navigate={navigate} />
        )}

        {currentPath === '/services' && (
          <ServicesView services={services} navigate={navigate} />
        )}

        {currentPath === '/projects' && (
          <ProjectsView projects={projects} navigate={navigate} />
        )}

        {currentPath === '/case-studies' && (
          <CaseStudiesView caseStudies={caseStudies} navigate={navigate} />
        )}

        {currentPath === '/skills' && (
          <SkillsView skills={skills} />
        )}

        {currentPath === '/certifications' && (
          <CertificationsView certifications={certifications} />
        )}

        {currentPath === '/blog' && (
          <BlogView articles={blogPosts} />
        )}

        {currentPath === '/contact' && (
          <ContactView settings={settings} initialService={initialContactService} />
        )}

        {![
          '/',
          '/about',
          '/services',
          '/projects',
          '/case-studies',
          '/skills',
          '/certifications',
          '/blog',
          '/contact',
          '/admin'
        ].includes(currentPath) && (
          <NotFoundView navigate={navigate} />
        )}
      </main>

      <Footer navigate={navigate} settings={settings} />
    </div>
  );
}
