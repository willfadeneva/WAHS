-- Multi-year congress support

-- Congresses table — one row per year
CREATE TABLE congresses (
  year INT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  theme TEXT DEFAULT '',
  dates TEXT NOT NULL,
  venue TEXT NOT NULL,
  location TEXT NOT NULL,
  submission_deadline TEXT NOT NULL,
  early_bird_deadline TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  tracks JSONB DEFAULT '[]'::jsonb,
  pricing JSONB DEFAULT '[]'::jsonb,
  publications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE congresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read congresses" ON congresses FOR SELECT USING (true);
CREATE POLICY "Admins manage congresses" ON congresses FOR ALL USING (auth.role() = 'authenticated');

-- Add congress_year to submissions and speakers
ALTER TABLE submissions ADD COLUMN congress_year INT NOT NULL DEFAULT 2026;
ALTER TABLE speakers ADD COLUMN congress_year INT NOT NULL DEFAULT 2026;

-- Update existing speakers
UPDATE speakers SET congress_year = 2026;

-- Seed 2026 congress
INSERT INTO congresses (year, title, subtitle, theme, dates, venue, location, submission_deadline, early_bird_deadline, video_url, is_active, tracks, pricing, publications) VALUES (
  2026,
  'World Congress for Hallyu Studies 2026',
  'Cultural Dynamism in the Digital Age — Toward a Universal Theory of Pop Culture Globalization',
  '12th Congress',
  'May 28–30, 2026',
  'Cheju Halla University',
  'Jeju Island, South Korea',
  'April 15, 2026',
  'May 15, 2026',
  'https://www.youtube.com/embed/72-GBLfTxEQ?rel=0&modestbranding=1',
  true,
  '[
    {"number": "01", "title": "Cultural Dynamism", "subtitle": "Annual Theme", "topics": ["Platform capitalism","Digital circulation","Gender politics","Female universalism","Production systems","Business models","Fandom practices","Participatory culture","Postcolonial positioning","Transmedia storytelling","IP management","Comparative cases","Methodological innovations"]},
    {"number": "02", "title": "Open Topics", "subtitle": "Hallyu Studies", "topics": ["K-pop","K-drama","Film","Webtoons","Gaming","Regional reception","Language learning","Cultural policy","Soft power","Tourism","Place branding","Consumption practices","Authenticity","Cultural translation"]}
  ]'::jsonb,
  '[
    {"tier": "Regular", "amount": "$300", "early_bird": "$240", "features": ["Full conference access","All keynote sessions","Conference materials","Networking events"], "featured": false},
    {"tier": "Student", "amount": "$150", "early_bird": "$120", "features": ["Full conference access","All keynote sessions","Conference materials","Student networking"], "featured": true},
    {"tier": "WAHS Members", "amount": "Free", "early_bird": "Membership benefits", "features": ["Full conference access","All keynote sessions","Conference materials","Member events"], "featured": false}
  ]'::jsonb,
  '[
    {"badge": "A&HCI Indexed", "badge_class": "indexed", "title": "SOCIÉTÉS", "desc": "Special issue in this peer-reviewed, Arts & Humanities Citation Index journal."},
    {"badge": "Flagship Journal", "badge_class": "flagship", "title": "HALLYU", "desc": "Special issue in the WAHS flagship journal dedicated to Korean Wave scholarship."},
    {"badge": "Academic Press", "badge_class": "press", "title": "BRILL Volume", "desc": "Edited volume with Brill, a leading international academic publisher."},
    {"badge": "Open Access", "badge_class": "open", "title": "Congress Proceedings", "desc": "WAHS Congress Proceedings — open access publication for all accepted papers."}
  ]'::jsonb
);
