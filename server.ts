import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { db } from './src/server/db';
import {
  loginSchema,
  contactSchema,
  websiteSettingsSchema,
  serviceSchema,
  projectSchema,
  caseStudySchema,
  skillSchema,
  certificationSchema,
  blogPostSchema
} from './src/server/schemas';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Admin configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'raihanhossenpabel678@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'RajibSecure2026!';
const JWT_SECRET = process.env.JWT_SECRET || 'cyber-rajib-secret-salt-' + (process.env.APP_URL || 'local');

// In-memory active tokens (persisted in memory with timestamp)
const activeTokens = new Set<string>();

// Generate secure session token
function generateToken(email: string): string {
  const payload = `${email}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  const hmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64');
  activeTokens.add(token);
  return token;
}

function verifyToken(token: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return false;
    const [email, timestamp, randomHex, receivedHmac] = parts;
    const payload = `${email}:${timestamp}:${randomHex}`;
    const expectedHmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac))) {
      return activeTokens.has(token);
    }
  } catch {
    return false;
  }
  return false;
}

// Ensure uploads folder exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve uploaded assets with appropriate cache control
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// Simple Sliding Window Rate Limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const clientRecord = rateLimitMap.get(clientIp);

    if (!clientRecord || now > clientRecord.resetAt) {
      rateLimitMap.set(clientIp, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (clientRecord.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.'
      });
    }

    clientRecord.count += 1;
    next();
  };
}

// Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
  }

  const token = authHeader.split(' ')[1];
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  next();
}

// Multer storage for secure uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const sanitizedBase = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf'
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, SVG, and PDF files are allowed.'));
    }
  }
});

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/login', rateLimiter(10, 15 * 60 * 1000), (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const { email, password } = parseResult.data;
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    const token = generateToken(email);
    db.logAction('ADMIN_LOGIN_SUCCESS', 'Auth', undefined, `Admin logged in successfully: ${email}`);
    return res.json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
        name: 'MD. RAIHAN HOSSEN RAJIB',
        role: 'Administrator'
      }
    });
  }

  db.logAction('ADMIN_LOGIN_FAILURE', 'Auth', undefined, `Failed login attempt for: ${email}`);
  return res.status(401).json({ error: 'Invalid email or password' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  const isValid = verifyToken(token);
  if (isValid) {
    return res.json({
      authenticated: true,
      user: {
        email: ADMIN_EMAIL,
        name: 'MD. RAIHAN HOSSEN RAJIB',
        role: 'Administrator'
      }
    });
  }
  return res.json({ authenticated: false });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeTokens.delete(token);
  }
  res.json({ success: true });
});

// ==========================================
// 2. PUBLIC API ENDPOINTS
// ==========================================

app.get('/api/public/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.get('/api/public/services', (_req: Request, res: Response) => {
  res.json(db.getServices(false));
});

app.get('/api/public/services/:slug', (req: Request, res: Response) => {
  const item = db.getServiceBySlug(req.params.slug);
  if (!item || !item.isPublished) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(item);
});

app.get('/api/public/projects', (_req: Request, res: Response) => {
  res.json(db.getProjects(false));
});

app.get('/api/public/projects/:slug', (req: Request, res: Response) => {
  const item = db.getProjectBySlug(req.params.slug);
  if (!item || !item.isPublished) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(item);
});

app.get('/api/public/case-studies', (_req: Request, res: Response) => {
  res.json(db.getCaseStudies(false));
});

app.get('/api/public/case-studies/:slug', (req: Request, res: Response) => {
  const item = db.getCaseStudyBySlug(req.params.slug);
  if (!item || !item.isPublished) {
    return res.status(404).json({ error: 'Case study not found' });
  }
  res.json(item);
});

app.get('/api/public/skills', (_req: Request, res: Response) => {
  res.json(db.getSkills(false));
});

app.get('/api/public/certifications', (_req: Request, res: Response) => {
  res.json(db.getCertifications(false));
});

app.get('/api/public/blog', (_req: Request, res: Response) => {
  res.json(db.getBlogPosts(false));
});

app.get('/api/public/blog/:slug', (req: Request, res: Response) => {
  const item = db.getBlogPostBySlug(req.params.slug);
  if (!item || !item.isPublished) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(item);
});

// Contact Submission with Honeypot & Rate Limit
app.post('/api/public/contact', rateLimiter(5, 15 * 60 * 1000), (req: Request, res: Response) => {
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const { name, email, subject, message, honeypot } = parseResult.data;

  // Bot check
  if (honeypot && honeypot.trim().length > 0) {
    // Silently succeed to fool bots without storing
    return res.json({ success: true, message: 'Inquiry received' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 16);

  const saved = db.createContactMessage({
    name,
    email,
    subject,
    message,
    ipHash
  });

  return res.json({
    success: true,
    message: 'Your message has been securely submitted. MD. Raihan Hossen Rajib will review and respond promptly.',
    id: saved.id
  });
});

// ==========================================
// 3. ADMIN MANAGEMENT ENDPOINTS (PROTECTED)
// ==========================================

app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getAdminStats());
});

app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getAuditLogs());
});

// Settings
app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const parseResult = websiteSettingsSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const updated = db.updateSettings(parseResult.data);
  res.json(updated);
});

// Services CRUD
app.get('/api/admin/services', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getServices(true));
});

app.post('/api/admin/services', requireAdmin, (req: Request, res: Response) => {
  const parseResult = serviceSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const item = db.createService(parseResult.data);
  res.status(201).json(item);
});

app.put('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  const parseResult = serviceSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const updated = db.updateService(req.params.id, parseResult.data);
  if (!updated) return res.status(404).json({ error: 'Service not found' });
  res.json(updated);
});

app.delete('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteService(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Service not found' });
  res.json({ success: true });
});

// Projects CRUD
app.get('/api/admin/projects', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getProjects(true));
});

app.post('/api/admin/projects', requireAdmin, (req: Request, res: Response) => {
  const parseResult = projectSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const item = db.createProject(parseResult.data);
  res.status(201).json(item);
});

app.put('/api/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const parseResult = projectSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const updated = db.updateProject(req.params.id, parseResult.data);
  if (!updated) return res.status(404).json({ error: 'Project not found' });
  res.json(updated);
});

app.delete('/api/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteProject(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

// Case Studies CRUD
app.get('/api/admin/case-studies', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getCaseStudies(true));
});

app.post('/api/admin/case-studies', requireAdmin, (req: Request, res: Response) => {
  const parseResult = caseStudySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const item = db.createCaseStudy(parseResult.data);
  res.status(201).json(item);
});

app.put('/api/admin/case-studies/:id', requireAdmin, (req: Request, res: Response) => {
  const parseResult = caseStudySchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const updated = db.updateCaseStudy(req.params.id, parseResult.data);
  if (!updated) return res.status(404).json({ error: 'Case study not found' });
  res.json(updated);
});

app.delete('/api/admin/case-studies/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteCaseStudy(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Case study not found' });
  res.json({ success: true });
});

// Skills CRUD
app.get('/api/admin/skills', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getSkills(true));
});

app.post('/api/admin/skills', requireAdmin, (req: Request, res: Response) => {
  const parseResult = skillSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const item = db.createSkill(parseResult.data);
  res.status(201).json(item);
});

app.put('/api/admin/skills/:id', requireAdmin, (req: Request, res: Response) => {
  const parseResult = skillSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const updated = db.updateSkill(req.params.id, parseResult.data);
  if (!updated) return res.status(404).json({ error: 'Skill not found' });
  res.json(updated);
});

app.delete('/api/admin/skills/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteSkill(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Skill not found' });
  res.json({ success: true });
});

// Certifications CRUD
app.get('/api/admin/certifications', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getCertifications(true));
});

app.post('/api/admin/certifications', requireAdmin, (req: Request, res: Response) => {
  const parseResult = certificationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const item = db.createCertification(parseResult.data);
  res.status(201).json(item);
});

app.put('/api/admin/certifications/:id', requireAdmin, (req: Request, res: Response) => {
  const parseResult = certificationSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const updated = db.updateCertification(req.params.id, parseResult.data);
  if (!updated) return res.status(404).json({ error: 'Certification not found' });
  res.json(updated);
});

app.delete('/api/admin/certifications/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteCertification(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Certification not found' });
  res.json({ success: true });
});

// Blog CRUD
app.get('/api/admin/blog', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getBlogPosts(true));
});

app.post('/api/admin/blog', requireAdmin, (req: Request, res: Response) => {
  const parseResult = blogPostSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const item = db.createBlogPost({
    ...parseResult.data,
    publishedAt: parseResult.data.publishedAt || new Date().toISOString()
  });
  res.status(201).json(item);
});

app.put('/api/admin/blog/:id', requireAdmin, (req: Request, res: Response) => {
  const parseResult = blogPostSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }
  const updated = db.updateBlogPost(req.params.id, parseResult.data);
  if (!updated) return res.status(404).json({ error: 'Article not found' });
  res.json(updated);
});

app.delete('/api/admin/blog/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteBlogPost(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Article not found' });
  res.json({ success: true });
});

// Contact Inbox Management
app.get('/api/admin/contact', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getContactMessages());
});

app.put('/api/admin/contact/:id', requireAdmin, (req: Request, res: Response) => {
  const { isRead, isArchived } = req.body;
  const updated = db.updateContactMessage(req.params.id, {
    ...(isRead !== undefined ? { isRead } : {}),
    ...(isArchived !== undefined ? { isArchived } : {})
  });
  if (!updated) return res.status(404).json({ error: 'Message not found' });
  res.json(updated);
});

app.delete('/api/admin/contact/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteContactMessage(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Message not found' });
  res.json({ success: true });
});

// Media Library & Secure Uploads
app.get('/api/admin/media', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getMediaItems());
});

app.post('/api/admin/media/upload', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or file rejected by security filters' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const mediaRecord = db.addMediaItem({
    filename: req.file.filename,
    filePath: fileUrl,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,
    storageProvider: 'local'
  });

  return res.status(201).json({
    success: true,
    fileUrl,
    media: mediaRecord
  });
});

app.delete('/api/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteMediaItem(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Media not found' });
  res.json({ success: true });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: err.message || 'Internal server error occurred'
  });
});

// ==========================================
// 4. FRONTEND INTEGRATION (DEV & PROD)
// ==========================================

async function startServer() {
  if (!isProduction) {
    // Vite Dev Server Middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[MD. Raihan Hossen Rajib Portfolio] Server running on port ${PORT}`);
  });
}

startServer();
