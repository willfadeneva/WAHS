import SubmissionCTA from './SubmissionCTA';

const types = [
  { type: 'Individual Paper', words: '300–500 words', desc: '20-minute presentation' },
  { type: 'Full Panel', words: '800–1,000 words', desc: '3–4 papers, 90-minute session' },
  { type: 'Roundtable', words: '500–700 words', desc: '4–6 participants' },
  { type: 'Workshop', words: '500–700 words', desc: 'Hands-on methodology' },
];

export default function Submissions({ year }: { year: number }) {
  return (
    <section className="submissions" id="submissions">
      <div className="section-inner reveal">
        {/* Header */}
        <span className="section-label">Call for Papers</span>
        <h2 className="section-title">Submit Your Abstract</h2>
        <p className="section-lead" style={{ textAlign: 'center' }}>
          We welcome individual papers, full panels, roundtables, and workshops. Submit your proposal for WAHS {year}.
        </p>
        <p style={{ textAlign: 'center', fontSize: '1.05rem', color: '#333', marginBottom: '4px' }}>Cheju Halla University, Jeju Island, South Korea</p>
        <p style={{ textAlign: 'center', fontSize: '1.05rem', color: '#333', fontWeight: 600, marginBottom: '20px' }}>May 28–30, {year}</p>
        <p style={{ textAlign: 'center', fontSize: '1rem', color: '#555', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto 48px' }}>
          Theme: Cultural Dynamism in the Digital Age—Toward a Universal Theory of Pop Culture Globalization
        </p>

        {/* Overview */}
        <div style={{ maxWidth: '800px', margin: '0 auto 48px' }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#000', marginBottom: '16px' }}>Overview</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#444' }}>
            The World Association for Hallyu Studies (WAHS) invites submissions for its {year} World Congress, which seeks to develop a universal theory of pop culture success in the digital platform era. The Korean Wave presents the paradigmatic case for this theoretical project: the first postcolonial pop culture to achieve sustained global dominance in the platform capitalism age. This congress proposes cultural dynamism as a framework operating at the intersection of institutional-rational mechanisms, historical-structural conditions, affective-cultural dynamics, geopolitical-discursive formations, transnational/transmedia culturalism, and gender politics.
          </p>
        </div>

        {/* Research Tracks */}
        <div style={{ maxWidth: '800px', margin: '0 auto 48px' }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#000', marginBottom: '20px' }}>Research Tracks</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0047A0', marginBottom: '8px' }}>Track 1: Cultural Dynamism (Annual Theme)</h4>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#444', marginBottom: '8px' }}>
              Papers addressing theoretical, empirical, or methodological aspects of cultural dynamism, including:
            </p>
            <ul style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#555', paddingLeft: '20px' }}>
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
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0047A0', marginBottom: '8px' }}>Track 2: Open Topics in Hallyu Studies</h4>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#444', marginBottom: '8px' }}>
              All topics related to Korean Wave studies welcome, including:
            </p>
            <ul style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#555', paddingLeft: '20px' }}>
              <li>K-pop, K-drama, film, webtoons, gaming</li>
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
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#000', marginBottom: '20px', textAlign: 'center' }}>Submission Types</h3>
        <div className="submission-types-row">
          {types.map((t, i) => (
            <div className="submission-card" key={i}>
              <div className="submission-type">{t.type}</div>
              <div className="submission-words">{t.words}</div>
              <div className="submission-desc">{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="submission-requirements">
          <h3 className="submission-requirements-title">Submission Requirements</h3>
          <p className="submission-requirements-text">
            All submissions must include: author name(s), affiliation(s), and email; presentation or panel title; track selection (1 or 2); 5–7 keywords; brief bio (100 words per presenter); and any special requirements. Submit in English using Chicago or APA citation style.
          </p>
        </div>

        {/* Important Dates & Fees */}
        <div style={{ maxWidth: '800px', margin: '32px auto 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: '#000', marginBottom: '16px' }}>Important Dates</h3>
            <div style={{ fontSize: '0.92rem', lineHeight: 2, color: '#444' }}>
              <div><strong>Call Opens:</strong> January 15, {year}</div>
              <div><strong>Abstract Deadline:</strong> April 15, {year}</div>
              <div><strong>Notification:</strong> April 30, {year}</div>
              <div><strong>Early Registration:</strong> May 15, {year} (20% discount)</div>
{/* removed discount code */}
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: '#000', marginBottom: '16px' }}>Registration Fees</h3>
            <div style={{ fontSize: '0.92rem', lineHeight: 2, color: '#444' }}>
              <div><strong>Regular:</strong> $300</div>
              <div><strong>Students:</strong> $150</div>
              <div><strong>WAHS Members:</strong> Free</div>
              <div><strong>Early bird (by May 15):</strong> 20% discount</div>
            </div>
          </div>
        </div>

        {/* Publication Opportunities */}
        <div style={{ maxWidth: '800px', margin: '0 auto 48px' }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: '#000', marginBottom: '12px' }}>Publication Opportunities</h3>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#444' }}>Selected papers will be considered for:</p>
          <ol style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#555', paddingLeft: '20px', marginTop: '8px' }}>
            <li>Special issue of <em>Sociétés</em> (peer-reviewed; A&amp;HCI indexed)</li>
            <li>Special issue of <em>Hallyu</em> (WAHS flagship journal)</li>
            <li>Edited volume with Brill</li>
            <li>WAHS Congress Proceedings</li>
          </ol>
        </div>

        {/* Venue note */}
        <div style={{ maxWidth: '800px', margin: '0 auto 48px', padding: '24px', background: '#f8f8f8', borderLeft: '4px solid #0047A0' }}>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#444', margin: 0 }}>
            Jeju Island, a UNESCO World Heritage Site, offers a unique setting with natural beauty, volcanic landscapes, and distinctive island culture. Accommodation options from university dormitories to resort hotels will be available with discounted rates for participants.
          </p>
        </div>

        {/* Submit CTA — login-gated */}
        <SubmissionCTA year={year} />
      </div>
    </section>
  );
}
