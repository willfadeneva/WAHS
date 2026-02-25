type Congress = { venue: string; location: string };

export default function Venue({ congress }: { congress: Congress }) {
  return (
    <section className="venue" id="venue">
      <div className="section-inner reveal">
        <span className="section-label">Conference Venue</span>
        <h2 className="section-title">{congress.location}</h2>
        <div className="venue-layout">
          <div className="venue-visual" style={{ backgroundImage: 'url(/venue/jeju-coast.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="venue-visual-text">
              <h3><a href="https://hcc.chu.ac.kr/page/main/index.php" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>{congress.venue}</a></h3>
              <p>UNESCO World Heritage Site</p>
            </div>
          </div>
          <div className="venue-info">
            <h3>A Unique Setting for Academic Exchange</h3>
            <p>Jeju Island, a UNESCO World Heritage Site, offers a breathtaking conference setting with stunning natural beauty, volcanic landscapes, and distinctive island culture. World-class facilities at {congress.venue} provide an ideal environment for scholarly dialogue.</p>
            <p>Accommodation options range from university dormitories to resort hotels, with discounted rates available for all participants.</p>
            <div>
              <span className="venue-highlight">UNESCO Heritage</span>
              <span className="venue-highlight">Volcanic Landscapes</span>
              <span className="venue-highlight">Island Culture</span>
              <span className="venue-highlight">Resort Accommodation</span>
            </div>
            <a href="https://hcc.chu.ac.kr/page/main/index.php" target="_blank" rel="noopener noreferrer" className="venue-btn">
              Visit Venue Website →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
