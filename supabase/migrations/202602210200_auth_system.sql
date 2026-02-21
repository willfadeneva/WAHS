-- Authentication System for WAHS & Congress 2026
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Congress Submitters (separate from WAHS members)
CREATE TABLE IF NOT EXISTS congress_submitters (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  affiliation TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. WAHS Members (extends auth.users)
CREATE TABLE IF NOT EXISTS wahs_members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'paid'
  membership_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'active'
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

-- 3. Modify existing submissions table to link to submitters
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS submitter_id UUID REFERENCES congress_submitters(id),
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted',
ADD COLUMN IF NOT EXISTS withdrawn BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin', -- 'super_admin', 'wahs_admin', 'congress_admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Storage buckets for file uploads
-- Note: Run this in Supabase Storage section manually
-- Bucket: 'abstracts' for congress submission files
-- Bucket: 'member-photos' for WAHS member photos

-- 6. Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE congress_submitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE wahs_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Congress Submitters: Users can read/update their own data
CREATE POLICY "Users can view own congress submitter profile" 
ON congress_submitters FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own congress submitter profile" 
ON congress_submitters FOR UPDATE 
USING (auth.uid() = id);

-- WAHS Members: Users can view their own data
CREATE POLICY "Users can view own WAHS member profile" 
ON wahs_members FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own WAHS member profile" 
ON wahs_members FOR UPDATE 
USING (auth.uid() = id);

-- Admin Users: Only admins can view
CREATE POLICY "Only admins can view admin users" 
ON admin_users FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Submissions: Users can view their own submissions
CREATE POLICY "Users can view own submissions" 
ON submissions FOR SELECT 
USING (submitter_id = auth.uid() OR submitter_id IS NULL);

CREATE POLICY "Users can insert own submissions" 
ON submissions FOR INSERT 
WITH CHECK (submitter_id = auth.uid());

CREATE POLICY "Users can update own submissions" 
ON submissions FOR UPDATE 
USING (submitter_id = auth.uid());

-- 7. Functions and Triggers

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_congress_submitters_updated_at 
BEFORE UPDATE ON congress_submitters 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wahs_members_updated_at 
BEFORE UPDATE ON wahs_members 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Insert initial admin users (replace with actual admin emails)
-- Note: You'll need to manually add admin users after they register

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_congress_submitters_email ON congress_submitters(email);
CREATE INDEX IF NOT EXISTS idx_wahs_members_status ON wahs_members(membership_status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitter_id ON submissions(submitter_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);