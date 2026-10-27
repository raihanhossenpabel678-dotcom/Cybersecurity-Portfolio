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

// Public API
export async function fetchPublicSettings(): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/public/settings`);
  if (!res.ok) throw new Error('Failed to load settings');
  return res.json();
}

export async function fetchPublicServices(): Promise<ServiceItem[]> {
  const res = await fetch(`${API_BASE}/public/services`);
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}

export async function fetchPublicProjects(): Promise<ProjectItem[]> {
  const res = await fetch(`${API_BASE}/public/projects`);
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
}

export async function fetchPublicCaseStudies(): Promise<CaseStudyItem[]> {
  const res = await fetch(`${API_BASE}/public/case-studies`);
  if (!res.ok) throw new Error('Failed to load case studies');
  return res.json();
}

export async function fetchPublicSkills(): Promise<SkillItem[]> {
  const res = await fetch(`${API_BASE}/public/skills`);
  if (!res.ok) throw new Error('Failed to load skills');
  return res.json();
}

export async function fetchPublicCertifications(): Promise<CertificationItem[]> {
  const res = await fetch(`${API_BASE}/public/certifications`);
  if (!res.ok) throw new Error('Failed to load certifications');
  return res.json();
}

export async function fetchPublicBlog(): Promise<BlogPostItem[]> {
  const res = await fetch(`${API_BASE}/public/blog`);
  if (!res.ok) throw new Error('Failed to load blog posts');
  return res.json();
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/public/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to submit contact message');
  }
  return json;
}

// Admin API
export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  setAuthToken(json.token);
  return json;
}

export async function fetchSecurityQuestions(): Promise<{ email: string; questions: { id: string; question: string }[] }> {
  const res = await fetch(`${API_BASE}/auth/security-questions`);
  if (!res.ok) throw new Error('Failed to load security questions');
  return res.json();
}

export async function resetAdminPassword(
  answers: Record<string, string>,
  newPassword: string,
  newEmail?: string
): Promise<{ success: boolean; message: string; token: string }> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, newPassword, newEmail })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset credentials');
  setAuthToken(json.token);
  return json;
}

export async function updateAdminCredentials(data: {
  email?: string;
  password?: string;
  securityQuestions?: { id: string; question: string; answer: string }[];
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/auth-credentials`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update credentials');
  return json;
}

export async function checkAuth(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders()
    });
    if (!res.ok) return false;
    const json = await res.json();
    return !!json.authenticated;
  } catch {
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: authHeaders()
    });
  } finally {
    removeAuthToken();
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load admin stats');
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load audit logs');
  return res.json();
}

export async function fetchAdminSettings(): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load settings');
  return res.json();
}

export async function updateAdminSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

// Services CRUD
export async function fetchAdminServices(): Promise<ServiceItem[]> {
  const res = await fetch(`${API_BASE}/admin/services`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function createAdminService(item: Partial<ServiceItem>): Promise<ServiceItem> {
  const res = await fetch(`${API_BASE}/admin/services`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create service');
  return res.json();
}

export async function updateAdminService(id: string, item: Partial<ServiceItem>): Promise<ServiceItem> {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update service');
  return res.json();
}

export async function deleteAdminService(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete service');
}

// Projects CRUD
export async function fetchAdminProjects(): Promise<ProjectItem[]> {
  const res = await fetch(`${API_BASE}/admin/projects`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createAdminProject(item: Partial<ProjectItem>): Promise<ProjectItem> {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateAdminProject(id: string, item: Partial<ProjectItem>): Promise<ProjectItem> {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteAdminProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

// Case Studies CRUD
export async function fetchAdminCaseStudies(): Promise<CaseStudyItem[]> {
  const res = await fetch(`${API_BASE}/admin/case-studies`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch case studies');
  return res.json();
}

export async function createAdminCaseStudy(item: Partial<CaseStudyItem>): Promise<CaseStudyItem> {
  const res = await fetch(`${API_BASE}/admin/case-studies`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create case study');
  return res.json();
}

export async function updateAdminCaseStudy(id: string, item: Partial<CaseStudyItem>): Promise<CaseStudyItem> {
  const res = await fetch(`${API_BASE}/admin/case-studies/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update case study');
  return res.json();
}

export async function deleteAdminCaseStudy(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/case-studies/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete case study');
}

// Skills CRUD
export async function fetchAdminSkills(): Promise<SkillItem[]> {
  const res = await fetch(`${API_BASE}/admin/skills`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json();
}

export async function createAdminSkill(item: Partial<SkillItem>): Promise<SkillItem> {
  const res = await fetch(`${API_BASE}/admin/skills`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create skill');
  return res.json();
}

export async function updateAdminSkill(id: string, item: Partial<SkillItem>): Promise<SkillItem> {
  const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update skill');
  return res.json();
}

export async function deleteAdminSkill(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete skill');
}

// Certifications CRUD
export async function fetchAdminCertifications(): Promise<CertificationItem[]> {
  const res = await fetch(`${API_BASE}/admin/certifications`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch certifications');
  return res.json();
}

export async function createAdminCertification(item: Partial<CertificationItem>): Promise<CertificationItem> {
  const res = await fetch(`${API_BASE}/admin/certifications`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create certification');
  return res.json();
}

export async function updateAdminCertification(id: string, item: Partial<CertificationItem>): Promise<CertificationItem> {
  const res = await fetch(`${API_BASE}/admin/certifications/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update certification');
  return res.json();
}

export async function deleteAdminCertification(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/certifications/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete certification');
}

// Blog CRUD
export async function fetchAdminBlog(): Promise<BlogPostItem[]> {
  const res = await fetch(`${API_BASE}/admin/blog`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export async function createAdminBlogPost(item: Partial<BlogPostItem>): Promise<BlogPostItem> {
  const res = await fetch(`${API_BASE}/admin/blog`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create article');
  return res.json();
}

export async function updateAdminBlogPost(id: string, item: Partial<BlogPostItem>): Promise<BlogPostItem> {
  const res = await fetch(`${API_BASE}/admin/blog/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update article');
  return res.json();
}

export async function deleteAdminBlogPost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/blog/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete article');
}

// Contact Inbox
export async function fetchAdminContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE}/admin/contact`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch contact messages');
  return res.json();
}

export async function updateContactStatus(id: string, updates: { isRead?: boolean; isArchived?: boolean }): Promise<ContactMessage> {
  const res = await fetch(`${API_BASE}/admin/contact/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update message status');
  return res.json();
}

export async function deleteContactMessage(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/contact/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete message');
}

// Media Library
export async function fetchAdminMedia(): Promise<MediaItem[]> {
  const res = await fetch(`${API_BASE}/admin/media`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}

export async function uploadMediaFile(file: File): Promise<{ success: boolean; fileUrl: string; media: MediaItem }> {
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

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to upload media file');
  return json;
}

export async function deleteAdminMedia(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/media/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete media');
}
