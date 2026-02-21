import Link from 'next/link';

export default function SimpleCongressPage({ params }: { params: { year: string } }) {
  const year = params.year;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%)',
        padding: '20px 24px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            WAHS
          </Link>
          <div>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Home</Link>
            <Link href="/call-for-papers" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Call for Papers</Link>
            <Link href="/membership" style={{ color: 'white', textDecoration: 'none' }}>Membership</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%)',
        padding: '120px 24px 80px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '10px' }}>세계한류학회</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '20px', fontWeight: 'bold' }}>
            WORLD CONGRESS FOR HALLYU STUDIES {year}
          </h1>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '10px', fontWeight: '300' }}>
            Cultural Dynamism in the Digital Age
          </h2>
          <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', marginBottom: '30px', fontWeight: '600' }}>
            Toward a Universal Theory of Pop Culture Globalization
          </p>
          <div style={{ fontSize: '1.3rem', marginBottom: '8px', fontWeight: '500' }}>
            MAY 28–30, {year}
          </div>
          <div style={{ fontSize: '1.1rem', marginBottom: '40px', opacity: 0.9 }}>
            CHEJU HALLA UNIVERSITY, JEJU ISLAND, SOUTH KOREA
          </div>
          
          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/congress/${year}/submissions-new`}
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
              href={`/congress/${year}/registration`}
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
      </section>

      {/* Main Content */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Overview */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              CONFERENCE OVERVIEW
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px' }}>
              The World Association for Hallyu Studies (WAHS) invites you to the {year} World Congress, 
              which seeks to develop a universal theory of pop culture success in the digital platform era. 
              The Korean Wave presents the paradigmatic case for this theoretical project: the first postcolonial 
              pop culture to achieve sustained global dominance in the platform capitalism age.
            </p>
          </div>

          {/* Tracks */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              RESEARCH TRACKS
            </h3>
            
            <div style={{ marginBottom: '40px' }}>
              <h4 style={{ fontSize: '1.4rem', color: '#CD2E3A', marginBottom: '15px' }}>Track 1: Cultural Dynamism (Annual Theme)</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '15px' }}>
                Papers addressing theoretical, empirical, or methodological aspects of cultural dynamism.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.4rem', color: '#CD2E3A', marginBottom: '15px' }}>Track 2: Open Topics in Hallyu Studies</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '15px' }}>
                All topics related to Korean Wave studies welcome.
              </p>
            </div>
          </div>

          {/* Important Dates */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0047A0', marginBottom: '20px', borderBottom: '2px solid #0047A0', paddingBottom: '10px' }}>
              IMPORTANT DATES
            </h3>
            <ul style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '20px', paddingLeft: '20px' }}>
              <li><strong>Abstract Submission Deadline:</strong> March 31, {year}</li>
              <li><strong>Notification of Acceptance:</strong> April 15, {year}</li>
              <li><strong>Early Bird Registration:</strong> May 15, {year}</li>
              <li><strong>Congress Dates:</strong> May 28–30, {year}</li>
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
              Join Us for Congress {year}
            </h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#333', marginBottom: '40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              Submit your abstract today and be part of this groundbreaking academic event.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href={`/congress/${year}/submissions-new`}
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
                href={`/congress/${year}/registration`}
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
          <p style={{ marginBottom: '10px' }}>© {year} World Association for Hallyu Studies (WAHS)</p>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
            Cheju Halla University, Jeju Island, South Korea • 
            <a href="mailto:wahskorea@gmail.com" style={{ color: '#aaa', marginLeft: '10px' }}>wahskorea@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}