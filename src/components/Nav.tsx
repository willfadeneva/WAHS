'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Nav({ year }: { year: number }) {
  const [open, setOpen] = useState(false);
  const [speakersOpen, setSpeakersOpen] = useState(false);
  const [venueOpen, setVenueOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const close = () => {
    setOpen(false);
    setSpeakersOpen(false);
    setVenueOpen(false);
    setAccountOpen(false);
  };

  return (
    <nav className="sticky-nav">
      <div className="sticky-nav-inner">
        <Link href={`/${year}`} className="sticky-nav-brand" onClick={close}>
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '80px', width: 'auto' }} />
        </Link>

        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
        </button>

        <ul className={`sticky-nav-links${open ? ' mobile-open' : ''}`}>

          {/* Home → WAHS home */}
          <li>
            <Link href="/" onClick={close}>Home</Link>
          </li>

          {/* Overview */}
          <li>
            <a href={`/${year}#overview`} onClick={close}>Overview</a>
          </li>

          {/* Speakers → Keynote Speakers | Plenary Panel */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setSpeakersOpen(true)}
              onMouseLeave={() => setSpeakersOpen(false)}>
            <button
              className={`nav-dropdown-trigger${pathname === `/${year}` ? ' active' : ''}`}
              onClick={() => setSpeakersOpen(!speakersOpen)}
            >
              Speakers <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${speakersOpen ? ' nav-dropdown-open' : ''}`}>
              <li><a href={`/${year}#speakers`} onClick={close}>Keynote Speakers</a></li>
              <li><a href={`/${year}#plenary`} onClick={close}>Plenary Panel</a></li>
            </ul>
          </li>

          {/* Tracks */}
          <li>
            <a href={`/${year}#tracks`} onClick={close}>Tracks</a>
          </li>

          {/* Venue & Dates → Venue | Key Dates */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setVenueOpen(true)}
              onMouseLeave={() => setVenueOpen(false)}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => setVenueOpen(!venueOpen)}
            >
              Venue &amp; Dates <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${venueOpen ? ' nav-dropdown-open' : ''}`}>
              <li><a href={`/${year}#venue`} onClick={close}>Venue</a></li>
              <li><a href={`/${year}#dates`} onClick={close}>Key Dates</a></li>
            </ul>
          </li>

          {/* Register & Pay → Register */}
          <li>
            <Link
              href={`/${year}/registration`}
              className={pathname?.includes('/registration') ? 'active' : ''}
              onClick={close}
            >
              Register
            </Link>
          </li>

          {/* Past Congresses */}
          <li>
            <Link href={`/${year}/past-congresses`} onClick={close}>Past Congresses</Link>
          </li>

          {/* My Account → My Submissions | Sign In / Create Account (or Sign Out) */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}>
            <button
              className={`nav-dropdown-trigger${(pathname?.includes(`/${year}/dashboard`) || pathname?.includes(`/${year}/submit`)) ? ' active' : ''}`}
              onClick={() => setAccountOpen(!accountOpen)}
            >
              My Account <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${accountOpen ? ' nav-dropdown-open' : ''}`}>
              <li>
                <Link href={`/${year}/dashboard`} onClick={close}>My Submissions</Link>
              </li>
              {user ? (
                <li>
                  <button
                    onClick={async () => { await supabase.auth.signOut(); close(); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 20px', width: '100%', textAlign: 'left', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit' }}
                  >
                    Sign Out
                  </button>
                </li>
              ) : (
                <>
                  <li><Link href={`/${year}/login`} onClick={close}>Sign In</Link></li>
                  <li><Link href={`/${year}/register`} onClick={close}>Create Account</Link></li>
                </>
              )}
            </ul>
          </li>

        </ul>
      </div>
    </nav>
  );
}
