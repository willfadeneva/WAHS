import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check if we're running as main site (wahs.org) or congress subdomain (congress.wahs.org)
  // For now: if there's only congress data, redirect to latest
  // Later when main site content exists, show the landing page

  const { data: congresses } = await supabase
    .from('congresses')
    .select('year, title, theme, dates, location, is_active, is_archived')
    .order('year', { ascending: false });

  const active = congresses?.find(c => c.is_active);
  const archived = congresses?.filter(c => c.is_archived) || [];

  // If running as congress subdomain, redirect to latest active
  const isCongressSubdomain = process.env.SITE_MODE === 'congress';
  if (isCongressSubdomain && active) {
    const { redirect } = await import('next/navigation');
    redirect(`/${active.year}`);
  }

  // Main site landing page
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream, #faf8f4)' }}>
      <section className="hero" id="top" style={{ minHeight: '60vh' }}>
        <div className="hero-watermark">한류</div>
        <div className="hero-content" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="hero-eyebrow">Since 2003</div>
          <h1 className="hero-title">World Association for<br/><em>Hallyu Studies</em></h1>
          <p className="hero-subtitle">Advancing the academic study of the Korean Wave and its global impact through research, collaboration, and world congresses.</p>
          {active && (
            <div className="hero-cta">
              <Link href={`/${active.year}`} className="btn-primary">
                {active.theme || `${active.year} Congress`} — {active.location} →
              </Link>
            </div>
          )}
        </div>
      </section>

      <nav className="sticky-nav">
        <div className="sticky-nav-inner">
          <Link href="/" className="sticky-nav-brand">WAHS</Link>
          <ul className="sticky-nav-links">
            <li><a href="#congresses">Congresses</a></li>
            <li><a href="https://www.iwahs.org" target="_blank">About WAHS</a></li>
            <li><a href="mailto:wahskorea@gmail.com">Contact</a></li>
          </ul>
        </div>
      </nav>

      <div className="wave-divider" />

      <section className="overview" id="congresses" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <span className="section-label">World Congresses</span>
          <h2 className="section-title">Congress History</h2>
          <p className="section-lead">Browse current and past WAHS World Congresses for Hallyu Studies.</p>

          {active && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--navy, #0a1628)', marginBottom: '16px' }}>🔴 Current Congress</h3>
              <Link href={`/${active.year}`} style={{ textDecoration: 'none' }}>
                <div className="framework-card" style={{ borderColor: 'var(--coral, #e8654a)', borderWidth: '2px' }}>
                  <h3>{active.title}</h3>
                  <p>{active.dates} · {active.location}</p>
                </div>
              </Link>
            </div>
          )}

          {archived.length > 0 && (
            <div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--navy, #0a1628)', marginBottom: '16px' }}>📚 Past Congresses</h3>
              <div className="framework-grid">
                {archived.map(c => (
                  <Link href={`/${c.year}`} key={c.year} style={{ textDecoration: 'none' }}>
                    <div className="framework-card">
                      <h3>{c.title}</h3>
                      <p>{c.dates} · {c.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer>
        <p>World Association for Hallyu Studies (WAHS) · <a href="https://www.iwahs.org" target="_blank">www.iwahs.org</a></p>
        <p>Contact: <a href="mailto:wahskorea@gmail.com">wahskorea@gmail.com</a></p>
      </footer>
    </div>
  );
}
