export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-watermark">한류</div>
      <div className="wave-bg">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d="M0,150 C360,250 720,50 1080,150 C1260,200 1350,180 1440,150 L1440,300 L0,300 Z" fill="white"/>
          <path d="M0,180 C360,100 720,280 1080,180 C1260,130 1350,150 1440,180 L1440,300 L0,300 Z" fill="white" opacity="0.5"/>
        </svg>
      </div>
      <div className="hero-content">
        <div className="hero-eyebrow">World Association for Hallyu Studies</div>
        <h1 className="hero-title">World Congress for<br/><em>Hallyu Studies</em> 2026</h1>
        <p className="hero-subtitle">Cultural Dynamism in the Digital Age — Toward a Universal Theory of Pop Culture Globalization</p>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Dates</span>
            <span className="hero-meta-value">May 28–30, 2026</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Venue</span>
            <span className="hero-meta-value">Cheju Halla University</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Location</span>
            <span className="hero-meta-value">Jeju Island, South Korea</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Deadline</span>
            <span className="hero-meta-value">April 15, 2026</span>
          </div>
        </div>
        <div className="hero-cta">
          <a href="#submissions" className="btn-primary">Submit Abstract →</a>
          <a href="#tracks" className="btn-outline">Explore Tracks</a>
        </div>
        <div className="hero-video">
          <div className="hero-video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/72-GBLfTxEQ?rel=0&modestbranding=1"
              title="WAHS 2026 Congress"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
