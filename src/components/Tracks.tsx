type Track = { number: string; title: string; subtitle: string; topics: string[] };

export default function Tracks({ tracks }: { tracks: Track[] }) {
  return (
    <section className="tracks" id="tracks">
      <div className="section-inner reveal">
        <span className="section-label">Research Tracks</span>
        <h2 className="section-title">{tracks.length} Tracks, Infinite Perspectives</h2>
        <p className="section-lead">Whether you&apos;re advancing theoretical frameworks or exploring specific facets of the Korean Wave, there&apos;s a track for your research.</p>
        <div className="track-container">
          {tracks.map((track, i) => (
            <div className="track-block" key={i}>
              <div className="track-number">{track.number}</div>
              <h3>{track.title}</h3>
              <div className="track-subtitle">{track.subtitle}</div>
              <ul className="track-topics">
                {track.topics.map((t, j) => <li key={j}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
