-- FULL MIGRATION FOR WAHS + CONGRESS 2026 SYSTEM
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. AUTH SYSTEM TABLES
-- ============================================

-- Congress submitters table (shared across all congress years)
CREATE TABLE IF NOT EXISTS congress_submitters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  country TEXT NOT NULL,
  bio TEXT,
  first_congress_year INTEGER,
  last_congress_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on congress_submitters
ALTER TABLE congress_submitters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for congress_submitters
CREATE POLICY "Users can view own congress submitter profile" 
ON congress_submitters FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own congress submitter profile" 
ON congress_submitters FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own congress submitter profile" 
ON congress_submitters FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all congress submitters" 
ON congress_submitters FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- WAHS members table
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
  payment_id TEXT,
  payment_status TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on wahs_members
ALTER TABLE wahs_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wahs_members
CREATE POLICY "Users can view own WAHS member profile" 
ON wahs_members FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own WAHS member profile" 
ON wahs_members FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own WAHS member profile" 
ON wahs_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all WAHS members" 
ON wahs_members FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users (only admins can view admin list)
CREATE POLICY "Admins can view admin users" 
ON admin_users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.user_id = auth.uid()
  )
);

-- ============================================
-- 2. SUBMISSIONS TABLE (with multi-year support)
-- ============================================

-- Submissions table (year-specific submissions)
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
  reviewer_notes TEXT,
  decision_date TIMESTAMP WITH TIME ZONE,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions
