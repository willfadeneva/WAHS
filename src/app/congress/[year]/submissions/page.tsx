import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Submissions from '@/components/Submissions';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';


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
      <Nav year={year} />
      <div style={{ paddingTop: '80px' }}><Breadcrumbs /></div>
      <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
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
