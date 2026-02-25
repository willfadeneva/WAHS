'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function CongressNav({ year }: { year: string | number }) {
  const yr = String(year);
  const [open, setOpen] = useState(false);
  const [speakersOpen, setSpeakersOpen] = useState(false);
  const [venueOpen, setVenueOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  async function handleSignOut() {
    await supabase.auth.signOut();
    close();
    router.push(`/congress/${yr}/login`);
  }

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">
        <Link href={`/${yr}`} className="main-nav-brand" onClick={close}>
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '80px', width: 'auto' }} />
        </Link>

        <button
          className={`main-nav-toggle ${open ? 'active' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <ul className={`main-nav-links ${open ? 'active' : ''}`}>

          {/* Home → WAHS home */}
          <li>
            <Link href="/" onClick={close}>Home</Link>
          </li>

          {/* Overview */}
          <li>
            <a href={`/${yr}#overview`} onClick={close}>Overview</a>
          </li>

          {/* Speakers → Keynote Speakers | Plenary Panel */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setSpeakersOpen(true)}
              onMouseLeave={() => setSpeakersOpen(false)}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => setSpeakersOpen(!speakersOpen)}
            >
              Speakers <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${speakersOpen ? ' nav-dropdown-open' : ''}`}>
              <li><a href={`/${yr}#speakers`} onClick={close}>Keynote Speakers</a></li>
              <li><a href={`/${yr}#plenary`} onClick={close}>Plenary Panel</a></li>
            </ul>
          </li>

          {/* Tracks */}
          <li>
            <a href={`/${yr}#tracks`} onClick={close}>Tracks</a>
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
              <li><a href={`/${yr}#venue`} onClick={close}>Venue</a></li>
              <li><a href={`/${yr}#dates`} onClick={close}>Key Dates</a></li>
            </ul>
          </li>

          {/* Register & Pay */}
          <li>
            <Link href={`/${yr}/registration`} onClick={close}>Register</Link>
          </li>

          {/* Past Congresses */}
          <li>
            <Link href={`/${yr}/past-congresses`} onClick={close}>Past Congresses</Link>
          </li>

          {/* My Account */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}>
            <button
              className={`nav-dropdown-trigger${pathname?.startsWith(`/congress/${yr}`) ? ' active' : ''}`}
              onClick={() => setAccountOpen(!accountOpen)}
            >
              My Account <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${accountOpen ? ' nav-dropdown-open' : ''}`}>
              <li>
                <Link href={`/congress/${yr}/dashboard`} onClick={close}>My Submissions</Link>
              </li>
              {user ? (
                <li>
                  <button
                    onClick={handleSignOut}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 20px', width: '100%', textAlign: 'left', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit' }}
                  >
                    Sign Out
                  </button>
                </li>
              ) : (
                <>
                  <li><Link href={`/congress/${yr}/login`} onClick={close}>Sign In</Link></li>
                  <li><Link href={`/congress/${yr}/register`} onClick={close}>Create Account</Link></li>
                </>
              )}
            </ul>
          </li>

        </ul>
      </div>
    </nav>
  );
}
