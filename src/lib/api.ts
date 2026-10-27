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
} from '../types';
import {
  initialSettings,
  initialServices,
  initialProjects,
  initialCaseStudies,
  initialSkills,
  initialCertifications,
  initialBlogPosts
} from '../server/seedData';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('rajib_admin_token');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    localStorage.setItem('rajib_admin_token', token);
  } catch {}
}

export function removeAuthToken() {
  try {
    localStorage.removeItem('rajib_admin_token');
  } catch {}
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Local Storage Helpers for Offline / Vercel Static Hosting Resilience
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Default Admin Credentials for Vercel / Client-side fallback
export const defaultAdminAuth = {
  email: 'raihanhossenpabel678@gmail.com',
  password: 'RajibSecure2026!',
  securityQuestions: [
    {
      id: 'q1',
      question: 'Where did you complete your Diploma in Cyber Security?',
      answer: 'arena web security'
    },
    {
      id: 'q2',
      question: 'What is your primary specialized CMS security area?',
      answer: 'wordpress'
    },
    {
      id: 'q3',
      question: 'What programming language and framework do you develop security tools with?',
      answer: 'python'
    }
  ]
};

function getAdminAuth() {
  return getLocal('rajib_admin_auth', defaultAdminAuth);
}

function addAuditLog(action: string, entityType: string, details: string, entityId?: string) {
  try {
    const logs = getLocal<AuditLogItem[]>('rajib_audit_logs', []);
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '127.0.0.1 (Client)',
      createdAt: new Date().toISOString()
    };
    logs.unshift(newLog);
    setLocal('rajib_audit_logs', logs.slice(0, 50));
  } catch {}
}

// ==========================================
// PUBLIC API (Guaranteed Never to Throw Blank)
// ==========================================

export async function fetchPublicSettings(): Promise<WebsiteSettings> {
  const remote = await safeFetchJson<WebsiteSettings>(`${API_BASE}/public/settings`);
  if (remote) {
    setLocal('rajib_settings', remote);
    return remote;
  }
  return getLocal<WebsiteSettings>('rajib_settings', initialSettings);
}

export async function fetchPublicServices(): Promise<ServiceItem[]> {
  const remote = await safeFetchJson<ServiceItem[]>(`${API_BASE}/public/services`);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    setLocal('rajib_services', remote);
    return remote;
  }
  return getLocal<ServiceItem[]>('rajib_services', initialServices);
}

export async function fetchPublicProjects(): Promise<ProjectItem[]> {
  const remote = await safeFetchJson<ProjectItem[]>(`${API_BASE}/public/projects`);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    setLocal('rajib_projects', remote);
    return remote;
  }
  return getLocal<ProjectItem[]>('rajib_projects', initialProjects);
}

export async function fetchPublicCaseStudies(): Promise<CaseStudyItem[]> {
  const remote = await safeFetchJson<CaseStudyItem[]>(`${API_BASE}/public/case-studies`);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    setLocal('rajib_caseStudies', remote);
    return remote;
  }
  return getLocal<CaseStudyItem[]>('rajib_caseStudies', initialCaseStudies);
}

export async function fetchPublicSkills(): Promise<SkillItem[]> {
  const remote = await safeFetchJson<SkillItem[]>(`${API_BASE}/public/skills`);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    setLocal('rajib_skills', remote);
    return remote;
  }
  return getLocal<SkillItem[]>('rajib_skills', initialSkills);
}

export async function fetchPublicCertifications(): Promise<CertificationItem[]> {
  const remote = await safeFetchJson<CertificationItem[]>(`${API_BASE}/public/certifications`);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    setLocal('rajib_certifications', remote);
    return remote;
  }
  return getLocal<CertificationItem[]>('rajib_certifications', initialCertifications);
}

