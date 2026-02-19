export default function Nav({ year }: { year: number }) {
  return (
    <nav className="sticky-nav">
      <div className="sticky-nav-inner">
        <a href="#top" className="sticky-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '32px', width: 'auto' }} />
          WAHS {year}
        </a>
        <ul className="sticky-nav-links">
          <li><a href="#overview">Overview</a></li>
          <li><a href="#speakers">Speakers</a></li>
          <li><a href="#tracks">Tracks</a></li>
          <li><a href="#submissions">Submit</a></li>
          <li><a href="#dates">Dates</a></li>
          <li><a href="#venue">Venue</a></li>
          <li><a href="#registration">Register</a></li>
        </ul>
      </div>
    </nav>
  );
}
