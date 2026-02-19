const track1 = ['Platform capitalism', 'Digital circulation', 'Gender politics', 'Female universalism', 'Production systems', 'Business models', 'Fandom practices', 'Participatory culture', 'Postcolonial positioning', 'Transmedia storytelling', 'IP management', 'Comparative cases', 'Methodological innovations'];
const track2 = ['K-pop', 'K-drama', 'Film', 'Webtoons', 'Gaming', 'Regional reception', 'Language learning', 'Cultural policy', 'Soft power', 'Tourism', 'Place branding', 'Consumption practices', 'Authenticity', 'Cultural translation'];

export default function Tracks() {
  return (
    <section className="tracks" id="tracks">
      <div className="section-inner reveal">
        <span className="section-label">Research Tracks</span>
        <h2 className="section-title">Two Tracks, Infinite Perspectives</h2>
        <p className="section-lead">Whether you&apos;re advancing theoretical frameworks or exploring specific facets of the Korean Wave, there&apos;s a track for your research.</p>
        <div className="track-container">
          <div className="track-block">
            <div className="track-number">01</div>
            <h3>Cultural Dynamism</h3>
            <div className="track-subtitle">Annual Theme</div>
            <ul className="track-topics">
              {track1.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div className="track-block">
            <div className="track-number">02</div>
            <h3>Open Topics</h3>
            <div className="track-subtitle">Hallyu Studies</div>
            <ul className="track-topics">
              {track2.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