export async function fetchPublicBlog(): Promise<BlogPostItem[]> {
  const remote = await safeFetchJson<BlogPostItem[]>(`${API_BASE}/public/blog`);
  if (remote && Array.isArray(remote) && remote.length > 0) {
    setLocal('rajib_blogPosts', remote);
    return remote;
  }
  return getLocal<BlogPostItem[]>('rajib_blogPosts', initialBlogPosts);
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}): Promise<{ success: boolean; message: string }> {
  // Honeypot bot protection
  if (data.honeypot) {
    return { success: true, message: 'Message received.' };
  }

  // Attempt backend API first
  try {
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (res.ok) return json;
  } catch {
    // Backend API unavailable (Vercel static deploy)
  }

  // Fallback: save to LocalStorage and Firebase Firestore
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: data.name,
    email: data.email,
    subject: data.subject || 'Portfolio Inquiry',
    message: data.message,
    isRead: false,
    isArchived: false,
    createdAt: new Date().toISOString()
  };

  const msgs = getLocal<ContactMessage[]>('rajib_contact_messages', []);
  msgs.unshift(newMsg);
  setLocal('rajib_contact_messages', msgs);
  addAuditLog('Contact Form Submission', 'ContactMessage', `Message from ${data.email} (${data.name})`, newMsg.id);

  // Try writing to Firestore as well if available
  try {
    if (db) {
      await addDoc(collection(db, 'contact_messages'), {
        ...newMsg,
        syncedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Firestore optional message backup notice:', err);
  }

  return {
    success: true,
    message: 'Thank you! Your message has been sent securely. MD. Raihan Hossen Rajib will respond shortly.'
  };
}

// ==========================================
// ADMIN AUTHENTICATION & SECURITY
// ==========================================

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const json = await res.json();
      setAuthToken(json.token);
      return json;
    }
  } catch {
    // Backend unavailable, fallback to client credentials check
  }

  const authData = getAdminAuth();
  if (email.trim().toLowerCase() === authData.email.toLowerCase() && password === authData.password) {
    const token = `rajib-admin-token-${Date.now()}`;
    setAuthToken(token);
    addAuditLog('Admin Login Successful', 'Auth', `User authenticated as ${email}`);
    return { success: true, token };
  }

  addAuditLog('Admin Login Failed', 'Auth', `Failed attempt with email ${email}`);
  throw new Error('Invalid email or password.');
}

export async function fetchSecurityQuestions(): Promise<{ email: string; questions: { id: string; question: string }[] }> {
  const remote = await safeFetchJson<{ email: string; questions: { id: string; question: string }[] }>(`${API_BASE}/auth/security-questions`);
  if (remote) return remote;

  const authData = getAdminAuth();
  return {
    email: authData.email,
    questions: authData.securityQuestions.map(q => ({ id: q.id, question: q.question }))
  };
}

export async function resetAdminPassword(
  answers: Record<string, string>,
  newPassword: string
): Promise<{ success: boolean; message: string; token: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, newPassword })
    });
    if (res.ok) {
      const json = await res.json();
      setAuthToken(json.token);
      return json;
    }
  } catch {
    // Backend unavailable
  }

  const authData = getAdminAuth();
  let correctCount = 0;
  for (const q of authData.securityQuestions) {
    const submitted = (answers[q.id] || '').trim().toLowerCase();
    const expected = q.answer.trim().toLowerCase();
    if (submitted && (submitted === expected || expected.includes(submitted))) {
      correctCount++;
    }
  }

  if (correctCount < authData.securityQuestions.length) {
    throw new Error('One or more security question answers are incorrect. Please verify your responses.');
  }

  authData.password = newPassword;
  setLocal('rajib_admin_auth', authData);
  const token = `rajib-admin-token-${Date.now()}`;
  setAuthToken(token);
  addAuditLog('Password Reset', 'Auth', 'Admin password successfully reset via verified security questions');

  return {
    success: true,
    message: 'Password successfully reset.',
    token
  };
}

export async function checkAuth(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders()
    });
    if (res.ok) {
      const json = await res.json();
      return !!json.authenticated;
    }
  } catch {
    // Backend unavailable, validate locally
  }

  return token.startsWith('rajib-admin-token');
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: authHeaders()
    });
  } catch {}
  removeAuthToken();
  addAuditLog('Admin Logout', 'Auth', 'Admin user session terminated');
}

// ==========================================
// ADMIN DASHBOARD & AUDIT
// ==========================================

