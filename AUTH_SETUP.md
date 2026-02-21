# WAHS & Congress 2026 Authentication System

## **Setup Instructions**

### **1. Database Setup (Supabase)**
Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Congress Submitters table
CREATE TABLE IF NOT EXISTS congress_submitters (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. WAHS Members table
CREATE TABLE IF NOT EXISTS wahs_members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_type TEXT NOT NULL DEFAULT 'free',
  membership_status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  membership_expiry DATE,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update existing submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS submitter_id UUID REFERENCES congress_submitters(id),
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted',
ADD COLUMN IF NOT EXISTS withdrawn BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE congress_submitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE wahs_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Congress Submitters policies
CREATE POLICY "Users can view own congress submitter profile" 
ON congress_submitters FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own congress submitter profile" 
ON congress_submitters FOR UPDATE 
USING (auth.uid() = id);

-- WAHS Members policies
CREATE POLICY "Users can view own WAHS member profile" 
ON wahs_members FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own WAHS member profile" 
ON wahs_members FOR UPDATE 
USING (auth.uid() = id);

-- Admin Users policies
CREATE POLICY "Only admins can view admin users" 
ON admin_users FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Submissions policies
CREATE POLICY "Users can view own submissions" 
ON submissions FOR SELECT 
USING (submitter_id = auth.uid() OR submitter_id IS NULL);

CREATE POLICY "Users can insert own submissions" 
ON submissions FOR INSERT 
WITH CHECK (submitter_id = auth.uid());

CREATE POLICY "Users can update own submissions" 
ON submissions FOR UPDATE 
USING (submitter_id = auth.uid());

-- 6. Create storage buckets
-- Go to Supabase Storage and create these buckets:
-- - 'abstracts' for congress submission files
-- - 'member-photos' for WAHS member photos
-- Set RLS policies to allow authenticated users to upload
```

### **2. Supabase Authentication Setup**
1. Go to **Authentication → Settings** in Supabase dashboard
2. Enable **Email Auth**
3. Configure **Site URL**: `http://localhost:3000` (for development)
4. Configure **Redirect URLs**: Add `http://localhost:3000/auth/callback`
5. Enable **Magic Link** authentication

### **3. Storage Setup**
1. Go to **Storage** in Supabase dashboard
2. Create bucket: `abstracts`
   - Set to **Public**
   - Add RLS policy: Allow authenticated users to upload
3. Create bucket: `member-photos`
   - Set to **Public**
   - Add RLS policy: Allow authenticated users to upload

### **4. Create Admin User**
1. Register as a normal user through `/wahs/register`
2. Note the user ID from Supabase Auth users table
3. Run this SQL to make them an admin:
```sql
INSERT INTO admin_users (user_id, role) 
VALUES ('user-id-here', 'admin');
```

### **5. Update Submission Page**
Replace the current submission page with the authenticated version:
1. Rename `/src/app/[year]/submissions/page.tsx` to `submissions-old.tsx`
2. Copy `/src/app/[year]/submissions-auth/page.tsx` to `submissions/page.tsx`
3. Update the form component import to use `SubmissionFormAuth`

### **6. Navigation Links**
Add these links to your website navigation:

```html
<!-- For Congress submitters -->
<a href="/congress/login">Congress Login</a>
<a href="/congress/register">Submit Abstract</a>

<!-- For WAHS members -->
<a href="/wahs/login">Member Login</a>
<a href="/wahs/register">Join WAHS</a>

<!-- For admins -->
<a href="/admin">Admin Dashboard</a>
```

## **Pages Available**

### **Congress 2026 System:**
- `/congress/register` - Create submission account
- `/congress/login` - Login to submission account
- `/congress/dashboard` - View/manage submissions
- `/2026/submissions` - Submit abstract (authenticated)

### **WAHS Member System:**
- `/wahs/register` - Apply for membership
- `/wahs/login` - Member login
- `/wahs/dashboard` - Member dashboard

### **Admin System:**
- `/admin` - Admin dashboard (approve members, review submissions)

### **Auth Callback:**
- `/auth/callback` - Magic link callback (auto-handled)

## **Testing**

### **Test User Flows:**
1. **Congress Submitter:**
   - Register at `/congress/register`
   - Check email for magic link
   - Login and go to dashboard
   - Submit abstract at `/2026/submissions`

2. **WAHS Member:**
   - Register at `/wahs/register`
   - Check email for magic link
   - Login and complete profile
   - Wait for admin approval

3. **Admin:**
   - Login as admin user
   - Go to `/admin`
   - Approve WAHS members
   - Review congress submissions

## **Development Notes**

### **Built with:**
- Next.js 14 (App Router)
- Supabase (Auth, Database, Storage)
- Tailwind CSS
- TypeScript

### **Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Running Locally:**
```bash
npm install
npm run dev
```

## **Deployment**

### **Vercel:**
1. Push to GitHub
2. Connect Vercel project
3. Add environment variables
4. Deploy

### **Important:**
- Update **Site URL** in Supabase Auth settings to your production domain
- Update **Redirect URLs** in Supabase Auth settings
- Test all flows before going live

## **Support**

For issues:
1. Check Supabase logs
2. Check browser console
3. Email: wahskorea@gmail.com

---

**System Status:** ✅ Ready for testing  
**Cost:** $0 (Supabase Free Tier + Vercel Free)  
**Development Time:** 4 hours