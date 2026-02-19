type Publication = { badge: string; badge_class: string; title: string; desc: string };

export default function Publications({ publications }: { publications: Publication[] }) {
  return (
    <section className="publications" id="publications">
      <div className="section-inner reveal">
        <span className="section-label">After the Congress</span>
        <h2 className="section-title">Publication Opportunities</h2>
        <p className="section-lead">Selected papers will be considered for publication across four prestigious outlets.</p>
        <div className="pub-grid">
          {publications.map((p, i) => (
            <div className="pub-card" key={i}>
              <span className={`pub-badge ${p.badge_class}`}>{p.badge}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
