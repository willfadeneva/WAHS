-- WAHS 2026 Congress Database Schema

-- Submission status enum
CREATE TYPE submission_status AS ENUM ('pending', 'accepted', 'rejected', 'revision');

-- Submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('individual_paper', 'full_panel', 'roundtable', 'workshop')),
  title TEXT NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('cultural_dynamism', 'open_topics')),
  abstract TEXT NOT NULL,
  keywords TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_affiliation TEXT NOT NULL,
  author_bio TEXT NOT NULL,
  co_authors JSONB DEFAULT '[]'::jsonb,
  special_requirements TEXT DEFAULT '',
  status submission_status DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Speakers table
CREATE TABLE speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Keynote',
  affiliation TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_plenary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (key-value)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can insert submissions
CREATE POLICY "Anyone can submit" ON submissions FOR INSERT WITH CHECK (true);

-- Public can read speakers
CREATE POLICY "Anyone can read speakers" ON speakers FOR SELECT USING (true);

-- Public can read settings
CREATE POLICY "Anyone can read settings" ON settings FOR SELECT USING (true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins manage submissions" ON submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage speakers" ON speakers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed speakers
INSERT INTO speakers (name, role, affiliation, sort_order) VALUES
  ('Henry Jenkins', 'Keynote', 'Provost Professor of Communication, Journalism, Cinematic Arts and Education — University of Southern California', 1),
  ('Jieun Kiaer', 'Keynote', 'Young Bin Min-KF Professor of Korean Linguistics — University of Oxford', 2),
  ('Roald Maliangkay', 'Keynote', 'Professor, School of Culture, History and Language — Australian National University', 3),
  ('Ingyu Oh', 'Keynote', 'Professor, Kansai Gaidai University & Ex-President, World Association for Hallyu Studies', 4),
  ('Rob Kutner', 'Panelist', '5-time Emmy Award Winner — Comedy writer-producer (The Daily Show, Conan, Teen Titans Go!)', 5),
  ('Marlene Sharp', 'Panelist', 'Producer — Sonic Boom, Z-Squad, Pink Poodle Productions', 6);

-- Seed settings
INSERT INTO settings (key, value) VALUES
  ('congress_dates', '"May 28–30, 2026"'),
  ('venue', '"Cheju Halla University"'),
  ('location', '"Jeju Island, South Korea"'),
  ('submission_deadline', '"April 15, 2026"');