export async function fetchAdminStats(): Promise<AdminStats> {
  const remote = await safeFetchJson<AdminStats>(`${API_BASE}/admin/stats`, { headers: authHeaders() });
  if (remote) return remote;

  const projects = getLocal<ProjectItem[]>('rajib_projects', initialProjects);
  const services = getLocal<ServiceItem[]>('rajib_services', initialServices);
  const caseStudies = getLocal<CaseStudyItem[]>('rajib_caseStudies', initialCaseStudies);
  const articles = getLocal<BlogPostItem[]>('rajib_blogPosts', initialBlogPosts);
  const certs = getLocal<CertificationItem[]>('rajib_certifications', initialCertifications);
  const skills = getLocal<SkillItem[]>('rajib_skills', initialSkills);
  const messages = getLocal<ContactMessage[]>('rajib_contact_messages', []);
  const media = getLocal<MediaItem[]>('rajib_media', []);

  return {
    projectsCount: projects.length,
    caseStudiesCount: caseStudies.length,
    servicesCount: services.filter(s => s.isPublished).length,
    skillsCount: skills.length,
    certificationsCount: certs.length,
    blogCount: articles.filter(a => a.isPublished).length,
    unreadMessagesCount: messages.filter(m => !m.isRead).length,
    totalMessagesCount: messages.length,
    mediaCount: media.length
  };
}

