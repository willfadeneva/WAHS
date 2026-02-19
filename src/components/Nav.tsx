'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Nav({ year }: { year: number }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky-nav">
      <div className="sticky-nav-inner">
        <Link href={`/${year}`} className="sticky-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '52px', width: 'auto' }} />
        </Link>
        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
        </button>
        <ul className={`sticky-nav-links${open ? ' mobile-open' : ''}`}>
          <li><a href={`/${year}#overview`} onClick={() => setOpen(false)}>Overview</a></li>
          <li><a href={`/${year}#speakers`} onClick={() => setOpen(false)}>Speakers</a></li>
          <li><a href={`/${year}#tracks`} onClick={() => setOpen(false)}>Tracks</a></li>
          <li><Link href={`/${year}/submissions`} onClick={() => setOpen(false)}>Call for Papers</Link></li>
          <li><a href={`/${year}#dates`} onClick={() => setOpen(false)}>Dates</a></li>
          <li><a href={`/${year}#venue`} onClick={() => setOpen(false)}>Venue</a></li>
          <li><Link href={`/${year}/registration`} onClick={() => setOpen(false)}>Register</Link></li>
        </ul>
      </div>
    </nav>
  );
}
