import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

const keynotes = [
  {
    name: 'Jieun Kiaer',
    title: 'Young Bin Min–KF Professor of Korean Linguistics, University of Oxford',
  },
  {
    name: 'Ingyu Oh',
    title: 'Professor, Kansai Gaidai University\nFormer President, World Association for Hallyu Studies',
  },
  {
    name: 'Joann Elfving-Hwang',
    title: 'Professor of Korean Society and Culture, Curtin University\nDirector, Korea Research & Engagement Centre (KRC)',
  },
];

const researchTracks = [
  {
    number: 'Track 1',
    title: 'Cultural Dynamism (Annual Theme)',
    description:
      'We welcome theoretical, empirical, and methodological contributions on:',
    items: [
      'Platform capitalism and digital circulation',
      'Gender politics and female universalism',
      'Production systems and business models',
      'Fandom practices and participatory culture',
      'Postcolonial positioning and geopolitical contexts',
      'Transmedia storytelling and intellectual property management',
      'Comparative cases beyond Korea',
      'Methodological innovations',
    ],
  },
  {
    number: 'Track 2',
    title: 'Open Topics in Hallyu Studies',
    description:
      'Submissions addressing all aspects of the Korean Wave are encouraged, including:',
    items: [
      'K-pop, K-drama, film, webtoons, and gaming',
      'Regional reception and audience studies',
      'Language learning and Korean Studies',
      'Cultural policy and soft power',
      'Tourism and place branding',
      'Consumption practices',
      'Authenticity and cultural translation',
    ],
  },
];

const submissionTypes = [
  {
    title: 'Individual Paper Abstracts',
    detail: '300–500 words',
    note: '20-minute presentations',
  },
  {
    title: 'Full Panel Proposals',
    detail: '800–1,000 words',
    note: '3–4 papers; 90-minute sessions',
  },
  {
    title: 'Roundtable Proposals',
    detail: '500–700 words',
    note: '4–6 participants',
  },
  {
    title: 'Workshop Proposals',
    detail: '500–700 words',
    note: 'Practice-oriented methodological or pedagogical sessions',
  },
];

const importantDates = [
  { label: 'Submission Deadline', value: 'August 31, 2026' },
  { label: 'Notification of Acceptance', value: 'September 30, 2026' },
  { label: 'Congress Dates', value: 'November 5–6, 2026' },
  { label: 'Venue', value: 'Sungkyunkwan University (SKKU), Seoul, South Korea' },
];

const pubOpportunities = [
  'Hallyu: The Korean Wave (WAHS Journal)',
  'Sociétés (A&HCI-indexed)',
  'WAHS Conference Proceedings',
];

export default function CallForPapers() {
  return (
    <section className="cfp-section">
      <div className="cfp-inner">
        {/* Header */}
        <div className="cfp-header">
          <span className="cfp-eyebrow">Call for Papers</span>
          <h2 className="cfp-title">
            12th World Congress for Hallyu Studies{' '}
            <span className="cfp-accent">(WAHS 2026)</span>
          </h2>
          <p className="cfp-subtitle">
            Cultural Dynamism in the Digital Age: Toward a Universal Theory of Pop
            Culture Globalization
          </p>
          <div className="cfp-meta">
            <span className="cfp-meta-item">
              <strong>November 5–6, 2026</strong>
            </span>
            <span className="cfp-meta-sep">·</span>
            <span className="cfp-meta-item">
              Sungkyunkwan University (SKKU), Seoul, South Korea
            </span>
          </div>
        </div>

        {/* Overview */}
        <div className="cfp-block">
          <h3 className="cfp-block-title">Conference Overview</h3>
          <div className="cfp-block-body">
            <p>
              The World Association for Hallyu Studies (WAHS) invites submissions
              for the 12th World Congress for Hallyu Studies, to be held in Seoul
              and hosted at the International Convention Center of Sungkyunkwan
              University (SKKU).
            </p>
            <p>
              This year&apos;s congress advances WAHS&apos;s core intellectual agenda: the
              development of a universal theory of pop culture success in the
              digital platform era, with the Korean Wave serving as a paradigmatic
              case.
            </p>
            <p className="cfp-conceptualize">
              We conceptualize <strong>Cultural Dynamism</strong> as emerging at the
              intersection of:
            </p>
            <ul className="cfp-list">
              <li>Institutional–rational mechanisms</li>
              <li>Historical–structural conditions</li>
              <li>Affective–cultural dynamics</li>
              <li>Geopolitical–discursive formations</li>
              <li>Transnational and transmedia cultural processes</li>
              <li>Gender politics</li>
            </ul>
          </div>
        </div>

        {/* Keynote Speakers */}
        <div className="cfp-block cfp-speakers">
          <h3 className="cfp-block-title">Distinguished Keynote Speakers</h3>
          <div className="cfp-speaker-grid">
            {keynotes.map((sp) => (
              <div className="cfp-speaker-card" key={sp.name}>
                <h4 className="cfp-speaker-name">{sp.name}</h4>
                <p className="cfp-speaker-title">
                  {sp.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < sp.title.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Research Tracks */}
        <div className="cfp-block">
          <h3 className="cfp-block-title">Research Tracks</h3>
          <div className="cfp-track-grid">
            {researchTracks.map((track) => (
              <div className="cfp-track-card" key={track.number}>
                <span className="cfp-track-number">{track.number}</span>
                <h4 className="cfp-track-title">{track.title}</h4>
                <p className="cfp-track-desc">{track.description}</p>
                <ul className="cfp-list cfp-track-list">
                  {track.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Types */}
        <div className="cfp-block">
          <h3 className="cfp-block-title">Submission Types</h3>
          <div className="cfp-types-grid">
            {submissionTypes.map((type) => (
              <div className="cfp-type-card" key={type.title}>
                <h4 className="cfp-type-title">{type.title}</h4>
                <p className="cfp-type-detail">{type.detail}</p>
                <p className="cfp-type-note">{type.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Requirements */}
        <div className="cfp-block">
          <h3 className="cfp-block-title">Submission Requirements</h3>
          <p className="cfp-block-lead">
            All submissions must include:
          </p>
          <ul className="cfp-list cfp-req-list">
            <li>Author name(s), institutional affiliation(s), and contact email</li>
            <li>Title of paper or panel</li>
            <li>Track selection (Track 1 or Track 2)</li>
            <li>5–7 keywords</li>
            <li>A brief biographical note (up to 100 words per presenter)</li>
          </ul>
        </div>

        {/* Important Dates */}
        <div className="cfp-block cfp-dates">
          <h3 className="cfp-block-title">Important Dates</h3>
          <div className="cfp-dates-grid">
            {importantDates.map((d) => (
              <div className="cfp-date-item" key={d.label}>
                <span className="cfp-date-label">{d.label}</span>
                <span className="cfp-date-value">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Portal CTA */}
        <div className="cfp-cta-row">
          <Link
            href="https://www.iwahs.org/congress/2026/submit-abstract"
            target="_blank"
            rel="noopener noreferrer"
            className="cfp-cta-btn"
          >
            Submission Portal →
          </Link>
        </div>

        {/* Publication Opportunities */}
        <div className="cfp-block cfp-pub">
          <h3 className="cfp-block-title">Publication Opportunities</h3>
          <p className="cfp-block-lead">
            Selected papers will be considered for publication in:
          </p>
          <ul className="cfp-pub-list">
            {pubOpportunities.map((pub) => (
              <li key={pub}>{pub}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
