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

      {/* Brill Journal — Hallyu: The Korean Wave */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <a
            href="https://brill.com/view/journals/hlyu/hlyu-overview.xml?tab_body=container-135910-item-135916&contents=ArtSub"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block' }}
          >
            <img
              src="/brill-cfp-2026.jpg"
              alt="Call for Papers — Hallyu: The Korean Wave, Vol. 1 No. 2 (2026), Published by Brill"
              style={{
                width: '100%',
                maxWidth: '620px',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            />
          </a>
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