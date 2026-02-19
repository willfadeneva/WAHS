import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Committee from '@/components/Committee';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="main-page">
      <MainNav />
      
      {/* Hero Section */}
      <section className="main-hero">
        <div className="main-hero-content">
          <div className="main-hero-korean">세계한류학회</div>
          <h1 className="main-hero-title">
            World Association for<br />
            <em>Hallyu Studies</em>
          </h1>
          <p className="main-hero-subtitle">
            Advancing the academic study of the Korean Wave through international collaboration, 
            research excellence, and scholarly discourse across diverse disciplines.
          </p>
        </div>
      </section>

      {/* Call for Papers Announcement */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#CD2E3A', marginBottom: '16px' }}>Announcement</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#000', marginBottom: '16px', lineHeight: 1.2 }}>
            Call for Papers and Panels
          </h2>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: '#0047A0', marginBottom: '12px' }}>
            12th World Congress for Hallyu Studies 2026
          </h3>
          <p style={{ fontSize: '1rem', color: '#333', marginBottom: '8px' }}>
            Cheju Halla University, Jeju Island, South Korea
          </p>
          <p style={{ fontSize: '1rem', color: '#333', marginBottom: '20px', fontWeight: 600 }}>
            May 28–30, 2026
          </p>
          <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px' }}>
            Theme: Cultural Dynamism in the Digital Age—Toward a Universal Theory of Pop Culture Globalization
          </p>
          <Link href="/2026/submissions" style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: '#CD2E3A',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            letterSpacing: '0.5px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}>
            Submit Your Abstract →
          </Link>
        </div>
      </section>

      {/* Congress CTA Banner */}
      <section className="main-congress-cta">
        <div className="main-congress-cta-content">
          <div className="main-congress-cta-inner">
            <h2>2026 World Congress</h2>
            <p>Jeju Island, May 28-30</p>
            <Link href="/2026" className="main-congress-cta-button">
              Join Our Congress →
            </Link>
          </div>
        </div>
      </section>

      {/* Our Team — Full Committee with Photos */}
      <Committee detailed />

      {/* About Preview Section */}
      <section className="main-about-preview">
        <div className="main-about-preview-inner">
          <h2 className="main-section-title">About WAHS</h2>
          <p className="main-about-preview-text">
            The World Association for Hallyu Studies (WAHS) is an international academic organization 
            comprising scholars and practitioners engaged in the study and promotion of Hallyu across 
            diverse disciplines. Since 2013, we have established 36 overseas branches in 26 countries, 
            fostering transnational collaboration and cross-cultural communication.
          </p>
          <Link href="/about" className="main-about-preview-link">
            Learn More About WAHS →
          </Link>
        </div>
      </section>

      <MainFooter />
      <ScrollReveal />
    </div>
  );
}