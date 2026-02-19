export default function Nav() {
  return (
    <nav className="sticky-nav">
      <div className="sticky-nav-inner">
        <a href="#top" className="sticky-nav-brand">WAHS 2026</a>
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
