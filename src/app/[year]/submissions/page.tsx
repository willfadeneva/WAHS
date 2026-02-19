import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Submissions from '@/components/Submissions';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default async function SubmissionsPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  if (isNaN(year) || year < 2000 || year > 2100) {
    notFound();
  }

  // Verify congress exists
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: congress } = await supabase
    .from('congresses')
    .select('year')
    .eq('year', year)
    .single();

  if (!congress) notFound();

  return (
    <>
      <div style={{ height: '80px' }} />
      <Nav year={year} />
      <Submissions year={year} />
      <Footer />
      <ScrollReveal />
    </>
  );
}

export function generateMetadata() {
  return {
    title: 'Submit Your Abstract — WAHS 2026',
  };
}
