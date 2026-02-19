import Link from 'next/link';

export default function Nav({ year }: { year: number }) {
  return (
    <nav className="sticky-nav">
      <div className="sticky-nav-inner">
        <Link href={`/${year}`} className="sticky-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '32px', width: 'auto' }} />
          WAHS {year}
        </Link>
        <ul className="sticky-nav-links">
          <li><a href={`/${year}#overview`}>Overview</a></li>
          <li><a href={`/${year}#speakers`}>Speakers</a></li>
          <li><a href={`/${year}#tracks`}>Tracks</a></li>
          <li><Link href={`/${year}/submissions`}>Submit</Link></li>
          <li><a href={`/${year}#dates`}>Dates</a></li>
          <li><a href={`/${year}#venue`}>Venue</a></li>
          <li><Link href={`/${year}/registration`}>Register</Link></li>
        </ul>
      </div>
    </nav>
  );
}
