import { redirect } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { createServerClient } from '@/lib/supabase-server';

export default async function ResourcesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/wahs/login');
  }

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Member Resources</h1>
            <p className="main-page-subtitle">Exclusive content for WAHS members</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="main-content-box" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 24 }}>📚</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 16 }}>
                Member-Only Resources Coming Soon
              </h2>
              <p style={{ color: 'var(--slate)', lineHeight: 1.7, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                We are currently compiling exclusive research materials, publications, and resources
                for our members. These will be available shortly.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--mist)', marginBottom: 24 }}>
                In the meantime, feel free to explore our congress materials or contact us
                at <a href="mailto:wahskorea@gmail.com" style={{ color: 'var(--kr-blue)' }}>wahskorea@gmail.com</a>
              </p>
              <Link href="/wahs/dashboard" style={{ color: 'var(--kr-blue)', fontWeight: 600 }}>
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}
