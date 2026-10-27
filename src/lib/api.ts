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

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('rajib_admin_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('rajib_admin_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('rajib_admin_token');
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Storage helper functions for static / serverless / offline fallback
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
  }
  return defaultValue;
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

// Safe fetch wrapper that handles HTML/404 responses from Vercel without throwing
async function safeFetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`HTTP ${res.status}: Failed to fetch`);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      if (fallback !== undefined) return fallback;
      throw new Error('Received non-JSON response');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

// Public API
export async function fetchPublicSettings(): Promise<WebsiteSettings> {
  const fallback = getStoredItem('rajib_website_settings', initialSettings);
  try {
    const data = await safeFetchJson<WebsiteSettings>(`${API_BASE}/public/settings`, undefined, fallback);
    if (data && data.siteName) {
      setStoredItem('rajib_website_settings', data);
      return data;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchPublicServices(): Promise<ServiceItem[]> {
  const fallback = getStoredItem('rajib_website_services', initialServices);
  try {
    const data = await safeFetchJson<ServiceItem[]>(`${API_BASE}/public/services`, undefined, fallback);
    if (Array.isArray(data) && data.length > 0) {
      setStoredItem('rajib_website_services', data);
      return data;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchPublicProjects(): Promise<ProjectItem[]> {
  const fallback = getStoredItem('rajib_website_projects', initialProjects);
  try {
    const data = await safeFetchJson<ProjectItem[]>(`${API_BASE}/public/projects`, undefined, fallback);
    if (Array.isArray(data) && data.length > 0) {
      setStoredItem('rajib_website_projects', data);
      return data;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchPublicCaseStudies(): Promise<CaseStudyItem[]> {
  const fallback = getStoredItem('rajib_website_case_studies', initialCaseStudies);
  try {
    const data = await safeFetchJson<CaseStudyItem[]>(`${API_BASE}/public/case-studies`, undefined, fallback);
    if (Array.isArray(data) && data.length > 0) {
      setStoredItem('rajib_website_case_studies', data);
      return data;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchPublicSkills(): Promise<SkillItem[]> {
  const fallback = getStoredItem('rajib_website_skills', initialSkills);
  try {
    const data = await safeFetchJson<SkillItem[]>(`${API_BASE}/public/skills`, undefined, fallback);
    if (Array.isArray(data) && data.length > 0) {
      setStoredItem('rajib_website_skills', data);
      return data;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchPublicCertifications(): Promise<CertificationItem[]> {
  const fallback = getStoredItem('rajib_website_certifications', initialCertifications);
  try {
    const data = await safeFetchJson<CertificationItem[]>(`${API_BASE}/public/certifications`, undefined, fallback);
    if (Array.isArray(data) && data.length > 0) {
      setStoredItem('rajib_website_certifications', data);
      return data;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchPublicBlog(): Promise<BlogPostItem[]> {
  const fallback = getStoredItem('rajib_website_blog_posts', initialBlogPosts);
  try {
    const data = await safeFetchJson<BlogPostItem[]>(`${API_BASE}/public/blog`, undefined, fallback);
    if (Array.isArray(data) && data.length > 0) {
      setStoredItem('rajib_website_blog_posts', data);
      return data;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch {
    // Backend API unavailable (e.g. static host on Vercel)
  }

  // Fallback: store message in localStorage
  const existing = getStoredItem<ContactMessage[]>('rajib_admin_contact_messages', []);
  const newMsg: ContactMessage = {
    id: 'msg-' + Date.now(),
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    isRead: false,
    isArchived: false,
    createdAt: new Date().toISOString()
  };
  setStoredItem('rajib_admin_contact_messages', [newMsg, ...existing]);

  return { success: true, message: 'Message sent successfully! Our security team will review and respond shortly.' };
}

// Admin Auth Credentials & Security Questions Fallback Data
interface AdminAuthLocal {
  email: string;
  passwordHash: string;
  questions: { id: string; question: string; answer: string }[];
}

const DEFAULT_ADMIN_AUTH: AdminAuthLocal = {
  email: 'raihanhossenpabel678@gmail.com',
  passwordHash: 'RajibSecure2026!',
  questions: [
    { id: 'q1', question: 'First school you attend', answer: 'arena web security' },
    { id: 'q2', question: 'First pet', answer: 'tommy' },
    { id: 'q3', question: 'Born city', answer: 'dhaka' }
  ]
};

function getLocalAdminAuth(): AdminAuthLocal {
  return getStoredItem('rajib_admin_auth_data', DEFAULT_ADMIN_AUTH);
}

function setLocalAdminAuth(auth: AdminAuthLocal): void {
  setStoredItem('rajib_admin_auth_data', auth);
}

// Admin API
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
    const errJson = await res.json().catch(() => ({}));
    if (errJson.error) {
      throw new Error(errJson.error);
    }
  } catch (err: any) {
    if (err.message && err.message.includes('Invalid credentials')) {
      throw err;
    }
    // Backend API unreachable or 404, fallback to local validation
  }

  const localAuth = getLocalAdminAuth();
  if (email.trim().toLowerCase() === localAuth.email.toLowerCase() && password === localAuth.passwordHash) {
    const mockToken = 'rajib_admin_session_' + Date.now();
    setAuthToken(mockToken);
    return { success: true, token: mockToken };
  }

  throw new Error('Invalid email or password');
}

export async function fetchSecurityQuestions(): Promise<{ email: string; questions: { id: string; question: string }[] }> {
  try {
    const res = await fetch(`${API_BASE}/auth/security-questions`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore
  }

  const localAuth = getLocalAdminAuth();
  return {
    email: localAuth.email,
    questions: localAuth.questions.map(q => ({ id: q.id, question: q.question }))
  };
}

export async function resetAdminPassword(
  answers: Record<string, string>,
  newPassword: string,
  newEmail?: string
): Promise<{ success: boolean; message: string; token: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, newPassword, newEmail })
    });
    if (res.ok) {
      const json = await res.json();
      setAuthToken(json.token);
      return json;
    }
    const errJson = await res.json().catch(() => ({}));
    if (errJson.error) {
      throw new Error(errJson.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Fallback to local validation
  }

  const localAuth = getLocalAdminAuth();
  for (const q of localAuth.questions) {
    const submitted = (answers[q.id] || '').trim().toLowerCase();
    const expected = q.answer.trim().toLowerCase();
    if (submitted !== expected) {
      throw new Error(`Security verification failed: Incorrect answer for "${q.question}"`);
    }
  }

  localAuth.passwordHash = newPassword;
  if (newEmail && newEmail.trim()) {
    localAuth.email = newEmail.trim().toLowerCase();
  }
  setLocalAdminAuth(localAuth);

  const mockToken = 'rajib_admin_session_' + Date.now();
  setAuthToken(mockToken);
  return {
    success: true,
    message: 'Admin credentials updated successfully! You are now logged in.',
    token: mockToken
  };
}

export async function updateAdminCredentials(data: {
  email?: string;
  password?: string;
  securityQuestions?: { id: string; question: string; answer: string }[];
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/auth-credentials`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore
  }

  const localAuth = getLocalAdminAuth();
  if (data.email) localAuth.email = data.email.trim().toLowerCase();
  if (data.password) localAuth.passwordHash = data.password;
  if (data.securityQuestions) localAuth.questions = data.securityQuestions;
  setLocalAdminAuth(localAuth);

  return { success: true, message: 'Admin security credentials updated successfully' };
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
    // ignore
  }
  return true; // Local token present
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: authHeaders()
    });
  } catch {
    // ignore
  } finally {
    removeAuthToken();
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const fallback: AdminStats = {
    projectsCount: getStoredItem('rajib_website_projects', initialProjects).length,
    caseStudiesCount: getStoredItem('rajib_website_case_studies', initialCaseStudies).length,
    servicesCount: getStoredItem('rajib_website_services', initialServices).length,
    skillsCount: getStoredItem('rajib_website_skills', initialSkills).length,
    certificationsCount: getStoredItem('rajib_website_certifications', initialCertifications).length,
    blogCount: getStoredItem('rajib_website_blog_posts', initialBlogPosts).length,
    unreadMessagesCount: getStoredItem<ContactMessage[]>('rajib_admin_contact_messages', []).filter(m => !m.isRead).length,
    totalMessagesCount: getStoredItem<ContactMessage[]>('rajib_admin_contact_messages', []).length,
    mediaCount: 1
  };

  try {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  const fallback: AuditLogItem[] = getStoredItem('rajib_admin_audit_logs', [
    {
      id: 'log-1',
      action: 'PLATFORM_INITIALIZATION',
      entityType: 'SYSTEM',
      details: 'System services and security firewall initialized.',
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString()
    }
  ]);

  try {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  return fallback;
}

export async function fetchAdminSettings(): Promise<WebsiteSettings> {
  return fetchPublicSettings();
}

export async function updateAdminSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      const data = await res.json();
      setStoredItem('rajib_website_settings', data);
      return data;
    }
  } catch {
    // ignore
  }
  setStoredItem('rajib_website_settings', settings);
  return settings;
}

// Services CRUD
export async function fetchAdminServices(): Promise<ServiceItem[]> {
  return fetchPublicServices();
}

export async function createAdminService(item: Partial<ServiceItem>): Promise<ServiceItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/services`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  const services = getStoredItem('rajib_website_services', initialServices);
  const newItem: ServiceItem = {
    id: 'srv-' + Date.now(),
    title: item.title || 'New Security Service',
    slug: (item.title || 'new-service').toLowerCase().replace(/\s+/g, '-'),
    summary: item.summary || '',
    description: item.description || '',
    deliverables: item.deliverables || [],
    scope: item.scope || 'Custom Engagement',
    iconName: item.iconName || 'Shield',
    inquiryUrl: '/contact',
    isPublished: item.isPublished ?? true,
    sortOrder: services.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  setStoredItem('rajib_website_services', [...services, newItem]);
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
  } catch {
    // ignore
  }
  const services = getStoredItem('rajib_website_services', initialServices);
  const updated = services.map(s => s.id === id ? { ...s, ...item, updatedAt: new Date().toISOString() } : s);
  setStoredItem('rajib_website_services', updated);
  return updated.find(s => s.id === id)!;
}

export async function deleteAdminService(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const services = getStoredItem('rajib_website_services', initialServices);
  setStoredItem('rajib_website_services', services.filter(s => s.id !== id));
}

// Projects CRUD
export async function fetchAdminProjects(): Promise<ProjectItem[]> {
  return fetchPublicProjects();
}

export async function createAdminProject(item: Partial<ProjectItem>): Promise<ProjectItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  const projects = getStoredItem('rajib_website_projects', initialProjects);
  const newItem: ProjectItem = {
    id: 'proj-' + Date.now(),
    title: item.title || 'New Security Project',
    slug: (item.title || 'new-project').toLowerCase().replace(/\s+/g, '-'),
    summary: item.summary || item.description || '',
    description: item.description || '',
    category: item.category || 'Security Assessment',
    technologies: item.technologies || ['Python', 'Nmap', 'Burp Suite'],
    coverImage: item.coverImage || '',
    galleryImages: item.galleryImages || [],
    challenges: item.challenges || '',
    methodology: item.methodology || '',
    remediation: item.remediation || '',
    verifiedResults: item.verifiedResults || '',
    isFeatured: item.isFeatured ?? false,
    isPublished: item.isPublished ?? true,
    sortOrder: projects.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  setStoredItem('rajib_website_projects', [...projects, newItem]);
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
  } catch {
    // ignore
  }
  const projects = getStoredItem('rajib_website_projects', initialProjects);
  const updated = projects.map(p => p.id === id ? { ...p, ...item, updatedAt: new Date().toISOString() } : p);
  setStoredItem('rajib_website_projects', updated);
  return updated.find(p => p.id === id)!;
}

export async function deleteAdminProject(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const projects = getStoredItem('rajib_website_projects', initialProjects);
  setStoredItem('rajib_website_projects', projects.filter(p => p.id !== id));
}

// Case Studies CRUD
export async function fetchAdminCaseStudies(): Promise<CaseStudyItem[]> {
  return fetchPublicCaseStudies();
}

export async function createAdminCaseStudy(item: Partial<CaseStudyItem>): Promise<CaseStudyItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/case-studies`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  const caseStudies = getStoredItem('rajib_website_case_studies', initialCaseStudies);
  const newItem: CaseStudyItem = {
    id: 'cs-' + Date.now(),
    title: item.title || 'New Incident Case Study',
    slug: (item.title || 'new-case-study').toLowerCase().replace(/\s+/g, '-'),
    summary: item.summary || '',
    engagementType: item.engagementType || 'Authorized Client Engagement',
    authorizedScope: item.authorizedScope || 'Production Systems',
    methodology: item.methodology || '',
    findingsSummary: item.findingsSummary || '',
    findingsSeverity: item.findingsSeverity || 'High',
    sanitizedEvidence: item.sanitizedEvidence || '',
    remediationSteps: item.remediationSteps || '',
    verificationOutcome: item.verificationOutcome || '',
    isPublished: item.isPublished ?? true,
    sortOrder: caseStudies.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  setStoredItem('rajib_website_case_studies', [...caseStudies, newItem]);
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
  } catch {
    // ignore
  }
  const caseStudies = getStoredItem('rajib_website_case_studies', initialCaseStudies);
  const updated = caseStudies.map(cs => cs.id === id ? { ...cs, ...item, updatedAt: new Date().toISOString() } : cs);
  setStoredItem('rajib_website_case_studies', updated);
  return updated.find(cs => cs.id === id)!;
}

export async function deleteAdminCaseStudy(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/case-studies/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const caseStudies = getStoredItem('rajib_website_case_studies', initialCaseStudies);
  setStoredItem('rajib_website_case_studies', caseStudies.filter(cs => cs.id !== id));
}

// Skills CRUD
export async function fetchAdminSkills(): Promise<SkillItem[]> {
  return fetchPublicSkills();
}

export async function createAdminSkill(item: Partial<SkillItem>): Promise<SkillItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  const skills = getStoredItem('rajib_website_skills', initialSkills);
  const newItem: SkillItem = {
    id: 'sk-' + Date.now(),
    name: item.name || 'New Skill',
    category: (item.category as any) || 'Security Tools',
    proficiency: item.proficiency || 85,
    isHighlighted: item.isHighlighted ?? false,
    isPublic: item.isPublic ?? true,
    sortOrder: skills.length + 1,
    createdAt: new Date().toISOString()
  };
  setStoredItem('rajib_website_skills', [...skills, newItem]);
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
  } catch {
    // ignore
  }
  const skills = getStoredItem('rajib_website_skills', initialSkills);
  const updated = skills.map(s => s.id === id ? { ...s, ...item } : s);
  setStoredItem('rajib_website_skills', updated);
  return updated.find(s => s.id === id)!;
}

export async function deleteAdminSkill(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const skills = getStoredItem('rajib_website_skills', initialSkills);
  setStoredItem('rajib_website_skills', skills.filter(s => s.id !== id));
}

// Certifications CRUD
export async function fetchAdminCertifications(): Promise<CertificationItem[]> {
  return fetchPublicCertifications();
}

export async function createAdminCertification(item: Partial<CertificationItem>): Promise<CertificationItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/certifications`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  const certs = getStoredItem('rajib_website_certifications', initialCertifications);
  const newItem: CertificationItem = {
    id: 'cert-' + Date.now(),
    title: item.title || 'Security Certification',
    issuer: item.issuer || 'Accredited Institution',
    issueDate: item.issueDate || '2025',
    credentialId: item.credentialId || 'VERIFIED-' + Date.now(),
    verificationUrl: item.verificationUrl || '',
    certificateImage: item.certificateImage || '',
    isVerified: item.isVerified ?? true,
    isPublished: item.isPublished ?? true,
    sortOrder: certs.length + 1,
    createdAt: new Date().toISOString()
  };
  setStoredItem('rajib_website_certifications', [...certs, newItem]);
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
  } catch {
    // ignore
  }
  const certs = getStoredItem('rajib_website_certifications', initialCertifications);
  const updated = certs.map(c => c.id === id ? { ...c, ...item } : c);
  setStoredItem('rajib_website_certifications', updated);
  return updated.find(c => c.id === id)!;
}

export async function deleteAdminCertification(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const certs = getStoredItem('rajib_website_certifications', initialCertifications);
  setStoredItem('rajib_website_certifications', certs.filter(c => c.id !== id));
}

// Blog CRUD
export async function fetchAdminBlog(): Promise<BlogPostItem[]> {
  return fetchPublicBlog();
}

export async function createAdminBlogPost(item: Partial<BlogPostItem>): Promise<BlogPostItem> {
  try {
    const res = await fetch(`${API_BASE}/admin/blog`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(item)
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  const blogs = getStoredItem('rajib_website_blog_posts', initialBlogPosts);
  const newItem: BlogPostItem = {
    id: 'blog-' + Date.now(),
    title: item.title || 'New Security Article',
    slug: (item.title || 'new-security-article').toLowerCase().replace(/\s+/g, '-'),
    excerpt: item.excerpt || '',
    content: item.content || '',
    category: item.category || 'Threat Intelligence',
    tags: item.tags || ['Cybersecurity'],
    coverImage: item.coverImage || '',
    readTime: item.readTime || '5 min read',
    publishedAt: new Date().toISOString(),
    isPublished: item.isPublished ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  setStoredItem('rajib_website_blog_posts', [...blogs, newItem]);
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
  } catch {
    // ignore
  }
  const blogs = getStoredItem('rajib_website_blog_posts', initialBlogPosts);
  const updated = blogs.map(b => b.id === id ? { ...b, ...item, updatedAt: new Date().toISOString() } : b);
  setStoredItem('rajib_website_blog_posts', updated);
  return updated.find(b => b.id === id)!;
}

export async function deleteAdminBlogPost(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const blogs = getStoredItem('rajib_website_blog_posts', initialBlogPosts);
  setStoredItem('rajib_website_blog_posts', blogs.filter(b => b.id !== id));
}

// Contact Inbox
export async function fetchAdminContactMessages(): Promise<ContactMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/contact`, { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  return getStoredItem('rajib_admin_contact_messages', []);
}

export async function updateContactStatus(id: string, updates: { isRead?: boolean; isArchived?: boolean }): Promise<ContactMessage> {
  try {
    const res = await fetch(`${API_BASE}/admin/contact/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates)
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  const messages = getStoredItem<ContactMessage[]>('rajib_admin_contact_messages', []);
  const updated = messages.map(m => m.id === id ? { ...m, ...updates } : m);
  setStoredItem('rajib_admin_contact_messages', updated);
  return updated.find(m => m.id === id)!;
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/contact/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const messages = getStoredItem<ContactMessage[]>('rajib_admin_contact_messages', []);
  setStoredItem('rajib_admin_contact_messages', messages.filter(m => m.id !== id));
}

// Media Library
export async function fetchAdminMedia(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/media`, { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  return getStoredItem('rajib_admin_media_library', [
    {
      id: 'media-profile',
      filename: 'profile-photo.jpg',
      filePath: '/uploads/profile-photo.jpg',
      originalName: 'profile-photo.jpg',
      mimeType: 'image/jpeg',
      fileSize: 142000,
      storageProvider: 'local',
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function uploadMediaFile(file: File): Promise<{ success: boolean; fileUrl: string; media: MediaItem }> {
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

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore
  }

  // Fallback: Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const mediaItem: MediaItem = {
        id: 'media-' + Date.now(),
        filename: file.name,
        filePath: dataUrl,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        storageProvider: 'local',
        createdAt: new Date().toISOString()
      };
      const existing = getStoredItem<MediaItem[]>('rajib_admin_media_library', []);
      setStoredItem('rajib_admin_media_library', [mediaItem, ...existing]);
      resolve({ success: true, fileUrl: dataUrl, media: mediaItem });
    };
    reader.readAsDataURL(file);
  });
}

export async function deleteAdminMedia(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
  } catch {
    // ignore
  }
  const media = getStoredItem<MediaItem[]>('rajib_admin_media_library', []);
  setStoredItem('rajib_admin_media_library', media.filter(m => m.id !== id));
}
