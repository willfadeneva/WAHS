-- ============================================================
-- WAHS FRESH SCHEMA — drop everything, rebuild clean
-- ============================================================

-- Drop existing tables
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS speakers CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS congresses CASCADE;
DROP TABLE IF EXISTS wahs_members CASCADE;
DROP TABLE IF EXISTS congress_registrations CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TYPE IF EXISTS submission_status CASCADE;
DROP TYPE IF EXISTS membership_type CASCADE;
DROP TYPE IF EXISTS membership_status CASCADE;

-- ── ENUMS ────────────────────────────────────────────────────────────
CREATE TYPE submission_status AS ENUM ('pending', 'under_review', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE membership_type AS ENUM ('professional', 'student');
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'expired');

-- ── WAHS MEMBERS ─────────────────────────────────────────────────────
CREATE TABLE wahs_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  institution TEXT DEFAULT '',
  country TEXT DEFAULT '',
  membership_type membership_type NOT NULL,
  membership_status membership_status DEFAULT 'pending',
  paypal_transaction_id TEXT DEFAULT '',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONGRESSES ───────────────────────────────────────────────────────
CREATE TABLE congresses (
  year INT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  theme TEXT DEFAULT '',
  dates TEXT NOT NULL,
  venue TEXT NOT NULL,
  location TEXT NOT NULL,
  submission_deadline TEXT NOT NULL,
  early_bird_deadline DATE NOT NULL DEFAULT '2026-05-15',
  video_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  tracks JSONB DEFAULT '[]'::jsonb,
  pricing JSONB DEFAULT '[]'::jsonb,
  publications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONGRESS REGISTRATIONS (event attendance tickets) ────────────────
CREATE TABLE congress_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  congress_year INT REFERENCES congresses(year) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  institution TEXT DEFAULT '',
  country TEXT DEFAULT '',
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('regular', 'student', 'wahs_member')),
  amount_paid NUMERIC(10,2) DEFAULT 0,
  paypal_transaction_id TEXT DEFAULT '',
  is_wahs_member BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SPEAKERS ─────────────────────────────────────────────────────────
CREATE TABLE speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  congress_year INT REFERENCES congresses(year) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Keynote',
  affiliation TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_plenary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUBMISSIONS ───────────────────────────────────────────────────────
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  congress_year INT REFERENCES congresses(year) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_email TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_institution TEXT DEFAULT '',
  author_bio TEXT DEFAULT '',
  title TEXT NOT NULL,
  abstract TEXT NOT NULL CHECK (char_length(abstract) >= 200),
  keywords TEXT NOT NULL,
  presentation_type TEXT NOT NULL CHECK (presentation_type IN ('individual_paper', 'full_panel', 'roundtable', 'workshop')),
  track TEXT NOT NULL,
  co_authors JSONB DEFAULT '[]'::jsonb,
  special_requirements TEXT DEFAULT '',
  pdf_url TEXT DEFAULT '',
  status submission_status DEFAULT 'pending',
  reviewer_notes TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  withdrawn_at TIMESTAMPTZ
);

-- ── ADMIN USERS ──────────────────────────────────────────────────────
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────
ALTER TABLE wahs_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE congresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE congress_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- WAHS Members: users can read/update their own record
CREATE POLICY "Member reads own record" ON wahs_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Member updates own record" ON wahs_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role full access wahs_members" ON wahs_members FOR ALL USING (auth.role() = 'service_role');

-- Congresses: public read
CREATE POLICY "Anyone reads congresses" ON congresses FOR SELECT USING (true);
CREATE POLICY "Service role manages congresses" ON congresses FOR ALL USING (auth.role() = 'service_role');

-- Registrations: user sees own, service role sees all
CREATE POLICY "User reads own registrations" ON congress_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert registration" ON congress_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access registrations" ON congress_registrations FOR ALL USING (auth.role() = 'service_role');

-- Speakers: public read
CREATE POLICY "Anyone reads speakers" ON speakers FOR SELECT USING (true);
CREATE POLICY "Service role manages speakers" ON speakers FOR ALL USING (auth.role() = 'service_role');