export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  const remote = await safeFetchJson<AuditLogItem[]>(`${API_BASE}/admin/audit-logs`, { headers: authHeaders() });
  if (remote) return remote;

  return getLocal<AuditLogItem[]>('rajib_audit_logs', [
    {
      id: 'log-seed-1',
      action: 'System Initialized',
      entityType: 'System',
      details: 'Cybersecurity portfolio security controls verified and deployed',
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function fetchAdminSettings(): Promise<WebsiteSettings> {
  const remote = await safeFetchJson<WebsiteSettings>(`${API_BASE}/admin/settings`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<WebsiteSettings>('rajib_settings', initialSettings);
}

export async function updateAdminSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      const json = await res.json();
      setLocal('rajib_settings', json);
      return json;
    }
  } catch {}

  const updated = { ...settings, updatedAt: new Date().toISOString() };
  setLocal('rajib_settings', updated);
  addAuditLog('Update Website Settings', 'WebsiteSettings', 'Site profile, headline, or contact settings updated', settings.id);
  return updated;
}

// ==========================================
// SERVICES CRUD
// ==========================================

export async function fetchAdminServices(): Promise<ServiceItem[]> {
  const remote = await safeFetchJson<ServiceItem[]>(`${API_BASE}/admin/services`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<ServiceItem[]>('rajib_services', initialServices);
}

export async function createAdminService(item: Partial<ServiceItem>): Promise<ServiceItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/services`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<ServiceItem[]>('rajib_services', initialServices);
  const newItem: ServiceItem = {
    id: `srv-${Date.now()}`,
    title: item.title || 'Untitled Service',
    slug: (item.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    summary: item.summary || '',
    description: item.description || '',
    deliverables: item.deliverables || [],
    scope: item.scope || 'Standard Scope',
    iconName: item.iconName || 'ShieldCheck',
    inquiryUrl: item.inquiryUrl || '/contact',
    isPublished: item.isPublished !== false,
    sortOrder: list.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  list.push(newItem);
  setLocal('rajib_services', list);
  addAuditLog('Create Service', 'ServiceItem', `Created service: ${newItem.title}`, newItem.id);
  return newItem;
}

export async function updateAdminService(id: string, item: Partial<ServiceItem>): Promise<ServiceItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<ServiceItem[]>('rajib_services', initialServices);
  const idx = list.findIndex(s => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...item, updatedAt: new Date().toISOString() };
    setLocal('rajib_services', list);
    addAuditLog('Update Service', 'ServiceItem', `Updated service: ${list[idx].title}`, id);
    return list[idx];
  }
  throw new Error('Service not found');
}

export async function deleteAdminService(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<ServiceItem[]>('rajib_services', initialServices);
  const filtered = list.filter(s => s.id !== id);
  setLocal('rajib_services', filtered);
  addAuditLog('Delete Service', 'ServiceItem', `Removed service ID: ${id}`, id);
}

// ==========================================
// PROJECTS CRUD
// ==========================================

export async function fetchAdminProjects(): Promise<ProjectItem[]> {
  const remote = await safeFetchJson<ProjectItem[]>(`${API_BASE}/admin/projects`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<ProjectItem[]>('rajib_projects', initialProjects);
}

export async function createAdminProject(item: Partial<ProjectItem>): Promise<ProjectItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<ProjectItem[]>('rajib_projects', initialProjects);
  const newItem: ProjectItem = {
    id: `proj-${Date.now()}`,
    title: item.title || 'Untitled Project',
    slug: (item.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    summary: item.summary || '',
    description: item.description || '',
    category: item.category || 'WordPress Security',
    technologies: item.technologies || ['WordPress', 'PHP Security'],
    coverImage: item.coverImage || '',
    galleryImages: item.galleryImages || [],
    challenges: item.challenges || '',
    methodology: item.methodology || '',
    remediation: item.remediation || '',
    verifiedResults: item.verifiedResults || '',
    externalUrl: item.externalUrl || '',
    isFeatured: !!item.isFeatured,
    isPublished: item.isPublished !== false,
    sortOrder: list.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  list.push(newItem);
  setLocal('rajib_projects', list);
  addAuditLog('Create Project', 'ProjectItem', `Created project: ${newItem.title}`, newItem.id);
  return newItem;
}

export async function updateAdminProject(id: string, item: Partial<ProjectItem>): Promise<ProjectItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<ProjectItem[]>('rajib_projects', initialProjects);
  const idx = list.findIndex(p => p.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...item, updatedAt: new Date().toISOString() };
    setLocal('rajib_projects', list);
    addAuditLog('Update Project', 'ProjectItem', `Updated project: ${list[idx].title}`, id);
    return list[idx];
  }
  throw new Error('Project not found');
}

export async function deleteAdminProject(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<ProjectItem[]>('rajib_projects', initialProjects);
  setLocal('rajib_projects', list.filter(p => p.id !== id));
  addAuditLog('Delete Project', 'ProjectItem', `Removed project ID: ${id}`, id);
}

// ==========================================
// CASE STUDIES CRUD
// ==========================================

export async function fetchAdminCaseStudies(): Promise<CaseStudyItem[]> {
  const remote = await safeFetchJson<CaseStudyItem[]>(`${API_BASE}/admin/case-studies`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<CaseStudyItem[]>('rajib_caseStudies', initialCaseStudies);
}

export async function createAdminCaseStudy(item: Partial<CaseStudyItem>): Promise<CaseStudyItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/case-studies`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<CaseStudyItem[]>('rajib_caseStudies', initialCaseStudies);
  const newItem: CaseStudyItem = {
    id: `cs-${Date.now()}`,
    title: item.title || 'Untitled Case Study',
    slug: (item.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    summary: item.summary || '',
    engagementType: item.engagementType || 'Authorized Client Engagement',
    authorizedScope: item.authorizedScope || '',
    methodology: item.methodology || '',
    findingsSummary: item.findingsSummary || '',
    findingsSeverity: item.findingsSeverity || 'High',
    sanitizedEvidence: item.sanitizedEvidence || '',
    remediationSteps: item.remediationSteps || '',
    verificationOutcome: item.verificationOutcome || '',
    isPublished: item.isPublished !== false,
    sortOrder: list.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  list.push(newItem);
  setLocal('rajib_caseStudies', list);
  addAuditLog('Create Case Study', 'CaseStudyItem', `Created case study: ${newItem.title}`, newItem.id);
  return newItem;
}

export async function updateAdminCaseStudy(id: string, item: Partial<CaseStudyItem>): Promise<CaseStudyItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/case-studies/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<CaseStudyItem[]>('rajib_caseStudies', initialCaseStudies);
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...item, updatedAt: new Date().toISOString() };
    setLocal('rajib_caseStudies', list);
    addAuditLog('Update Case Study', 'CaseStudyItem', `Updated case study: ${list[idx].title}`, id);
    return list[idx];
  }
  throw new Error('Case study not found');
}

