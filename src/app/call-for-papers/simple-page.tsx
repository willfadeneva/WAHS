import Link from 'next/link';

export default function SimpleCallForPapersPage() {
  return (
    <div className="main-page">
      {/* Simple Header without MainNav */}
      <header style={{ 
        background: 'linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%)',
        padding: '20px 24px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            WAHS
          </Link>
          <div>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Home</Link>
            <Link href="/congress/2026" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Congress</Link>
            <Link href="/membership" style={{ color: 'white', textDecoration: 'none' }}>Membership</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%)', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ color: '#fff', opacity: 0.9, fontSize: '1.2rem', marginBottom: '10px' }}>세계한류학회</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', marginBottom: '20px' }}>
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
                href="/congress/2026/registration"
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

          {/* Submission Guidelines */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              SUBMISSION GUIDELINES
            </h3>
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '1.4rem', color: '#CD2E3A', marginBottom: '15px' }}>Abstract Requirements</h4>
              <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px' }}>
                <li><strong>Title:</strong> Clear and descriptive (max 20 words)</li>
                <li><strong>Abstract:</strong> 250–300 words outlining research question, methodology, findings, and significance</li>
                <li><strong>Keywords:</strong> 3–5 keywords</li>
                <li><strong>Presentation Type:</strong> Oral, Poster, or Workshop</li>
                <li><strong>Track:</strong> Select Cultural Dynamism or Open Topics</li>
                <li><strong>Language:</strong> English or Korean</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.4rem', color: '#CD2E3A', marginBottom: '15px' }}>Important Dates</h4>
              <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px' }}>
                <li><strong>Abstract Submission Deadline:</strong> March 31, 2026</li>
                <li><strong>Notification of Acceptance:</strong> April 15, 2026</li>
                <li><strong>Early Bird Registration:</strong> May 15, 2026</li>
                <li><strong>Congress Dates:</strong> May 28–30, 2026</li>
              </ul>
            </div>
          </div>

          {/* Publication Opportunities */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              PUBLICATION OPPORTUNITIES
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px' }}>
              Selected papers from the congress will be considered for publication in:
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px' }}>
              <li><strong>SOCIÉTÉS</strong> - Peer-reviewed, A&HCI indexed (special issue)</li>
              <li><strong>HALLYU</strong> - WAHS flagship journal (special issue)</li>
              <li><strong>BRILL</strong> - Leading academic publisher (edited volume)</li>
              <li><strong>WAHS Congress Proceedings</strong> - Open access publication</li>
            </ul>
          </div>

          {/* Final CTA */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,71,160,0.05) 0%, rgba(205,46,58,0.05) 100%)', 
            padding: '60px 40px', 
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid rgba(0,71,160,0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', color: '#0047A0', marginBottom: '20px' }}>
              Ready to Submit Your Abstract?
            </h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#333', marginBottom: '40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              Join leading scholars from around the world in shaping the future of Hallyu studies. 
              Submit your abstract today and be part of this groundbreaking academic event.
            </p>
            
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
                href="/congress/2026/registration"
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

      {/* Simple Footer */}
      <footer style={{ 
        background: '#1a1a1a', 
        color: '#fff', 
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ marginBottom: '10px' }}>© 2026 World Association for Hallyu Studies (WAHS)</p>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
            Cheju Halla University, Jeju Island, South Korea • 
            <a href="mailto:wahskorea@gmail.com" style={{ color: '#aaa', marginLeft: '10px' }}>wahskorea@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}