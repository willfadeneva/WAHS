import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Registration from '@/components/Registration';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import WAHSMemberRegistration from './WAHSMemberRegistration';

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

  const supabase = await createServerClient();

  const { data: congress } = await supabase
    .from('congresses')
    .select('year, pricing')
    .eq('year', year)
    .single();

  if (!congress) notFound();

  // Check if current user is an active WAHS member
  const { data: { user } } = await supabase.auth.getUser();
  let wahsMember: { full_name: string; membership_type: string; email: string } | null = null;

  if (user) {
    const { data: member } = await supabase
      .from('wahs_members')
      .select('full_name, membership_type, email, membership_status')
      .eq('user_id', user.id)
      .eq('membership_status', 'active')
      .single();

    if (member) {
      wahsMember = {
        full_name: member.full_name,
        membership_type: member.membership_type,
        email: member.email,
      };
    }
  }

  return (
    <>
      <Nav year={year} />
      <div style={{ paddingTop: '80px' }}><Breadcrumbs /></div>
      <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>

      {/* WAHS Member Banner — show before general registration */}
      {wahsMember && (
        <WAHSMemberRegistration
          year={year}
          memberName={wahsMember.full_name}
          memberType={wahsMember.membership_type}
          memberEmail={wahsMember.email}
        />
      )}

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
