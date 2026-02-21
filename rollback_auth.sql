-- Rollback SQL for WAHS Authentication System
-- Run this if the migration causes issues

-- 1. Remove new tables (safe with CASCADE)
DROP TABLE IF EXISTS congress_submitters CASCADE;
DROP TABLE IF EXISTS wahs_members CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 2. Remove new columns from submissions table
ALTER TABLE submissions 
DROP COLUMN IF EXISTS submitter_id,
DROP COLUMN IF EXISTS file_url,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS withdrawn,
DROP COLUMN IF EXISTS last_edited;

-- 3. Drop triggers
DROP TRIGGER IF EXISTS update_congress_submitters_updated_at ON congress_submitters;
DROP TRIGGER IF EXISTS update_wahs_members_updated_at ON wahs_members;

-- 4. Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 5. Drop indexes
DROP INDEX IF EXISTS idx_congress_submitters_email;
DROP INDEX IF EXISTS idx_wahs_members_status;
DROP INDEX IF EXISTS idx_submissions_submitter_id;
DROP INDEX IF EXISTS idx_submissions_status;

-- 6. Remove RLS policies (they will be dropped with tables)
-- Note: RLS policies are automatically removed when tables are dropped

-- 7. Verify original state
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables after rollback:
-- congresses, submissions, speakers
-- (any other original tables)

-- 8. Check submissions table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'submissions'
ORDER BY ordinal_position;

-- 9. Restore from backup if needed
-- Use the backup file: supabase_backup/backup_20260221_015501.json
-- Or restore from Supabase dashboard backup