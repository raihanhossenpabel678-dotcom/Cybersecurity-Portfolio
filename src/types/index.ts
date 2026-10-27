export interface WebsiteSettings {
  id: string;
  siteName: string;
  professionalTitle: string;
  heroHeadline: string;
  heroDescription: string;
  bioContent: string;
  contactEmail: string;
  fiverrUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  profilePhotoUrl: string;
  footerText: string;
  sectionVisibility: {
    projects: boolean;
    services: boolean;
    caseStudies: boolean;
    skills: boolean;
    certifications: boolean;
    blog: boolean;
    contact: boolean;
  };
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  deliverables: string[];
  scope: string;
  iconName: string;
  inquiryUrl: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  technologies: string[];
  coverImage: string;
  galleryImages: string[];
  challenges: string;
  methodology: string;
  remediation: string;
  verifiedResults: string;
  externalUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type EngagementType = 'Authorized Client Engagement' | 'Laboratory Assessment' | 'Ethical Security Simulation';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface CaseStudyItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  engagementType: EngagementType;
  authorizedScope: string;
  methodology: string;
  findingsSummary: string;
  findingsSeverity: SeverityLevel;
  sanitizedEvidence: string;
  remediationSteps: string;
  verificationOutcome: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'WordPress Security' | 'Penetration Testing' | 'Development & Scripting' | 'OSINT & Reconnaissance' | 'Security Tools';
  proficiency: number;
  isHighlighted: boolean;
  isPublic: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  certificateImage?: string;
  isVerified: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readTime: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  ipHash?: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  storageProvider: 'local' | 'supabase';
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminStats {
  projectsCount: number;
  caseStudiesCount: number;
  servicesCount: number;
  skillsCount: number;
  certificationsCount: number;
  blogCount: number;
  unreadMessagesCount: number;
  totalMessagesCount: number;
  mediaCount: number;
}