export async function deleteAdminCaseStudy(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/case-studies/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<CaseStudyItem[]>('rajib_caseStudies', initialCaseStudies);
  setLocal('rajib_caseStudies', list.filter(c => c.id !== id));
  addAuditLog('Delete Case Study', 'CaseStudyItem', `Removed case study ID: ${id}`, id);
}

// ==========================================
// SKILLS CRUD
// ==========================================

export async function fetchAdminSkills(): Promise<SkillItem[]> {
  const remote = await safeFetchJson<SkillItem[]>(`${API_BASE}/admin/skills`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<SkillItem[]>('rajib_skills', initialSkills);
}

export async function createAdminSkill(item: Partial<SkillItem>): Promise<SkillItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<SkillItem[]>('rajib_skills', initialSkills);
  const newItem: SkillItem = {
    id: `sk-${Date.now()}`,
    name: item.name || 'New Skill',
    category: item.category || 'Security Tools',
    proficiency: item.proficiency || 85,
    isHighlighted: item.isHighlighted !== false,
    isPublic: item.isPublic !== false,
    sortOrder: list.length + 1,
    createdAt: new Date().toISOString()
  };
  list.push(newItem);
  setLocal('rajib_skills', list);
  addAuditLog('Create Skill', 'SkillItem', `Created skill: ${newItem.name}`, newItem.id);
  return newItem;
}

export async function updateAdminSkill(id: string, item: Partial<SkillItem>): Promise<SkillItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<SkillItem[]>('rajib_skills', initialSkills);
  const idx = list.findIndex(s => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...item };
    setLocal('rajib_skills', list);
    addAuditLog('Update Skill', 'SkillItem', `Updated skill: ${list[idx].name}`, id);
    return list[idx];
  }
  throw new Error('Skill not found');
}

export async function deleteAdminSkill(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<SkillItem[]>('rajib_skills', initialSkills);
  setLocal('rajib_skills', list.filter(s => s.id !== id));
  addAuditLog('Delete Skill', 'SkillItem', `Removed skill ID: ${id}`, id);
}

// ==========================================
// CERTIFICATIONS CRUD
// ==========================================

export async function fetchAdminCertifications(): Promise<CertificationItem[]> {
  const remote = await safeFetchJson<CertificationItem[]>(`${API_BASE}/admin/certifications`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<CertificationItem[]>('rajib_certifications', initialCertifications);
}

export async function createAdminCertification(item: Partial<CertificationItem>): Promise<CertificationItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/certifications`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<CertificationItem[]>('rajib_certifications', initialCertifications);
  const newItem: CertificationItem = {
    id: `cert-${Date.now()}`,
    title: item.title || 'Diploma in Cyber Security',
    issuer: item.issuer || 'Arena Web Security',
    issueDate: item.issueDate || '2023',
    credentialId: item.credentialId,
    verificationUrl: item.verificationUrl,
    certificateImage: item.certificateImage,
    isVerified: item.isVerified !== false,
    isPublished: item.isPublished !== false,
    sortOrder: list.length + 1,
    createdAt: new Date().toISOString()
  };
  list.push(newItem);
  setLocal('rajib_certifications', list);
  addAuditLog('Create Certification', 'CertificationItem', `Created certification: ${newItem.title}`, newItem.id);
  return newItem;
}

export async function updateAdminCertification(id: string, item: Partial<CertificationItem>): Promise<CertificationItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/certifications/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<CertificationItem[]>('rajib_certifications', initialCertifications);
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...item };
    setLocal('rajib_certifications', list);
    addAuditLog('Update Certification', 'CertificationItem', `Updated certification: ${list[idx].title}`, id);
    return list[idx];
  }
  throw new Error('Certification not found');
}

export async function deleteAdminCertification(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<CertificationItem[]>('rajib_certifications', initialCertifications);
  setLocal('rajib_certifications', list.filter(c => c.id !== id));
  addAuditLog('Delete Certification', 'CertificationItem', `Removed certification ID: ${id}`, id);
}

// ==========================================
// BLOG / ARTICLES CRUD
// ==========================================

export async function fetchAdminBlog(): Promise<BlogPostItem[]> {
  const remote = await safeFetchJson<BlogPostItem[]>(`${API_BASE}/admin/blog`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<BlogPostItem[]>('rajib_blogPosts', initialBlogPosts);
}

export async function createAdminBlogPost(item: Partial<BlogPostItem>): Promise<BlogPostItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/blog`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<BlogPostItem[]>('rajib_blogPosts', initialBlogPosts);
  const newItem: BlogPostItem = {
    id: `post-${Date.now()}`,
    title: item.title || 'Untitled Article',
    slug: (item.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: item.excerpt || '',
    content: item.content || '',
    category: item.category || 'WordPress Security',
    tags: item.tags || ['Security'],
    readTime: item.readTime || '5 min read',
    coverImage: item.coverImage,
    isPublished: item.isPublished !== false,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  list.push(newItem);
  setLocal('rajib_blogPosts', list);
  addAuditLog('Create Article', 'BlogPostItem', `Created article: ${newItem.title}`, newItem.id);
  return newItem;
}

export async function updateAdminBlogPost(id: string, item: Partial<BlogPostItem>): Promise<BlogPostItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<BlogPostItem[]>('rajib_blogPosts', initialBlogPosts);
  const idx = list.findIndex(b => b.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...item, updatedAt: new Date().toISOString() };
    setLocal('rajib_blogPosts', list);
    addAuditLog('Update Article', 'BlogPostItem', `Updated article: ${list[idx].title}`, id);
    return list[idx];
  }
  throw new Error('Article not found');
}

