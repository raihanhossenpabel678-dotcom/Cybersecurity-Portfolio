# MD. RAIHAN HOSSEN RAJIB — CYBERSECURITY PORTFOLIO & CMS

A high-performance personal cybersecurity portfolio website and private administration platform for **MD. RAIHAN HOSSEN RAJIB**.

## 1. Professional Overview
- **Name**: MD. RAIHAN HOSSEN RAJIB
- **Specialization**:
  - WordPress Malware Removal & Recovery
  - WordPress Security Hardening
  - WordPress Bug Fixing & Incident Triage
  - Ethical OSINT & Digital Footprint Research
  - Pre-Bug-Bounty Security Assessment & Readiness
  - Authorized Web Application Penetration Testing
  - Python & Django Secure Development
- **Verified Credentials**:
  - One-year Diploma in Cyber Security and Ethical Hacking from Arena Web Security.
  - Professional Python with Django Development Training.

---

## 2. Architecture & Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Marked (for Markdown rendering).
- **Design System**: Bespoke Black-and-Purple Palette (`#08080D` canvas, `#101019` surface, `#15111F` card, `#7C3AED` primary, `#8B5CF6` violet, `#C084FC` light purple) with zero-pill metadata discipline and circular gradient avatar frame with subtle violet outer glow.
- **Backend**: Node.js & Express server with TypeScript (`tsx`), rate limiting, secure HTTP security headers (`nosniff`, `SAMEORIGIN`, `strict-origin`), file upload MIME type validation, and Zod validation.
- **Database Engine**:
  - **Out-of-the-Box Engine**: Persistent atomic JSON-backed storage at `/data/db.json` ensuring full functionality across local runs and server restarts with zero external setup required.
  - **Supabase Integration**: Seamless connection to Supabase PostgreSQL and Supabase Storage via `@supabase/supabase-js` when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` are configured.
  - **Migration File**: Located at `/supabase/migrations/20261026000000_cybersecurity_portfolio_schema.sql` complete with Row Level Security (RLS) policies, indexes, and triggers.

---

## 3. Administrator Credentials
- **Admin Portal URL**: `/admin`
- **Default Email**: `raihanhossenpabel678@gmail.com`
- **Default Password**: `RajibSecure2026!` *(Changeable via `ADMIN_PASSWORD` in `.env`)*

---

## 4. Local Setup Instructions

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 5. Supabase Setup Instructions (PostgreSQL & Storage)

1. Create a free account at [Supabase](https://supabase.com) and create a new project.
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Open `/supabase/migrations/20261026000000_cybersecurity_portfolio_schema.sql` from this repository and run the entire SQL script.
4. Copy your **Project URL** and **Service Role API Key** from **Project Settings > API**.
5. Add the keys to your `.env` file or hosting environment:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## 6. Vercel Deployment Instructions

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of MD. Raihan Hossen Rajib Portfolio"
   git remote add origin https://github.com/your-username/raihan-cyber-portfolio.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to Vite / Other.
5. In **Environment Variables**, add:
   - `ADMIN_EMAIL`: `raihanhossenpabel678@gmail.com`
   - `ADMIN_PASSWORD`: `<your-secure-password>`
   - `JWT_SECRET`: `<random-long-string>`
   - `SUPABASE_URL`: `<your-supabase-url>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your-service-key>`
6. Deploy!

---

## 7. How to Manage Content via the Admin Dashboard

Access the private dashboard at `/admin` and authenticate with your credentials:

1. **Website Settings**:
   - Update your site name, hero headline, description, about text, Fiverr link, and social URLs.
   - Upload your profile photograph to display inside the circular gradient frame with subtle violet outer glow.
   - Toggle visibility of sections on the homepage.
2. **Project Manager**:
   - Create new security projects, add challenge descriptions, applied methodologies, and verified remediation results.
   - Toggle draft/published states and star items to feature them on the homepage.
3. **Case Study Manager**:
   - Distinguish between **Authorized Client Engagements** and **Laboratory Simulations**.
   - Set severity ratings (Critical, High, Medium, Low), input sanitized proof-of-concept evidence, and record verification outcomes.
4. **Services Manager**:
   - Manage your 7 core service offerings, edit line-by-line deliverables, and update inquiry routing.
5. **Skills & Tools**:
   - Add new competencies, adjust proficiency percentages, and organize by category.
6. **Certifications**:
   - Manage verified credentials (Arena Web Security Diploma, Python with Django).
7. **Blog CMS**:
   - Write new threat research articles using full Markdown formatting (headings, code blocks, lists).
8. **Media Library**:
   - Upload new image assets (JPEG, PNG, WEBP, SVG) or PDF reports up to 5MB with automatic MIME validation.
   - Copy asset URLs directly with one click.
9. **Contact Inbox**:
   - View customer inquiries submitted through the encrypted form.
   - Mark messages as read/unread, archive completed threads, or click "Reply via Email" to compose an email response.
10. **Audit Trail**:
    - Review all administrative logins, content mutations, and updates in real time.
