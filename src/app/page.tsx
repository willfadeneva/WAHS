import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
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

      {/* Leadership Section */}
      <section className="main-leadership">
        <div className="main-leadership-inner">
          <h2 className="main-section-title">Our Leadership</h2>
          
          <div className="main-leadership-grid">
            {/* Advisors */}
            <div className="main-leadership-category">
              <h3>Advisors</h3>
              <div className="main-leadership-list">
                <div className="main-leadership-member">
                  <strong>Prof. Henry Jenkins</strong>
                  <span>USC</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Paul Lopes</strong>
                  <span>Colgate</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Ingyu Oh</strong>
                  <span>Kansai Gaidai</span>
                </div>
              </div>
            </div>

            {/* President */}
            <div className="main-leadership-category">
              <h3>President</h3>
              <div className="main-leadership-list">
                <div className="main-leadership-member">
                  <strong>Prof. Taeseok Jeong</strong>
                  <span>Jeonbuk National University</span>
                </div>
              </div>
            </div>

            {/* Vice Presidents & Directors */}
            <div className="main-leadership-category">
              <h3>Vice Presidents & Directors</h3>
              <div className="main-leadership-list">
                <div className="main-leadership-member">
                  <strong>Prof. Dong-Hoon Seol</strong>
                  <span>Academic Affairs</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Iksuk Kim</strong>
                  <span>Public Relations</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Sang-Myung Lee</strong>
                  <span>Finance</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Yeuntae Kim</strong>
                  <span>K-Medicine Affairs</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Hojin Kwon</strong>
                  <span>Hallyu Affairs</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Hyun Ki Kim</strong>
                  <span>Media Affairs</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Tiger Kim</strong>
                  <span>Martial Arts Affairs</span>
                </div>
              </div>
            </div>

            {/* Secretary General & CEO */}
            <div className="main-leadership-category">
              <h3>Secretary General & CEO</h3>
              <div className="main-leadership-list">
                <div className="main-leadership-member">
                  <strong>Hyeseon Hwang</strong>
                  <span>WAHS, Korea</span>
                </div>
              </div>
            </div>

            {/* Auditors */}
            <div className="main-leadership-category">
              <h3>Auditors</h3>
              <div className="main-leadership-list">
                <div className="main-leadership-member">
                  <strong>Prof. Yunsung Koh</strong>
                  <span>Hankuk Univ. of Foreign Studies</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Mr. Giho Seo</strong>
                  <span>Whawoo Tax Firm</span>
                </div>
              </div>
            </div>

            {/* International Board Members */}
            <div className="main-leadership-category main-leadership-international">
              <h3>International Board Members</h3>
              <div className="main-leadership-list main-leadership-international-grid">
                <div className="main-leadership-member">
                  <strong>Prof. Jieun Kiaer</strong>
                  <span>Oxford</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Rebecca King-O'Riain</strong>
                  <span>Maynooth</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Roald Maliangkay</strong>
                  <span>ANU</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Chuyun Oh</strong>
                  <span>San Diego State</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Nissim Otmazgin</strong>
                  <span>Hebrew Univ. Jerusalem</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Prof. Danielle Pyun</strong>
                  <span>Ohio State</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Assoc. Prof. Fabio La Rocca</strong>
                  <span>Montpellier</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Assoc. Prof. Hye-Sook Wang</strong>
                  <span>Brown</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Tom Baudinette</strong>
                  <span>Macquarie</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Gamin Kang</strong>
                  <span>UCLA</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Sarah Keith</strong>
                  <span>Macquarie</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Do Own Kim</strong>
                  <span>UIC</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Olga Lazareva</strong>
                  <span>European Univ. St. Petersburg</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Irina Lyan</strong>
                  <span>Hebrew Univ. Jerusalem</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Yun Jung Im Park</strong>
                  <span>São Paulo</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Meicheng Sun</strong>
                  <span>Beijing Lang. & Culture Univ.</span>
                </div>
                <div className="main-leadership-member">
                  <strong>Dr. Haekyung Um</strong>
                  <span>Liverpool</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}