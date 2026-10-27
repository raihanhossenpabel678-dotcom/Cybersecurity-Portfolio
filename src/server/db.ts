import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
} from './seedData';

interface DatabaseData {
  settings: WebsiteSettings;
  services: ServiceItem[];
  projects: ProjectItem[];
  caseStudies: CaseStudyItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  blogPosts: BlogPostItem[];
  contactMessages: ContactMessage[];
  mediaLibrary: MediaItem[];
  auditLogs: AuditLogItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialize Supabase if environment variables exist
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Database] Connected to external Supabase PostgreSQL instance.');
  } catch (err) {
    console.warn('[Database] Supabase initialization failed, using persistent local engine:', err);
  }
}

class DatabaseEngine {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: parsed.settings || initialSettings,
          services: parsed.services || initialServices,
          projects: parsed.projects || initialProjects,
          caseStudies: parsed.caseStudies || initialCaseStudies,
          skills: parsed.skills || initialSkills,
          certifications: parsed.certifications || initialCertifications,
          blogPosts: parsed.blogPosts || initialBlogPosts,
          contactMessages: parsed.contactMessages || [],
          mediaLibrary: parsed.mediaLibrary || [],
          auditLogs: parsed.auditLogs || []
        };
      }
    } catch (err) {
      console.error('[Database] Failed to read db.json, initializing defaults:', err);
    }

    const initialData: DatabaseData = {
      settings: initialSettings,
      services: initialServices,
      projects: initialProjects,
      caseStudies: initialCaseStudies,
      skills: initialSkills,
      certifications: initialCertifications,
      blogPosts: initialBlogPosts,
      contactMessages: [],
      mediaLibrary: [],
      auditLogs: [
        {
          id: 'log-init',
          action: 'SYSTEM_INITIALIZED',
          entityType: 'System',
          details: 'Initialized portfolio database engine for MD. Raihan Hossen Rajib',
          createdAt: new Date().toISOString()
        }
      ]
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave?: DatabaseData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const toWrite = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(toWrite, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Error saving to db.json:', err);
    }
  }

  // --- Website Settings ---
  getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<WebsiteSettings>): WebsiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    this.logAction('UPDATE_SETTINGS', 'WebsiteSettings', 'settings', 'Updated website global settings');
    return this.data.settings;
  }

  // --- Services ---
  getServices(includeDrafts = false): ServiceItem[] {
    const list = includeDrafts ? this.data.services : this.data.services.filter(s => s.isPublished);
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getServiceBySlug(slug: string): ServiceItem | undefined {
    return this.data.services.find(s => s.slug === slug);
  }

  createService(payload: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): ServiceItem {
    const newService: ServiceItem = {
      id: 'srv-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.services.push(newService);
    this.saveData();
    this.logAction('CREATE_SERVICE', 'Service', newService.id, `Created service: ${newService.title}`);
    return newService;
  }

  updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const idx = this.data.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = {
      ...this.data.services[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    this.logAction('UPDATE_SERVICE', 'Service', id, `Updated service: ${this.data.services[idx].title}`);
    return this.data.services[idx];
  }

  deleteService(id: string): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.saveData();
      this.logAction('DELETE_SERVICE', 'Service', id, `Deleted service ID: ${id}`);
      return true;
    }
    return false;
  }

  // --- Projects ---
  getProjects(includeDrafts = false): ProjectItem[] {
    const list = includeDrafts ? this.data.projects : this.data.projects.filter(p => p.isPublished);
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getProjectBySlug(slug: string): ProjectItem | undefined {
    return this.data.projects.find(p => p.slug === slug);
  }

  createProject(payload: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>): ProjectItem {
    const newProject: ProjectItem = {
      id: 'proj-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects.push(newProject);
    this.saveData();
    this.logAction('CREATE_PROJECT', 'Project', newProject.id, `Created project: ${newProject.title}`);
    return newProject;
  }

  updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    this.logAction('UPDATE_PROJECT', 'Project', id, `Updated project: ${this.data.projects[idx].title}`);
    return this.data.projects[idx];
  }

  deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.saveData();
      this.logAction('DELETE_PROJECT', 'Project', id, `Deleted project ID: ${id}`);
      return true;
    }
    return false;
  }

  // --- Case Studies ---
  getCaseStudies(includeDrafts = false): CaseStudyItem[] {
    const list = includeDrafts ? this.data.caseStudies : this.data.caseStudies.filter(c => c.isPublished);
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getCaseStudyBySlug(slug: string): CaseStudyItem | undefined {
    return this.data.caseStudies.find(c => c.slug === slug);
  }

  createCaseStudy(payload: Omit<CaseStudyItem, 'id' | 'createdAt' | 'updatedAt'>): CaseStudyItem {
    const newCaseStudy: CaseStudyItem = {
      id: 'cs-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.caseStudies.push(newCaseStudy);
    this.saveData();
    this.logAction('CREATE_CASE_STUDY', 'CaseStudy', newCaseStudy.id, `Created case study: ${newCaseStudy.title}`);
    return newCaseStudy;
  }

  updateCaseStudy(id: string, updates: Partial<CaseStudyItem>): CaseStudyItem | null {
    const idx = this.data.caseStudies.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.caseStudies[idx] = {
      ...this.data.caseStudies[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    this.logAction('UPDATE_CASE_STUDY', 'CaseStudy', id, `Updated case study: ${this.data.caseStudies[idx].title}`);
    return this.data.caseStudies[idx];
  }

  deleteCaseStudy(id: string): boolean {
    const initialLen = this.data.caseStudies.length;
    this.data.caseStudies = this.data.caseStudies.filter(c => c.id !== id);
    if (this.data.caseStudies.length !== initialLen) {
      this.saveData();
      this.logAction('DELETE_CASE_STUDY', 'CaseStudy', id, `Deleted case study ID: ${id}`);
      return true;
    }
    return false;
  }

  // --- Skills ---
  getSkills(includePrivate = false): SkillItem[] {
    const list = includePrivate ? this.data.skills : this.data.skills.filter(s => s.isPublic);
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createSkill(payload: Omit<SkillItem, 'id' | 'createdAt'>): SkillItem {
    const newSkill: SkillItem = {
      id: 'sk-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString()
    };
    this.data.skills.push(newSkill);
    this.saveData();
    this.logAction('CREATE_SKILL', 'Skill', newSkill.id, `Created skill: ${newSkill.name}`);
    return newSkill;
  }

  updateSkill(id: string, updates: Partial<SkillItem>): SkillItem | null {
    const idx = this.data.skills.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.skills[idx] = {
      ...this.data.skills[idx],
      ...updates
    };
    this.saveData();
    this.logAction('UPDATE_SKILL', 'Skill', id, `Updated skill: ${this.data.skills[idx].name}`);
    return this.data.skills[idx];
  }

  deleteSkill(id: string): boolean {
    const initialLen = this.data.skills.length;
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    if (this.data.skills.length !== initialLen) {
      this.saveData();
      this.logAction('DELETE_SKILL', 'Skill', id, `Deleted skill ID: ${id}`);
      return true;
    }
    return false;
  }

  // --- Certifications ---
  getCertifications(includeDrafts = false): CertificationItem[] {
    const list = includeDrafts ? this.data.certifications : this.data.certifications.filter(c => c.isPublished);
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createCertification(payload: Omit<CertificationItem, 'id' | 'createdAt'>): CertificationItem {
    const newCert: CertificationItem = {
      id: 'cert-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString()
    };
    this.data.certifications.push(newCert);
    this.saveData();
    this.logAction('CREATE_CERTIFICATION', 'Certification', newCert.id, `Created certification: ${newCert.title}`);
    return newCert;
  }

  updateCertification(id: string, updates: Partial<CertificationItem>): CertificationItem | null {
    const idx = this.data.certifications.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.certifications[idx] = {
      ...this.data.certifications[idx],
      ...updates
    };
    this.saveData();
    this.logAction('UPDATE_CERTIFICATION', 'Certification', id, `Updated certification: ${this.data.certifications[idx].title}`);
    return this.data.certifications[idx];
  }

  deleteCertification(id: string): boolean {
    const initialLen = this.data.certifications.length;
    this.data.certifications = this.data.certifications.filter(c => c.id !== id);
    if (this.data.certifications.length !== initialLen) {
      this.saveData();
      this.logAction('DELETE_CERTIFICATION', 'Certification', id, `Deleted certification ID: ${id}`);
      return true;
    }
    return false;
  }

  // --- Blog Posts ---
  getBlogPosts(includeDrafts = false): BlogPostItem[] {
    const list = includeDrafts ? this.data.blogPosts : this.data.blogPosts.filter(b => b.isPublished);
    return list.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  getBlogPostBySlug(slug: string): BlogPostItem | undefined {
    return this.data.blogPosts.find(b => b.slug === slug);
  }

  createBlogPost(payload: Omit<BlogPostItem, 'id' | 'createdAt' | 'updatedAt'>): BlogPostItem {
    const newPost: BlogPostItem = {
      id: 'post-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.blogPosts.push(newPost);
    this.saveData();
    this.logAction('CREATE_BLOG_POST', 'BlogPost', newPost.id, `Created article: ${newPost.title}`);
    return newPost;
  }

  updateBlogPost(id: string, updates: Partial<BlogPostItem>): BlogPostItem | null {
    const idx = this.data.blogPosts.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.blogPosts[idx] = {
      ...this.data.blogPosts[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    this.logAction('UPDATE_BLOG_POST', 'BlogPost', id, `Updated article: ${this.data.blogPosts[idx].title}`);
    return this.data.blogPosts[idx];
  }

  deleteBlogPost(id: string): boolean {
    const initialLen = this.data.blogPosts.length;
    this.data.blogPosts = this.data.blogPosts.filter(b => b.id !== id);
    if (this.data.blogPosts.length !== initialLen) {
      this.saveData();
      this.logAction('DELETE_BLOG_POST', 'BlogPost', id, `Deleted article ID: ${id}`);
      return true;
    }
    return false;
  }

  // --- Contact Inbox ---
  getContactMessages(): ContactMessage[] {
    return [...this.data.contactMessages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createContactMessage(payload: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead' | 'isArchived'>): ContactMessage {
    const newMessage: ContactMessage = {
      id: 'msg-' + Date.now(),
      ...payload,
      isRead: false,
      isArchived: false,
      createdAt: new Date().toISOString()
    };
    this.data.contactMessages.push(newMessage);
    this.saveData();
    this.logAction('RECEIVE_CONTACT_INQUIRY', 'ContactMessage', newMessage.id, `Inquiry from ${newMessage.name} (${newMessage.email})`);
    return newMessage;
  }

  updateContactMessage(id: string, updates: Partial<ContactMessage>): ContactMessage | null {
    const idx = this.data.contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.contactMessages[idx] = {
      ...this.data.contactMessages[idx],
      ...updates
    };
    this.saveData();
    return this.data.contactMessages[idx];
  }

  deleteContactMessage(id: string): boolean {
    const initialLen = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter(m => m.id !== id);
    if (this.data.contactMessages.length !== initialLen) {
      this.saveData();
      this.logAction('DELETE_CONTACT_MESSAGE', 'ContactMessage', id, `Deleted message ID: ${id}`);
      return true;
    }
    return false;
  }

  // --- Media Library ---
  getMediaItems(): MediaItem[] {
    return [...this.data.mediaLibrary].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
    const newItem: MediaItem = {
      id: 'media-' + Date.now(),
      ...item,
      createdAt: new Date().toISOString()
    };
    this.data.mediaLibrary.push(newItem);
    this.saveData();
    this.logAction('UPLOAD_MEDIA', 'MediaItem', newItem.id, `Uploaded media: ${newItem.originalName}`);
    return newItem;
  }

  deleteMediaItem(id: string): boolean {
    const item = this.data.mediaLibrary.find(m => m.id === id);
    if (!item) return false;

    // Delete local file if stored locally
    if (item.storageProvider === 'local') {
      try {
        const fullPath = path.resolve(process.cwd(), item.filePath.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (e) {
        console.warn('[Database] Could not remove physical file:', e);
      }
    }

    this.data.mediaLibrary = this.data.mediaLibrary.filter(m => m.id !== id);
    this.saveData();
    this.logAction('DELETE_MEDIA', 'MediaItem', id, `Deleted media: ${item.originalName}`);
    return true;
  }

  // --- Audit Trail ---
  getAuditLogs(): AuditLogItem[] {
    return [...this.data.auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  logAction(action: string, entityType: string, entityId?: string, details?: string, ipAddress?: string): AuditLogItem {
    const log: AuditLogItem = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      entityType,
      entityId,
      details: details || '',
      ipAddress,
      createdAt: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.saveData();
    return log;
  }

  // --- Admin Stats ---
  getAdminStats(): AdminStats {
    return {
      projectsCount: this.data.projects.length,
      caseStudiesCount: this.data.caseStudies.length,
      servicesCount: this.data.services.length,
      skillsCount: this.data.skills.length,
      certificationsCount: this.data.certifications.length,
      blogCount: this.data.blogPosts.length,
      unreadMessagesCount: this.data.contactMessages.filter(m => !m.isRead).length,
      totalMessagesCount: this.data.contactMessages.length,
      mediaCount: this.data.mediaLibrary.length
    };
  }
}

export const db = new DatabaseEngine();