CREATE POLICY "Users can view own submissions" 
ON submissions FOR SELECT 
USING (
  submitter_id IN (
    SELECT id FROM congress_submitters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own submissions" 
ON submissions FOR INSERT 
WITH CHECK (
  submitter_id IN (
    SELECT id FROM congress_submitters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own submissions" 
ON submissions FOR UPDATE 
USING (
  submitter_id IN (
    SELECT id FROM congress_submitters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all submissions" 
ON submissions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- ============================================
-- 3. CONGRESS REGISTRATIONS TABLE
-- ============================================

-- Congress registrations table (event registration, separate from abstract submission)
CREATE TABLE IF NOT EXISTS congress_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  country TEXT NOT NULL,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('regular', 'student', 'wahs_member', 'virtual')),
  congress_year INTEGER NOT NULL DEFAULT 2026,
  payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on congress_registrations
ALTER TABLE congress_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for congress_registrations
CREATE POLICY "Users can view own congress registrations" 
ON congress_registrations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own congress registrations" 
ON congress_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all congress registrations" 
ON congress_registrations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- ============================================
-- 4. MAGIC LINK SYSTEM TABLES
-- ============================================

-- Magic link tokens table (for custom email service)
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('congress', 'wahs', 'admin')),
  congress_year TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  template_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================

-- Congress submitters indexes
CREATE INDEX IF NOT EXISTS idx_congress_submitters_user_id ON congress_submitters(user_id);
CREATE INDEX IF NOT EXISTS idx_congress_submitters_email ON congress_submitters(email);

-- WAHS members indexes
CREATE INDEX IF NOT EXISTS idx_wahs_members_user_id ON wahs_members(user_id);
CREATE INDEX IF NOT EXISTS idx_wahs_members_email ON wahs_members(email);
CREATE INDEX IF NOT EXISTS idx_wahs_members_status ON wahs_members(membership_status);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS idx_submissions_submitter_id ON submissions(submitter_id);
CREATE INDEX IF NOT EXISTS idx_submissions_congress_year ON submissions(congress_year);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);

-- Congress registrations indexes
CREATE INDEX IF NOT EXISTS idx_congress_regs_user_id ON congress_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_congress_regs_email ON congress_registrations(email);
CREATE INDEX IF NOT EXISTS idx_congress_regs_payment_status ON congress_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_congress_regs_registration_date ON congress_registrations(registration_date);

-- Magic link tokens indexes
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_email ON magic_link_tokens(email);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_expires ON magic_link_tokens(expires_at);

-- ============================================
-- 6. HELPER FUNCTIONS AND VIEWS
-- ============================================

-- Function to get user's submissions for a specific year
CREATE OR REPLACE FUNCTION get_user_submissions_for_year(
  p_user_id UUID,
  p_congress_year INTEGER
)
RETURNS TABLE (
  submission_id UUID,
  title TEXT,
  status TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  congress_year INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as submission_id,
    s.title,
    s.status,
    s.created_at as submitted_at,
    s.congress_year
  FROM submissions s
  JOIN congress_submitters cs ON s.submitter_id = cs.id
  WHERE cs.user_id = p_user_id
    AND s.congress_year = p_congress_year
  ORDER BY s.created_at DESC;
END;
$$;

-- View for admin to see submissions by year
CREATE OR REPLACE VIEW submissions_by_year AS
SELECT 
  s.*,
  cs.full_name,
  cs.email,
  cs.affiliation,
  cs.country,
  EXTRACT(YEAR FROM s.created_at) as submission_year
FROM submissions s
LEFT JOIN congress_submitters cs ON s.submitter_id = cs.id
ORDER BY s.congress_year DESC, s.created_at DESC;

-- View for admin dashboard summary
CREATE OR REPLACE VIEW admin_dashboard_summary AS
SELECT 
  'congress_submissions' as category,
  congress_year,
  status,
  COUNT(*) as count
FROM submissions
GROUP BY congress_year, status

UNION ALL

SELECT 
  'wahs_members' as category,
  NULL as congress_year,
  membership_status as status,
  COUNT(*) as count
FROM wahs_members
GROUP BY membership_status

UNION ALL

SELECT 
  'congress_registrations' as category,
  congress_year,
  payment_status as status,
  COUNT(*) as count
FROM congress_registrations
GROUP BY congress_year, payment_status;

-- ============================================
-- 7. TRIGGERS FOR AUTO-UPDATED TIMESTAMPS
-- ============================================

-- Trigger for congress_submitters updated_at
CREATE OR REPLACE FUNCTION update_congress_submitters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER congress_submitters_updated_at_trigger
BEFORE UPDATE ON congress_submitters
FOR EACH ROW
EXECUTE FUNCTION update_congress_submitters_updated_at();

-- Trigger for wahs_members updated_at
CREATE OR REPLACE FUNCTION update_wahs_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wahs_members_updated_at_trigger
BEFORE UPDATE ON wahs_members
FOR EACH ROW
EXECUTE FUNCTION update_wahs_members_updated_at();

-- Trigger for congress_registrations updated_at
CREATE OR REPLACE FUNCTION update_congress_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER congress_registrations_updated_at_trigger
BEFORE UPDATE ON congress_registrations
FOR EACH ROW
EXECUTE FUNCTION update_congress_registrations_updated_at();

-- Trigger for submissions last_edited
CREATE OR REPLACE FUNCTION update_submissions_last_edited()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_edited = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER submissions_last_edited_trigger
BEFORE UPDATE ON submissions
FOR EACH ROW
EXECUTE FUNCTION update_submissions_last_edited();

-- ============================================
-- 8. INITIAL DATA (OPTIONAL)
-- ============================================

-- Insert admin users (run after creating auth.users)
-- Note: Replace the user_id values with actual auth.users IDs
/*
INSERT INTO admin_users (user_id, role) VALUES
  ((SELECT id FROM auth.users WHERE email = 'oingyu@gmail.com'), 'admin'),
  ((SELECT id FROM auth.users WHERE email = 'charanjotsingh@gmail.com'), 'admin')
ON CONFLICT (user_id) DO NOTHING;
*/

-- ============================================
-- 9. CLEANUP FUNCTION FOR EXPIRED TOKENS
-- ============================================

-- Function to clean up expired magic link tokens
CREATE OR REPLACE FUNCTION cleanup_expired_magic_link_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM magic_link_tokens
  WHERE expires_at < NOW()
     OR (used = true AND used_at < NOW() - INTERVAL '7 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Output success message
DO $$
BEGIN
  RAISE NOTICE '✅ WAHS + Congress 2026 database migration completed successfully!';
  RAISE NOTICE '✅ Tables created: congress_submitters, wahs_members, admin_users, submissions, congress_registrations, magic_link_tokens, email_logs';
  RAISE NOTICE '✅ RLS policies enabled for security';
  RAISE NOTICE '✅ Indexes created for performance';
  RAISE NOTICE '✅ Views created: submissions_by_year, admin_dashboard_summary';
  RAISE NOTICE '✅ Triggers created for auto-updated timestamps';
  RAISE NOTICE '✅ Helper functions created';
  RAISE NOTICE '';
  RAISE NOTICE '📋 NEXT STEPS:';
  RAISE NOTICE '1. Configure Supabase Auth → Site URL: https://congress.iwahs.org';
  RAISE NOTICE '2. Add redirect URLs for magic links and dashboards';
  RAISE NOTICE '3. Update Vercel environment variables with real Supabase keys';
  RAISE NOTICE '4. Insert admin users (see commented section above)';
  RAISE NOTICE '5. Test the system!';
END $$;