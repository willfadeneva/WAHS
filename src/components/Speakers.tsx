const keynotes = [
  { initials: 'HJ', name: 'Henry Jenkins', role: 'Keynote', affiliation: 'Provost Professor of Communication, Journalism, Cinematic Arts and Education — University of Southern California' },
  { initials: 'JK', name: 'Jieun Kiaer', role: 'Keynote', affiliation: 'Young Bin Min-KF Professor of Korean Linguistics — University of Oxford' },
  { initials: 'RM', name: 'Roald Maliangkay', role: 'Keynote', affiliation: 'Professor, School of Culture, History and Language — Australian National University' },
  { initials: 'IO', name: 'Ingyu Oh', role: 'Keynote', affiliation: 'Professor, Kansai Gaidai University & Ex-President, World Association for Hallyu Studies' },
];

const plenary = [
  { initials: 'RK', name: 'Rob Kutner', role: 'Panelist', affiliation: '5-time Emmy Award Winner — Comedy writer-producer (The Daily Show, Conan, Teen Titans Go!)' },
  { initials: 'MS', name: 'Marlene Sharp', role: 'Panelist', affiliation: 'Producer — Sonic Boom, Z-Squad, Pink Poodle Productions' },
];

export default function Speakers() {
  return (
    <section className="speakers" id="speakers">
      <div className="section-inner reveal">
        <span className="section-label">Keynote &amp; Plenary</span>
        <h2 className="section-title">Distinguished Speakers</h2>
        <p className="section-lead">Leading voices in media studies, Korean linguistics, Hallyu scholarship, and pop culture production.</p>
        <div className="speaker-grid">
          {keynotes.map((s, i) => (
            <div className="speaker-card" key={i}>
              <div className="speaker-img-wrap">
                <div className="speaker-img-placeholder-lg">{s.initials}</div>
              </div>
              <div className="speaker-card-body">
                <div className="speaker-role">{s.role}</div>
                <div className="speaker-name">{s.name}</div>
                <div className="speaker-affil">{s.affiliation}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="plenary-card">
          <div className="plenary-header">
            <div className="plenary-title">✨ Special Plenary Session</div>
            <div className="plenary-subtitle">From Script to Screen: Pop Culture Production &amp; Storytelling</div>
          </div>
          {plenary.map((s, i) => (
            <div className="plenary-speaker" key={i}>
              <div className="plenary-img-wrap">
                <div className="plenary-img-placeholder-lg">{s.initials}</div>
              </div>
              <div className="plenary-speaker-body">
                <div className="speaker-role">{s.role}</div>
                <div className="speaker-name">{s.name}</div>
                <div className="speaker-affil">{s.affiliation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
