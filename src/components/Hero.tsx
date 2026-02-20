type Congress = {
  year: number; title: string; subtitle: string; dates: string;
  venue: string; location: string; submission_deadline: string; video_url: string;
};

export default function Hero({ congress }: { congress: Congress }) {
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
        <h1 className="hero-title">12th World Congress for<br/><em>Hallyu Studies</em> {congress.year}</h1>
        <p className="hero-subtitle">{congress.subtitle}</p>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Dates</span>
            <span className="hero-meta-value">{congress.dates}</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Venue</span>
            <span className="hero-meta-value">{congress.venue}</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Location</span>
            <span className="hero-meta-value">{congress.location}</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Deadline</span>
            <span className="hero-meta-value">{congress.submission_deadline}</span>
          </div>
        </div>
        <div className="hero-cta">
          <a href="#submissions" className="btn-primary">Submit Abstract →</a>
          <a href="#tracks" className="btn-outline">Explore Tracks</a>
        </div>
        {congress.video_url && (
          <div className="hero-video">
            <div className="hero-video-wrapper">
              <iframe
                src={congress.video_url}
                title={`WAHS ${congress.year} Congress`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
