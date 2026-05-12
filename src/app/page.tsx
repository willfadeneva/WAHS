import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Committee from '@/components/Committee';
import ScrollReveal from '@/components/ScrollReveal';
import HeroSlider from '@/components/HeroSlider';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="main-page">
      <MainNav />
      
      {/* Hero Slider — Brill CFP / Female Universalism */}
      <HeroSlider />

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