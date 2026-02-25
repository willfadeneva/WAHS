type Speaker = {
  id: string; name: string; role: string; affiliation: string;
  image_url: string; is_plenary: boolean;
};

const SPEAKER_PHOTOS: Record<string, string> = {
  'Henry Jenkins': '/speakers/henry-jenkins.jpg',
  'Jieun Kiaer': '/speakers/jieun-kiaer.jpg',
  'Roald Maliangkay': '/speakers/roald-maliangkay.jpg',
  'Ingyu Oh': '/speakers/ingyu-oh.jpg',
  'Rob Kutner': '/speakers/rob-kutner.jpg',
  'Marlene Sharp': '/speakers/marlene-sharp.jpg',
};

const PHOTO_POSITION: Record<string, string> = {
  'Marlene Sharp': 'center 25%',
  'Rob Kutner': 'center 25%',
};

const PHOTO_SCALE: Record<string, string> = {
  'Marlene Sharp': '0.85',
};

function getSpeakerImage(s: Speaker): string | null {
  return s.image_url || SPEAKER_PHOTOS[s.name] || null;
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Speakers({ speakers }: { speakers: Speaker[] }) {
  // DB: is_plenary=false → keynote speakers; is_plenary=true → plenary panel (Rob Kutner, Marlene Sharp)
  const keynotes = speakers.filter(s => !s.is_plenary);
  const plenary = speakers.filter(s => s.is_plenary);

  return (
    <>
      <section className="speakers" id="speakers">
        <div className="section-inner reveal">
          <span className="section-label">Keynote Speakers</span>
          <h2 className="section-title">Distinguished Speakers</h2>
          <p className="section-lead">Leading voices in media studies, Korean linguistics, Hallyu scholarship, and pop culture production.</p>
          <div className="speaker-grid">
            {keynotes.map((s) => (
              <div className="speaker-card" key={s.id}>
                <div className="speaker-img-wrap">
                  {getSpeakerImage(s) ? (
                    <img src={getSpeakerImage(s)!} alt={s.name} />
                  ) : (
                    <div className="speaker-img-placeholder-lg">{getInitials(s.name)}</div>
                  )}
                </div>
                <div className="speaker-card-body">
                  <div className="speaker-role">{s.role}</div>
                  <div className="speaker-name">{s.name}</div>
                  <div className="speaker-affil">{s.affiliation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {plenary.length > 0 && (
        <section className="plenary-section" id="plenary">
          {/* Animated particles */}
          <div className="plenary-particles">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>
          {/* Top accent */}
          <div className="plenary-spotlight-bar" />

          <div className="plenary-header-text">
            <div className="plenary-star-row">★ ★ ★</div>
            <div className="plenary-badge">Special Plenary Session</div>
            <h2 className="plenary-subtitle">From Script to Screen</h2>
            <div className="plenary-subtitle-sub">Pop Culture Production &amp; Storytelling</div>
            <div className="plenary-featuring-line"><span /></div>
          </div>

          <div className="plenary-stage">
            {plenary.map((s) => (
              <div className="plenary-card" key={s.id}>
                <div className="plenary-card-shimmer" />
                <div className="plenary-photo-wrap">
                  <div className="plenary-photo-ring" />
                  <div className="plenary-photo">
                    {getSpeakerImage(s) ? (
                      <img src={getSpeakerImage(s)!} alt={s.name} style={{ ...(PHOTO_POSITION[s.name] ? { objectPosition: PHOTO_POSITION[s.name] } : {}), ...(PHOTO_SCALE[s.name] ? { transform: `scale(${PHOTO_SCALE[s.name]})` } : {}) }} />
                    ) : (
                      <div className="plenary-img-placeholder-lg">{getInitials(s.name)}</div>
                    )}
                  </div>
                </div>
                <div className="plenary-card-body">
                  <div className="plenary-name">{s.name}</div>
                  <div className="plenary-affil">{s.affiliation}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="plenary-footer-text">
            <div className="plenary-star-row small">✦ ✦ ✦ ✦ ✦</div>
          </div>
        </section>
      )}
    </>
  );
}
