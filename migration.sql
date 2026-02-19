-- WAHS Registration & Membership Tables Migration
-- Run this in Supabase SQL Editor

-- Create enum types
CREATE TYPE membership_type AS ENUM ('professional', 'non_professional');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE registration_type AS ENUM ('regular', 'student');

-- Members table
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  affiliation text,
  country text,
  membership_type membership_type NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_date timestamptz,
  year int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

-- Registrations table
CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  affiliation text,
  country text,
  registration_type registration_type NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_date timestamptz,
  congress_year int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Members RLS policies
CREATE POLICY "Anyone can insert members" ON members
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can select members" ON members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can update members" ON members
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete members" ON members
  FOR DELETE TO authenticated USING (true);

-- Registrations RLS policies
CREATE POLICY "Anyone can insert registrations" ON registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can select registrations" ON registrations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can update registrations" ON registrations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete registrations" ON registrations
  FOR DELETE TO authenticated USING (true);

-- Allow anon to select registrations for email check (submissions gate)
CREATE POLICY "Anyone can check registration by email" ON registrations
  FOR SELECT TO anon USING (true);
