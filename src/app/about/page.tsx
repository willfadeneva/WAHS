import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';

export default function AboutPage() {
  return (
    <div className="main-page">
      <MainNav />
      
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">About WAHS</h1>
            <p className="main-page-subtitle">
              Learn about our history, mission, and global impact in Hallyu studies
            </p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner">
            <div className="main-content-grid">
              <div className="main-content-main">
                <h2>Our Story</h2>
                <p className="main-content-lead">
                  The World Association for Hallyu Studies (WAHS) is an international academic 
                  organization comprising scholars and practitioners engaged in the study and 
                  promotion of Hallyu across diverse disciplines.
                </p>
                
                <p>
                  Recognizing Hallyu's emergence as both a significant cultural phenomenon and 
                  a vital area of scholarly inquiry, WAHS seeks to integrate theoretical perspectives 
                  with practical applications to advance comprehensive understanding of Korean 
                  popular culture and its global impact.
                </p>
                
                <p>
                  Following its inaugural general meeting in January 2013, WAHS was officially 
                  incorporated with the approval of the Ministry of Culture, Sports and Tourism 
                  in March of the same year. Since 2021, the Association has established 36 
                  overseas branches in 26 countries, thereby cultivating a global network that 
                  fosters transnational collaboration, research exchange, and cross-cultural 
                  communication through the study of Hallyu.
                </p>

                <h2>Legal Status</h2>
                <p>
                  WAHS was registered as a legal donation organization on June 30, 2016, and 
                  is incorporated under the Ministry of Culture, Sports and Tourism of the 
                  Republic of Korea. This official recognition underscores our commitment to 
                  academic excellence and transparent governance.
                </p>

                <h2>Our Mission</h2>
                <p>
                  We are dedicated to fostering scholarly research and academic discourse on 
                  Korean popular culture and its global influence. Through our world congresses, 
                  academic publications, and international network, we bring together researchers 
                  from diverse fields to advance understanding of the Korean Wave phenomenon.
                </p>

                <h2>Our Vision</h2>
                <p>
                  To be the leading global platform for Hallyu studies, connecting scholars 
                  worldwide and promoting rigorous academic research that contributes to our 
                  understanding of Korean culture's international impact and significance in 
                  the 21st century.
                </p>
              </div>
              
              <div className="main-content-sidebar">
                <div className="main-content-box">
                  <h3>Quick Facts</h3>
                  <ul className="main-fact-list">
                    <li><strong>Founded:</strong> January 2013</li>
                    <li><strong>Incorporated:</strong> March 2013</li>
                    <li><strong>Legal Status:</strong> Donation Organization (2016)</li>
                    <li><strong>Overseas Branches:</strong> 36 in 26 countries</li>
                    <li><strong>Ministry:</strong> Culture, Sports and Tourism</li>
                  </ul>
                </div>

                <div className="main-content-box">
                  <h3>Global Reach</h3>
                  <p>
                    With branches across Asia, Europe, Americas, and Oceania, 
                    WAHS maintains a truly international perspective on Hallyu studies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}