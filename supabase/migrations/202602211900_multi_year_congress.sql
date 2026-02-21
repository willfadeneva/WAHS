-- Multi-Year Congress Support
-- Add congress_year to submissions table and update structures

-- 1. Add congress_year column to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS congress_year INTEGER NOT NULL DEFAULT 2026;

-- Update existing submissions to have congress_year 2026
UPDATE submissions SET congress_year = 2026 WHERE congress_year IS NULL;

-- Create index for faster year-based queries
CREATE INDEX IF NOT EXISTS idx_submissions_congress_year ON submissions(congress_year);

-- 2. Update congress_submitters to track which years they've participated in
ALTER TABLE congress_submitters
ADD COLUMN IF NOT EXISTS first_congress_year INTEGER,
ADD COLUMN IF NOT EXISTS last_congress_year INTEGER;

-- Update existing submitters
UPDATE congress_submitters cs
SET 
  first_congress_year = (
    SELECT MIN(congress_year) 
    FROM submissions s 
    WHERE s.submitter_id = cs.id
  ),
  last_congress_year = (
    SELECT MAX(congress_year) 
    FROM submissions s 
    WHERE s.submitter_id = cs.id
  )
WHERE EXISTS (SELECT 1 FROM submissions s WHERE s.submitter_id = cs.id);

-- 3. Create a view for admin to see submissions by year
CREATE OR REPLACE VIEW submissions_by_year AS
SELECT 
  s.*,
  cs.full_name,
  cs.email,
  cs.affiliation,
  EXTRACT(YEAR FROM s.created_at) as submission_year
FROM submissions s
LEFT JOIN congress_submitters cs ON s.submitter_id = cs.id
ORDER BY s.congress_year DESC, s.created_at DESC;

-- 4. Update RLS policies to include congress_year
-- Note: Existing policies should still work, but we add year-specific if needed

-- 5. Create helper function to get user's submissions for a specific year
CREATE OR REPLACE FUNCTION get_user_submissions_for_year(
  user_id UUID,
  year INTEGER
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  abstract TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.abstract,
    s.status,
    s.created_at
  FROM submissions s
  WHERE s.submitter_id = user_id
    AND s.congress_year = year
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update email notifications to include congress year
-- The email notification API will handle this in application code

-- 7. Create a table for congress years metadata (optional, for future)
CREATE TABLE IF NOT EXISTS congress_years (
  year INTEGER PRIMARY KEY,
  theme TEXT,
  location TEXT,
  dates TEXT,
  call_opens DATE,
  abstract_deadline DATE,
  notification_date DATE,
  early_bird_deadline DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 2026 congress data
INSERT INTO congress_years (year, theme, location, dates, call_opens, abstract_deadline, notification_date, early_bird_deadline, is_active)
VALUES (
  2026,
  'Cultural Dynamism in the Digital Age: Toward a Universal Theory of Pop Culture Globalization',
  'Cheju Halla University, Jeju Island, South Korea',
  'May 28–30, 2026',
  '2026-01-15',
  '2026-04-15',
  '2026-04-30',
  '2026-05-15',
  true
) ON CONFLICT (year) DO UPDATE SET
  theme = EXCLUDED.theme,
  location = EXCLUDED.location,
  dates = EXCLUDED.dates,
  call_opens = EXCLUDED.call_opens,
  abstract_deadline = EXCLUDED.abstract_deadline,
  notification_date = EXCLUDED.notification_date,
  early_bird_deadline = EXCLUDED.early_bird_deadline,
  is_active = EXCLUDED.is_active;

-- 8. Update admin dashboard queries to filter by year
-- This will be handled in the application code

COMMENT ON TABLE submissions IS 'Congress abstract submissions with year support';
COMMENT ON COLUMN submissions.congress_year IS 'The congress year this submission is for (e.g., 2026, 2027)';
COMMENT ON TABLE congress_years IS 'Metadata for each congress year';