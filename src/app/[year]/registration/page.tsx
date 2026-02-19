import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Registration from '@/components/Registration';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

type Congress = {
  year: number;
  pricing: { tier: string; amount: string; early_bird: string; features: string[]; featured: boolean }[];
};

export default async function RegistrationPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  if (isNaN(year) || year < 2000 || year > 2100) {
    notFound();
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: congress } = await supabase
    .from('congresses')
    .select('year, pricing')
    .eq('year', year)
    .single();

  if (!congress) notFound();

  return (
    <>
      <Nav year={year} />
      <div style={{ paddingTop: '80px' }}><Breadcrumbs /></div>
      <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
      <Registration pricing={(congress as Congress).pricing} />
      <Footer />
      <ScrollReveal />
    </>
  );
}

export function generateMetadata() {
  return {
    title: 'Registration — WAHS 2026',
  };
}
