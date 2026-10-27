import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  honeypot: z.string().optional() // Anti-bot honeypot field
});

export const websiteSettingsSchema = z.object({
  siteName: z.string().min(2),
  professionalTitle: z.string().min(2),
  heroHeadline: z.string().min(5),
  heroDescription: z.string().min(10),
  bioContent: z.string().min(20),
  contactEmail: z.string().email(),
  fiverrUrl: z.string().url().or(z.string().length(0)),
  linkedinUrl: z.string().url().or(z.string().length(0)),
  githubUrl: z.string().url().or(z.string().length(0)),
  profilePhotoUrl: z.string().optional().default(''),
  footerText: z.string().min(2),
  sectionVisibility: z.object({
    projects: z.boolean(),
    services: z.boolean(),
    caseStudies: z.boolean(),
    skills: z.boolean(),
    certifications: z.boolean(),
    blog: z.boolean(),
    contact: z.boolean()
  })
});

export const serviceSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().min(10).max(300),
  description: z.string().min(20),
  deliverables: z.array(z.string()),
  scope: z.string().min(3),
  iconName: z.string().default('Shield'),
  inquiryUrl: z.string().default('/contact'),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

export const projectSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().min(10).max(350),
  description: z.string().min(20),
  category: z.string().min(2),
  technologies: z.array(z.string()),
  coverImage: z.string().optional().default(''),
  galleryImages: z.array(z.string()).default([]),
  challenges: z.string().optional().default(''),
  methodology: z.string().optional().default(''),
  remediation: z.string().optional().default(''),
  verifiedResults: z.string().optional().default(''),
  externalUrl: z.string().url().or(z.string().length(0)).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

export const caseStudySchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().min(10).max(400),
  engagementType: z.enum(['Authorized Client Engagement', 'Laboratory Assessment', 'Ethical Security Simulation']),
  authorizedScope: z.string().min(5),
  methodology: z.string().min(10),
  findingsSummary: z.string().min(10),
  findingsSeverity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  sanitizedEvidence: z.string().optional().default(''),
  remediationSteps: z.string().min(10),
  verificationOutcome: z.string().min(5),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

export const skillSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['WordPress Security', 'Penetration Testing', 'Development & Scripting', 'OSINT & Reconnaissance', 'Security Tools']),
  proficiency: z.number().min(0).max(100).default(85),
  isHighlighted: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

export const certificationSchema = z.object({
  title: z.string().min(3).max(150),
  issuer: z.string().min(2).max(120),
  issueDate: z.string().min(2),
  credentialId: z.string().optional().default(''),
  verificationUrl: z.string().url().or(z.string().length(0)).optional().default(''),
  certificateImage: z.string().optional().default(''),
  isVerified: z.boolean().default(true),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

export const blogPostSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(10).max(400),
  content: z.string().min(20),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional().default(''),
  readTime: z.string().default('5 min read'),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().optional()
});
