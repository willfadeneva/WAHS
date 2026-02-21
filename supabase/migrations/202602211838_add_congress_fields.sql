-- Add missing fields to congress_submitters table
-- Run this after the main auth_system.sql migration

-- Add country and bio fields to congress_submitters
ALTER TABLE congress_submitters 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update the check_profile function to require country
-- Note: This is application logic, not database constraint
-- The app should check that country is not empty before allowing abstract submission