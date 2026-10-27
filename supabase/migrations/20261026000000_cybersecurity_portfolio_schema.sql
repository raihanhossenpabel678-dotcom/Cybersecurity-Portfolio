-- ====================================================================
-- SUPABASE POSTGRESQL MIGRATION FOR MD. RAIHAN HOSSEN RAJIB PORTFOLIO
-- Schema, Tables, Constraints, Indexes, RLS Policies, and Audit Trail
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Website Settings Table
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'MD. RAIHAN HOSSEN RAJIB',
    professional_title TEXT NOT NULL DEFAULT 'Cybersecurity Specialist & Ethical Hacker',
    hero_headline TEXT NOT NULL DEFAULT 'Securing Digital Assets. Strengthening Web Applications.',
    hero_description TEXT NOT NULL DEFAULT 'Specialized in WordPress Malware Removal, Hardening, Authorized Penetration Testing, and Python/Django Security.',
    bio_content TEXT NOT NULL,
    contact_email TEXT NOT NULL DEFAULT 'raihanhossenpabel678@gmail.com',
    fiverr_url TEXT DEFAULT 'https://www.fiverr.com',
    linkedin_url TEXT DEFAULT 'https://www.linkedin.com',
    github_url TEXT DEFAULT 'https://github.com',
    profile_photo_url TEXT DEFAULT '',
    footer_text TEXT NOT NULL DEFAULT '© 2026 MD. RAIHAN HOSSEN RAJIB. All rights reserved. Authorized security audits only.',
    section_visibility JSONB NOT NULL DEFAULT '{"projects": true, "services": true, "caseStudies": true, "skills": true, "certifications": true, "blog": true, "contact": true}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[] NOT NULL DEFAULT '{}',
    scope TEXT NOT NULL DEFAULT 'Standard Authorized Assessment',
    icon_name TEXT NOT NULL DEFAULT 'Shield',
    inquiry_url TEXT DEFAULT '/contact',
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT DEFAULT '',
    gallery_images TEXT[] NOT NULL DEFAULT '{}',
    challenges TEXT,
    methodology TEXT,
    remediation TEXT,
    verified_results TEXT,
    external_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Case Studies Table (Distinguishes Authorized Scope & Lab Demonstrations)
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    engagement_type TEXT NOT NULL DEFAULT 'Laboratory Assessment', -- 'Client Engagement' or 'Laboratory Assessment'
    authorized_scope TEXT NOT NULL,
    methodology TEXT NOT NULL,
    findings_summary TEXT NOT NULL,
    findings_severity TEXT NOT NULL DEFAULT 'High', -- 'Critical', 'High', 'Medium', 'Low'
    sanitized_evidence TEXT,
    remediation_steps TEXT NOT NULL,
    verification_outcome TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'WordPress Security', 'Penetration Testing', 'Development & Scripting', 'OSINT & Reconnaissance', 'Security Tools'
    proficiency INT NOT NULL DEFAULT 85,
    is_highlighted BOOLEAN NOT NULL DEFAULT false,
    is_public BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Certifications Table (Real Verified Credentials Only)
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    credential_id TEXT,
    verification_url TEXT,
    certificate_image TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT,
    read_time TEXT NOT NULL DEFAULT '5 min read',
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Contact Inbox Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_inbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Media Library Table
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    storage_provider TEXT NOT NULL DEFAULT 'local', -- 'supabase' or 'local'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS across all tables
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Only published items visible publicly)
CREATE POLICY "Public read website_settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public read published services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published case_studies" ON public.case_studies FOR SELECT USING (is_published = true);
CREATE POLICY "Public read public skills" ON public.skills FOR SELECT USING (is_public = true);
CREATE POLICY "Public read published certifications" ON public.certifications FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published blog_posts" ON public.blog_posts FOR SELECT USING (is_published = true);

-- 2. Public Insert Policy for Contact Form (Rate-limited via server)
CREATE POLICY "Public insert contact_inbox" ON public.contact_inbox FOR INSERT WITH CHECK (true);

-- 3. Admin Access (Authenticated Users have full read/write access)
CREATE POLICY "Admin full access website_settings" ON public.website_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access case_studies" ON public.case_studies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access contact_inbox" ON public.contact_inbox FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access media_library" ON public.media_library FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_contact_inbox_created_at ON public.contact_inbox(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
