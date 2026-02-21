-- WAHS Authentication System Migration
-- Run this in Supabase SQL Editor

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Congress Submitters table
CREATE TABLE IF NOT EXISTS congress_submitters (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. WAHS Members table
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

-- 4. Update existing submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS submitter_id UUID REFERENCES congress_submitters(id),
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted',
ADD COLUMN IF NOT EXISTS withdrawn BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Magic link tokens table (for custom email service)
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('congress', 'wahs')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent',
  provider TEXT,
  provider_id TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable Row Level Security
ALTER TABLE congress_submitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE wahs_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 9. Congress Submitters policies
CREATE POLICY "Users can view own congress submitter profile" 
ON congress_submitters FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own congress submitter profile" 
ON congress_submitters FOR UPDATE 
USING (auth.uid() = id);

-- 10. WAHS Members policies
CREATE POLICY "Users can view own WAHS member profile" 
ON wahs_members FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own WAHS member profile" 
ON wahs_members FOR UPDATE 
USING (auth.uid() = id);

-- 11. Admin Users policy
CREATE POLICY "Only admins can view admin users" 
ON admin_users FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 12. Submissions policies
CREATE POLICY "Users can view own submissions" 
ON submissions FOR SELECT 
USING (submitter_id = auth.uid() OR submitter_id IS NULL);

CREATE POLICY "Users can insert own submissions" 
ON submissions FOR INSERT 
WITH CHECK (submitter_id = auth.uid());

CREATE POLICY "Users can update own submissions" 
ON submissions FOR UPDATE 
USING (submitter_id = auth.uid());

-- 13. Create indexes
CREATE INDEX IF NOT EXISTS idx_congress_submitters_email ON congress_submitters(email);
CREATE INDEX IF NOT EXISTS idx_wahs_members_status ON wahs_members(membership_status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitter_id ON submissions(submitter_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_email ON magic_link_tokens(email);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_expires ON magic_link_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- 14. Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 15. Create triggers
CREATE TRIGGER update_congress_submitters_updated_at 
BEFORE UPDATE ON congress_submitters 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wahs_members_updated_at 
BEFORE UPDATE ON wahs_members 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT '✅ Migration completed successfully!' as message;