export async function deleteAdminBlogPost(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<BlogPostItem[]>('rajib_blogPosts', initialBlogPosts);
  setLocal('rajib_blogPosts', list.filter(b => b.id !== id));
  addAuditLog('Delete Article', 'BlogPostItem', `Removed article ID: ${id}`, id);
}

// ==========================================
// CONTACT MESSAGES INBOX
// ==========================================

export async function fetchAdminContactMessages(): Promise<ContactMessage[]> {
  const remote = await safeFetchJson<ContactMessage[]>(`${API_BASE}/admin/contact`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<ContactMessage[]>('rajib_contact_messages', []);
}

export async function updateContactStatus(id: string, updates: { isRead?: boolean; isArchived?: boolean }): Promise<ContactMessage> {
  try {
    const res = await fetch(`${API_BASE}/admin/contact/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates)
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocal<ContactMessage[]>('rajib_contact_messages', []);
  const idx = list.findIndex(m => m.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    setLocal('rajib_contact_messages', list);
    return list[idx];
  }
  throw new Error('Message not found');
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/contact/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<ContactMessage[]>('rajib_contact_messages', []);
  setLocal('rajib_contact_messages', list.filter(m => m.id !== id));
}

// ==========================================
// MEDIA LIBRARY
// ==========================================

export async function fetchAdminMedia(): Promise<MediaItem[]> {
  const remote = await safeFetchJson<MediaItem[]>(`${API_BASE}/admin/media`, { headers: authHeaders() });
  if (remote) return remote;
  return getLocal<MediaItem[]>('rajib_media', []);
}

export async function uploadMediaFile(file: File): Promise<{ success: boolean; fileUrl: string; media: MediaItem }> {
  // Try remote backend upload
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (res.ok) return await res.json();
  } catch {}

  // Fallback: Read file as Data URL in browser and store in LocalStorage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const mediaItem: MediaItem = {
        id: `media-${Date.now()}`,
        filename: file.name,
        filePath: dataUrl,
        originalName: file.name,
        mimeType: file.type || 'image/jpeg',
        fileSize: file.size,
        storageProvider: 'local',
        createdAt: new Date().toISOString()
      };
      const list = getLocal<MediaItem[]>('rajib_media', []);
      list.unshift(mediaItem);
      setLocal('rajib_media', list);
      addAuditLog('Upload Media', 'MediaItem', `Uploaded media file: ${file.name}`, mediaItem.id);
      resolve({ success: true, fileUrl: dataUrl, media: mediaItem });
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export async function deleteAdminMedia(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {}

  const list = getLocal<MediaItem[]>('rajib_media', []);
  setLocal('rajib_media', list.filter(m => m.id !== id));
  addAuditLog('Delete Media', 'MediaItem', `Removed media ID: ${id}`, id);
}
