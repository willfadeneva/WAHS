const dates = [
  { date: 'Jan 15', event: 'Call for Papers Opens', active: false },
  { date: 'Apr 15', event: 'Abstract Submission Deadline', active: true },
  { date: 'Apr 30', event: 'Acceptance Notifications', active: false },
  { date: 'May 15', event: 'Early Bird Registration (20% off)', active: false },
  { date: 'May 28–30', event: 'World Congress at Jeju Island', active: false },
];

export default function Timeline() {
  return (
    <section className="timeline-section" id="dates">
      <div className="section-inner reveal">
        <span className="section-label">Key Dates</span>
        <h2 className="section-title">Important Deadlines</h2>
        <div className="timeline">
          {dates.map((d, i) => (
            <div className={`timeline-item${d.active ? ' active' : ''}`} key={i}>
              <div className="timeline-date">{d.date}</div>
              <div className="timeline-event">{d.event}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
