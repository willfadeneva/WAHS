const frameworks = [
  { icon: '⚡', title: 'Platform Capitalism', desc: 'Institutional-rational mechanisms driving digital circulation and content distribution at global scale.' },
  { icon: '🌐', title: 'Historical Structures', desc: 'Postcolonial positioning, geopolitical contexts, and the structural conditions enabling cultural export.' },
  { icon: '💫', title: 'Affective Dynamics', desc: 'Fandom practices, participatory culture, and the emotional architectures of global cultural consumption.' },
  { icon: '🔀', title: 'Transmedia Flows', desc: 'Storytelling across platforms, IP management, and the transnational circulation of cultural content.' },
  { icon: '♀', title: 'Gender Politics', desc: 'Female universalism, gendered production and consumption, and the politics of representation.' },
  { icon: '🗺️', title: 'Geopolitical Discourse', desc: 'Soft power formations, cultural diplomacy, and the discursive framing of cultural globalization.' },
];

type Congress = { subtitle: string };

export default function Overview({ congress }: { congress: Congress }) {
  return (
    <section className="overview" id="overview">
      <div className="section-inner reveal">
        <span className="section-label">Conference Overview</span>
        <h2 className="section-title">Mapping the Forces Behind<br/>Global Pop Culture</h2>
        <p className="section-lead">The World Association for Hallyu Studies (WAHS) invites submissions for its 2026 World Congress, which seeks to develop a universal theory of pop culture success in the digital platform era. The Korean Wave presents the paradigmatic case for this theoretical project: the first postcolonial pop culture to achieve sustained global dominance in the platform capitalism age. This congress proposes <strong>CULTURAL DYNAMISM</strong> as a framework operating at the intersection of institutional-rational mechanisms, historical-structural conditions, affective-cultural dynamics, geopolitical-discursive formations, transnational/transmedia culturalism, and gender politics.</p>
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
