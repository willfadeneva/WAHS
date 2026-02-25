import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import Overview from '@/components/Overview';
import Speakers from '@/components/Speakers';
import Tracks from '@/components/Tracks';
import Timeline from '@/components/Timeline';
import Venue from '@/components/Venue';
import Publications from '@/components/Publications';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScrollReveal from '@/components/ScrollReveal';
import Congress2022 from '@/components/Congress2022';

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

  // 2022: static archive page (no Supabase data needed)
  if (year === 2022) {
    return (
      <>
        <Nav year={year} />
        <Congress2022 />
        <Footer />
        <ScrollReveal />
      </>
    );
  }

  const data = await getCongress(year);
  if (!data) notFound();

  const { congress, speakers } = data;

  return (
    <>
      <Nav year={year} />
      <div style={{ paddingTop: '20px', background: 'var(--navy)' }}><Breadcrumbs dark /></div>
      <Hero congress={congress} />
      <div className="wave-divider" />
      <Overview congress={congress} />
      <Speakers speakers={speakers} />
      <Tracks tracks={congress.tracks} />
      <section className="submissions" id="submissions">
        <div className="section-inner reveal" style={{ textAlign: 'center' }}>
          <span className="section-label">Call for Papers</span>
          <h2 className="section-title">Submit Your Abstract</h2>
          <p className="section-lead">We welcome individual papers, full panels, roundtables, and workshops. Submit your proposal for WAHS {year}.</p>
          <Link href={`/congress/${year}/submissions`} className="btn-primary">Submit Abstract →</Link>
        </div>
      </section>
      <Timeline congress={congress} />
      <Venue congress={congress} />
      <section className="registration" id="registration">
        <div className="section-inner reveal" style={{ textAlign: 'center' }}>
          <span className="section-label">Registration</span>
          <h2 className="section-title">Register</h2>
          <p className="section-lead">Early bird registration receives a 20% discount. Secure your spot at WAHS {year}.</p>
          <Link href={`/congress/${year}/registration`} className="btn-primary">Register Now →</Link>
        </div>
      </section>
      <Publications publications={congress.publications} />
      <CTA congress={congress} year={year} />
      <Footer />
      <ScrollReveal />
    </>
  );
}

export const dynamic = 'force-dynamic';
