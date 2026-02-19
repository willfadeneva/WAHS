export default function Venue() {
  return (
    <section className="venue" id="venue">
      <div className="section-inner reveal">
        <span className="section-label">Conference Venue</span>
        <h2 className="section-title">Jeju Island, South Korea</h2>
        <div className="venue-layout">
          <div className="venue-visual">
            <div className="venue-visual-text">
              <h3>Cheju Halla University</h3>
              <p>UNESCO World Heritage Site</p>
            </div>
          </div>
          <div className="venue-info">
            <h3>A Unique Setting for Academic Exchange</h3>
            <p>Jeju Island, a UNESCO World Heritage Site, offers a breathtaking conference setting with stunning natural beauty, volcanic landscapes, and distinctive island culture. World-class facilities at Cheju Halla University provide an ideal environment for scholarly dialogue.</p>
            <p>Accommodation options range from university dormitories to resort hotels, with discounted rates available for all participants.</p>
            <div>
              <span className="venue-highlight">UNESCO Heritage</span>
              <span className="venue-highlight">Volcanic Landscapes</span>
              <span className="venue-highlight">Island Culture</span>
              <span className="venue-highlight">Resort Accommodation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
