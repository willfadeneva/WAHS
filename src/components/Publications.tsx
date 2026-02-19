const pubs = [
  { badge: 'indexed', badgeText: 'A&HCI Indexed', title: 'SOCIÉTÉS', desc: 'Special issue in this peer-reviewed, Arts & Humanities Citation Index journal.' },
  { badge: 'flagship', badgeText: 'Flagship Journal', title: 'HALLYU', desc: 'Special issue in the WAHS flagship journal dedicated to Korean Wave scholarship.' },
  { badge: 'press', badgeText: 'Academic Press', title: 'BRILL Volume', desc: 'Edited volume with Brill, a leading international academic publisher.' },
  { badge: 'open', badgeText: 'Open Access', title: 'Congress Proceedings', desc: 'WAHS Congress Proceedings — open access publication for all accepted papers.' },
];

export default function Publications() {
  return (
    <section className="publications" id="publications">
      <div className="section-inner reveal">
        <span className="section-label">After the Congress</span>
        <h2 className="section-title">Publication Opportunities</h2>
        <p className="section-lead">Selected papers will be considered for publication across four prestigious outlets.</p>
        <div className="pub-grid">
          {pubs.map((p, i) => (
            <div className="pub-card" key={i}>
              <span className={`pub-badge ${p.badge}`}>{p.badgeText}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
