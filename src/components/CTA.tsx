type Congress = { submission_deadline: string; location: string };

export default function CTA({ congress, year }: { congress: Congress; year: number }) {
  return (
    <section className="cta-section">
      <div className="section-inner reveal">
        <span className="section-label">Join Us</span>
        <h2 className="section-title">Shape the Future of Hallyu Studies in {congress.location.split(',')[0]}</h2>
        <p>Submit your abstract by {congress.submission_deadline} and join scholars from around the world at this landmark congress.</p>
        <a href={`/congress/${year}/submissions`} className="btn-primary">Submit Your Abstract →</a>
        <a href={`/congress/${year}/registration`} className="btn-outline cta-register-btn">Register →</a>
        <div className="cta-hashtags">
          <span>#WAHS{year}</span>
          <span>#HallyuStudies</span>
          <span>#JejuCongress</span>
        </div>
      </div>
    </section>
  );
}
