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

function getSpeakerImage(s: Speaker): string | null {
  return s.image_url || SPEAKER_PHOTOS[s.name] || null;
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Speakers({ speakers }: { speakers: Speaker[] }) {
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
          <div className="plenary-header-text">
            <div className="plenary-title">✨ Special Plenary Session ✨</div>
            <div className="plenary-subtitle">From Script to Screen: Pop Culture Production &amp; Storytelling</div>
            <div className="plenary-featuring">Featuring:</div>
          </div>
          <div className="plenary-grid">
            {plenary.map((s) => (
              <div className="plenary-person" key={s.id}>
                <div className="plenary-photo">
                  {getSpeakerImage(s) ? (
                    <img src={getSpeakerImage(s)!} alt={s.name} />
                  ) : (
                    <div className="plenary-img-placeholder-lg">{getInitials(s.name)}</div>
                  )}
                </div>
                <div className="plenary-info">
                  <div className="plenary-name">{s.name}</div>
                  <div className="plenary-affil">{s.affiliation}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
