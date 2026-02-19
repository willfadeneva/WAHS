const frameworks = [
  { icon: '⚡', title: 'Platform Capitalism', desc: 'Institutional-rational mechanisms driving digital circulation and content distribution at global scale.' },
  { icon: '🌐', title: 'Historical Structures', desc: 'Postcolonial positioning, geopolitical contexts, and the structural conditions enabling cultural export.' },
  { icon: '💫', title: 'Affective Dynamics', desc: 'Fandom practices, participatory culture, and the emotional architectures of global cultural consumption.' },
  { icon: '🔀', title: 'Transmedia Flows', desc: 'Storytelling across platforms, IP management, and the transnational circulation of cultural content.' },
  { icon: '♀', title: 'Gender Politics', desc: 'Female universalism, gendered production and consumption, and the politics of representation.' },
  { icon: '🗺️', title: 'Geopolitical Discourse', desc: 'Soft power formations, cultural diplomacy, and the discursive framing of cultural globalization.' },
];

export default function Overview() {
  return (
    <section className="overview" id="overview">
      <div className="section-inner reveal">
        <span className="section-label">Conference Overview</span>
        <h2 className="section-title">Mapping the Forces Behind<br/>Global Pop Culture</h2>
        <p className="section-lead">The Korean Wave presents the paradigmatic case for a universal theory of pop culture success: the first postcolonial pop culture to achieve sustained global dominance in the platform capitalism age. This congress proposes <strong>Cultural Dynamism</strong> as a unifying framework.</p>
        <div className="framework-grid">
          {frameworks.map((f, i) => (
            <div className="framework-card" key={i}>
              <div className="framework-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
