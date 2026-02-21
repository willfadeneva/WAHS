import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Link from 'next/link';

export default function CallForPapersPage() {
  return (
    <div className="main-page">
      <MainNav />
      
      {/* Hero Section */}
      <section className="main-hero" style={{ background: 'linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%)' }}>
        <div className="main-hero-content">
          <div className="main-hero-korean" style={{ color: '#fff', opacity: 0.9 }}>세계한류학회</div>
          <h1 className="main-hero-title" style={{ color: '#fff' }}>
            CALL FOR PAPERS
          </h1>
          <div style={{ fontSize: '1.8rem', fontWeight: 300, color: '#fff', marginTop: '20px', letterSpacing: '2px' }}>
            ═══════════════════════════════════════
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Conference Title */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000', marginBottom: '20px' }}>
              WORLD CONGRESS FOR HALLYU STUDIES 2026
            </h2>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#0047A0', marginBottom: '10px' }}>
              Cultural Dynamism in the Digital Age
            </h3>
            <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: '#CD2E3A', marginBottom: '30px', fontWeight: 600 }}>
              Toward a Universal Theory of Pop Culture Globalization
            </p>
            <div style={{ fontSize: '1.3rem', color: '#333', marginBottom: '8px', fontWeight: 500 }}>
              MAY 28–30, 2026
            </div>
            <div style={{ fontSize: '1.1rem', color: '#555', marginBottom: '40px' }}>
              CHEJU HALLA UNIVERSITY, JEJU ISLAND, SOUTH KOREA
            </div>
            
            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/congress/submit-abstract"
                style={{
                  background: '#0047A0',
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.3s'
                }}
                className="hover-button-blue"
              >
                Submit Abstract
              </Link>
              <Link
                href="/2026/registration"
                style={{
                  background: '#CD2E3A',
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.3s'
                }}
                className="hover-button-red"
              >
                Register for Congress
              </Link>
            </div>
          </div>

          {/* Conference Overview */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              CONFERENCE OVERVIEW
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px' }}>
              The World Association for Hallyu Studies (WAHS) invites submissions for its 2026 World Congress, 
              which seeks to develop a universal theory of pop culture success in the digital platform era. 
              The Korean Wave presents the paradigmatic case for this theoretical project: the first postcolonial 
              pop culture to achieve sustained global dominance in the platform capitalism age.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px' }}>
              This congress proposes <strong>CULTURAL DYNAMISM</strong> as a framework operating at the intersection of:
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>Institutional-rational mechanisms</li>
              <li>Historical-structural conditions</li>
              <li>Affective-cultural dynamics</li>
              <li>Geopolitical-discursive formations</li>
              <li>Transnational/transmedia culturalism</li>
              <li>Gender politics</li>
            </ul>
          </div>

          {/* Research Tracks */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              RESEARCH TRACKS
            </h3>
            
            <div style={{ marginBottom: '40px' }}>
              <h4 style={{ fontSize: '1.4rem', color: '#CD2E3A', marginBottom: '15px' }}>Track 1: Cultural Dynamism (Annual Theme)</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '15px' }}>
                Papers addressing theoretical, empirical, or methodological aspects of cultural dynamism, including:
              </p>
              <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px', columns: '2', columnGap: '40px' }}>
                <li>Platform capitalism and digital circulation</li>
                <li>Gender politics and female universalism</li>
                <li>Production systems and business models</li>
                <li>Fandom practices and participatory culture</li>
                <li>Postcolonial positioning and geopolitical contexts</li>
                <li>Transmedia storytelling and IP management</li>
                <li>Comparative cases beyond Korea</li>
                <li>Methodological innovations</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.4rem', color: '#CD2E3A', marginBottom: '15px' }}>Track 2: Open Topics in Hallyu Studies</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '15px' }}>
                All topics related to Korean Wave studies welcome:
              </p>
              <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px', columns: '2', columnGap: '40px' }}>
                <li>K-pop, K-drama, Film, Webtoons, Gaming</li>
                <li>Regional reception studies</li>
                <li>Language learning and Korean studies</li>
                <li>Cultural policy and soft power</li>
                <li>Tourism and place branding</li>
                <li>Consumption practices</li>
                <li>Authenticity and cultural translation</li>
              </ul>
            </div>
          </div>

          {/* Submission Types */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              SUBMISSION TYPES
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <h4 style={{ fontSize: '1.3rem', color: '#0047A0', marginBottom: '15px' }}>Individual Paper Abstracts</h4>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#333', marginBottom: '10px' }}>
                  <strong>300-500 words</strong><br />
                  20-minute presentations
                </p>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <h4 style={{ fontSize: '1.3rem', color: '#0047A0', marginBottom: '15px' }}>Full Panel Proposals</h4>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#333', marginBottom: '10px' }}>
                  <strong>800-1,000 words</strong><br />
                  3-4 papers per panel (90-minute session)
                </p>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <h4 style={{ fontSize: '1.3rem', color: '#0047A0', marginBottom: '15px' }}>Roundtable Proposals</h4>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#333', marginBottom: '10px' }}>
                  <strong>500-700 words</strong><br />
                  4-6 participants
                </p>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <h4 style={{ fontSize: '1.3rem', color: '#0047A0', marginBottom: '15px' }}>Workshop Proposals</h4>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#333', marginBottom: '10px' }}>
                  <strong>500-700 words</strong><br />
                  Hands-on methodological sessions
                </p>
              </div>
            </div>
          </div>

          {/* Publication Opportunities */}
          <div style={{ marginBottom: '60px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', padding: '40px', borderRadius: '12px', border: '2px solid #0047A0' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', textAlign: 'center' }}>
              📚 PUBLICATION OPPORTUNITIES
            </h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#333', marginBottom: '30px', textAlign: 'center', fontWeight: '500' }}>
              Selected papers will be considered for publication in:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
              <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>1</div>
                <h4 style={{ fontSize: '1.2rem', color: '#0047A0', marginBottom: '10px' }}>SOCIÉTÉS</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#555' }}>
                  Peer-reviewed journal<br />
                  A&HCI indexed<br />
                  Special issue
                </p>
              </div>
              
              <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>2</div>
                <h4 style={{ fontSize: '1.2rem', color: '#0047A0', marginBottom: '10px' }}>HALLYU</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#555' }}>
                  WAHS flagship journal<br />
                  Special issue
                </p>
              </div>
              
              <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>3</div>
                <h4 style={{ fontSize: '1.2rem', color: '#0047A0', marginBottom: '10px' }}>BRILL</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#555' }}>
                  Leading academic publisher<br />
                  Edited volume
                </p>
              </div>
              
              <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>4</div>
                <h4 style={{ fontSize: '1.2rem', color: '#0047A0', marginBottom: '10px' }}>CONGRESS PROCEEDINGS</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#555' }}>
                  WAHS Congress Proceedings<br />
                  Open access
                </p>
              </div>
            </div>
          </div>

          {/* Submission Requirements */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              SUBMISSION REQUIREMENTS
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px' }}>
              All submissions must include:
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px' }}>
              <li>Author name(s), affiliation(s), email</li>
              <li>Presentation/panel title</li>
              <li>Track selection (1 or 2)</li>
              <li>5-7 keywords</li>
              <li>Brief bio (100 words per presenter)</li>
              <li>Special requirements (if any)</li>
            </ul>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', fontStyle: 'italic' }}>
              <strong>FORMAT:</strong> Submit in English using Chicago or APA citation style
            </p>
          </div>

          {/* Important Dates */}
          <div style={{ marginBottom: '60px', background: '#0047A0', color: 'white', padding: '40px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', textAlign: 'center' }}>
              IMPORTANT DATES
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>January 15, 2026</div>
                <p style={{ fontSize: '1.1rem' }}>Call Opens</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>April 15, 2026</div>
                <p style={{ fontSize: '1.1rem' }}>Abstract Deadline</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>April 30, 2026</div>
                <p style={{ fontSize: '1.1rem' }}>Notification</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>May 28-30, 2026</div>
                <p style={{ fontSize: '1.1rem' }}>Congress Dates</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '30px' }}>
              Ready to Submit Your Abstract?
            </h3>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/congress/submit-abstract"
                style={{
                  background: '#0047A0',
                  color: 'white',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: '4px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.3s'
                }}
                className="hover-button-blue"
              >
                Submit Abstract Now
              </Link>
              <Link
                href="/2026/registration"
                style={{
                  background: '#CD2E3A',
                  color: 'white',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: '4px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.3s'
                }}
                className="hover-button-red"
              >
                Register for Congress
              </Link>
            </div>
            <p style={{ fontSize: '1rem', color: '#666', marginTop: '30px' }}>
              Need help? Contact <a href="mailto:wahskorea@gmail.com" style={{ color: '#0047A0', fontWeight: '500' }}>wahskorea@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}