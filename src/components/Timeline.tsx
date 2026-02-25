type Congress = { dates: string; submission_deadline: string; early_bird_deadline: string; venue: string; location: string };

export default function Timeline({ congress }: { congress: Congress }) {
  const dates = [
    { date: 'Jan 15', event: 'Call for Papers Opens', active: false },
    { date: congress.submission_deadline.replace(/, \d{4}$/, '').replace(/^[A-Za-z]+ /, (m) => m), event: 'Abstract Submission Deadline', active: true },
    { date: 'Apr 30', event: 'Acceptance Notifications', active: false },
    { date: congress.early_bird_deadline ? congress.early_bird_deadline.replace(/, \d{4}$/, '') : 'May 15', event: 'Early Bird Registration (20% off)', active: false },
    { date: congress.dates.replace(/, \d{4}$/, ''), event: `World Congress at ${congress.location}`, active: false },
  ];

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
