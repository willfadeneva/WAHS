import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import Overview from '@/components/Overview';
import Speakers from '@/components/Speakers';
import Tracks from '@/components/Tracks';
import Submissions from '@/components/Submissions';
import Timeline from '@/components/Timeline';
import Venue from '@/components/Venue';
import Registration from '@/components/Registration';
import Publications from '@/components/Publications';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

type Congress = {
  year: number;
  title: string;
  subtitle: string;
  theme: string;
  dates: string;
  venue: string;
  location: string;
  submission_deadline: string;
  early_bird_deadline: string;
  video_url: string;
  is_active: boolean;
  is_archived: boolean;
  tracks: { number: string; title: string; subtitle: string; topics: string[] }[];
  pricing: { tier: string; amount: string; early_bird: string; features: string[]; featured: boolean }[];
  publications: { badge: string; badge_class: string; title: string; desc: string }[];
};

type Speaker = {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  image_url: string;
  bio: string;
  sort_order: number;
  is_plenary: boolean;
};

async function getCongress(year: number): Promise<{ congress: Congress; speakers: Speaker[] } | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: congress } = await supabase
    .from('congresses')
    .select('*')
    .eq('year', year)
    .single();

  if (!congress) return null;

  const { data: speakers } = await supabase
    .from('speakers')
    .select('*')
    .eq('congress_year', year)
    .order('sort_order');

  return { congress, speakers: speakers || [] };
}

export default async function CongressPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);
  
  if (isNaN(year) || year < 2000 || year > 2100) {
    notFound();
  }

  const data = await getCongress(year);
  if (!data) notFound();

  const { congress, speakers } = data;

  return (
    <>
      <Hero congress={congress} />
      <Nav year={year} />
      <div className="wave-divider" />
      <Overview congress={congress} />
      <Speakers speakers={speakers} />
      <Tracks tracks={congress.tracks} />
      <Submissions year={year} />
      <Timeline congress={congress} />
      <Venue congress={congress} />
      <Registration pricing={congress.pricing} />
      <Publications publications={congress.publications} />
      <CTA congress={congress} year={year} />
      <Footer />
      <ScrollReveal />
    </>
  );
}

export async function generateStaticParams() {
  return [{ year: '2026' }];
}
