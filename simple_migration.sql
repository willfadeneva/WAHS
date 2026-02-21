-- SIMPLE MIGRATION FOR WAHS + CONGRESS 2026
-- Copy and paste this entire file into Supabase SQL Editor

-- 1. Congress submitters (shared across years)
CREATE TABLE IF NOT EXISTS congress_submitters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  country TEXT NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE congress_submitters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own congress profile" 
ON congress_submitters FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all congress profiles" 
ON congress_submitters FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 2. WAHS members
CREATE TABLE IF NOT EXISTS wahs_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  country TEXT NOT NULL,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('free', 'professional', 'non-professional')),
  membership_status TEXT NOT NULL DEFAULT 'pending' CHECK (membership_status IN ('pending', 'approved', 'expired', 'rejected')),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE wahs_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own WAHS profile" 
ON wahs_members FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all WAHS members" 
ON wahs_members FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 3. Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin users" 
ON admin_users FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 4. Submissions (with congress_year for multi-year support)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id UUID REFERENCES congress_submitters(id) ON DELETE CASCADE,
  author_email TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_affiliation TEXT,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT,
  presentation_type TEXT NOT NULL CHECK (presentation_type IN ('oral', 'poster', 'workshop')),
  track TEXT NOT NULL CHECK (track IN ('general', 'kpop', 'media', 'culture', 'language', 'business', 'education')),
  congress_year INTEGER NOT NULL DEFAULT 2026,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own submissions" 
ON submissions FOR ALL 
USING (submitter_id IN (SELECT id FROM congress_submitters WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all submissions" 
ON submissions FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 5. Congress registrations (event registration)
CREATE TABLE IF NOT EXISTS congress_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  country TEXT NOT NULL,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('regular', 'student', 'wahs_member', 'virtual')),
  congress_year INTEGER NOT NULL DEFAULT 2026,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE congress_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own registrations" 
ON congress_registrations FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all registrations" 
ON congress_registrations FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 6. Magic link tokens (for email authentication)
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('congress', 'wahs', 'admin')),
  congress_year TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create indexes
CREATE INDEX IF NOT EXISTS idx_congress_submitters_email ON congress_submitters(email);
CREATE INDEX IF NOT EXISTS idx_wahs_members_email ON wahs_members(email);
CREATE INDEX IF NOT EXISTS idx_submissions_congress_year ON submissions(congress_year);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_expires ON magic_link_tokens(expires_at);

-- 8. Insert admin users (AFTER creating auth.users accounts)
-- Uncomment and run after creating user accounts in Supabase Auth
/*
INSERT INTO admin_users (user_id, role) VALUES
  ((SELECT id FROM auth.users WHERE email = 'oingyu@gmail.com'), 'admin'),
  ((SELECT id FROM auth.users WHERE email = 'charanjotsingh@gmail.com'), 'admin')
ON CONFLICT (user_id) DO NOTHING;
*/

-- 9. Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables created:';
  RAISE NOTICE '  • congress_submitters (shared profiles)';
  RAISE NOTICE '  • wahs_members (WAHS membership)';
  RAISE NOTICE '  • admin_users (admin access)';
  RAISE NOTICE '  • submissions (abstracts with congress_year)';
  RAISE NOTICE '  • congress_registrations (event tickets)';
  RAISE NOTICE '  • magic_link_tokens (email auth)';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 RLS policies enabled for security';
  RAISE NOTICE '⚡ Indexes created for performance';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 System ready for Congress 2026 + multi-year support!';
END $$;