-- Submissions: user sees/edits own
CREATE POLICY "User reads own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User inserts own submission" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User updates own submission" ON submissions FOR UPDATE USING (auth.uid() = user_id AND status NOT IN ('withdrawn'));
CREATE POLICY "Service role full access submissions" ON submissions FOR ALL USING (auth.role() = 'service_role');

-- Admin: service role only
CREATE POLICY "Service role manages admin_users" ON admin_users FOR ALL USING (auth.role() = 'service_role');

-- ── SEED DATA ─────────────────────────────────────────────────────────

-- 2026 Congress
INSERT INTO congresses (year, title, subtitle, theme, dates, venue, location, submission_deadline, early_bird_deadline, video_url, is_active, tracks, pricing, publications) VALUES (
  2026,
  'World Congress for Hallyu Studies 2026',
  'Cultural Dynamism in the Digital Age — Toward a Universal Theory of Pop Culture Globalization',
  '12th Congress',
  'May 28–30, 2026',
  'Cheju Halla University',
  'Jeju Island, South Korea',
  'April 15, 2026',
  '2026-05-15',
  'https://www.youtube.com/embed/72-GBLfTxEQ?rel=0&modestbranding=1',
  true,
  '[
    {"number": "01", "title": "Cultural Dynamism", "subtitle": "Annual Theme", "topics": ["Platform capitalism","Digital circulation","Gender politics","Female universalism","Production systems","Business models","Fandom practices","Participatory culture","Postcolonial positioning","Transmedia storytelling","IP management","Comparative cases","Methodological innovations"]},
    {"number": "02", "title": "Open Topics", "subtitle": "Hallyu Studies", "topics": ["K-pop","K-drama","Film","Webtoons","Gaming","Regional reception","Language learning","Cultural policy","Soft power","Tourism","Place branding","Consumption practices","Authenticity","Cultural translation"]}
  ]'::jsonb,
  '[
    {"tier": "Regular", "amount": "$300", "early_bird": "$240", "features": ["Full conference access","All keynote sessions","Conference materials","Networking events"]},
    {"tier": "Student", "amount": "$150", "early_bird": "$120", "features": ["Full conference access","All keynote sessions","Conference materials","Student networking"]},
    {"tier": "WAHS Members", "amount": "Free", "early_bird": "Free", "features": ["Full conference access","All keynote sessions","Conference materials","Member events"]}
  ]'::jsonb,
  '[
    {"badge": "A&HCI Indexed", "title": "SOCIÉTÉS", "desc": "Special issue in this peer-reviewed, Arts & Humanities Citation Index journal."},
    {"badge": "Flagship Journal", "title": "HALLYU", "desc": "Special issue in the WAHS flagship journal dedicated to Korean Wave scholarship."},
    {"badge": "Academic Press", "title": "BRILL Volume", "desc": "Edited volume with Brill, a leading international academic publisher."},
    {"badge": "Open Access", "title": "Congress Proceedings", "desc": "WAHS Congress Proceedings — open access publication for all accepted papers."}
  ]'::jsonb
);

-- Speakers
INSERT INTO speakers (congress_year, name, role, affiliation, sort_order, is_plenary) VALUES
  (2026, 'Henry Jenkins', 'Keynote', 'Provost Professor of Communication, Journalism, Cinematic Arts and Education — University of Southern California', 1, false),
  (2026, 'Jieun Kiaer', 'Keynote', 'Young Bin Min-KF Professor of Korean Linguistics — University of Oxford', 2, false),
  (2026, 'Roald Maliangkay', 'Keynote', 'Professor, School of Culture, History and Language — Australian National University', 3, false),
  (2026, 'Ingyu Oh', 'Keynote', 'Professor, Kansai Gaidai University & Ex-President, World Association for Hallyu Studies', 4, false),
  (2026, 'Rob Kutner', 'Panelist', '5-time Emmy Award Winner — Comedy writer-producer (The Daily Show, Conan, Teen Titans Go!)', 5, true),
  (2026, 'Marlene Sharp', 'Panelist', 'Producer — Sonic Boom, Z-Squad, Pink Poodle Productions', 6, true);

-- Admin users (pre-seed emails; user_id linked when they first login via magic link)
INSERT INTO admin_users (email) VALUES
  ('oingyu@gmail.com'),
  ('charanjotsingh@gmail.com')
ON CONFLICT (email) DO NOTHING;
