'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Nav({ year }: { year: number }) {
  const [open, setOpen] = useState(false);
  const { user, userType } = useAuth();

  return (
    <nav className="sticky-nav">
      <div className="sticky-nav-inner">
        <Link href={`/${year}`} className="sticky-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '80px', width: 'auto' }} />
        </Link>
        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
          <span className={`nav-hamburger-line${open ? ' open' : ''}`} />
        </button>
        <ul className={`sticky-nav-links${open ? ' mobile-open' : ''}`}>
          <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
          <li><a href={`/${year}#overview`} onClick={() => setOpen(false)}>Overview</a></li>
          <li><a href={`/${year}#speakers`} onClick={() => setOpen(false)}>Speakers</a></li>
          <li><a href={`/${year}#plenary`} onClick={() => setOpen(false)}>Plenary Panel</a></li>
          <li><a href={`/${year}#tracks`} onClick={() => setOpen(false)}>Tracks</a></li>
          <li><Link href={`/${year}/submissions-new`} onClick={() => setOpen(false)}>Call for Papers</Link></li>
          <li><a href={`/${year}#dates`} onClick={() => setOpen(false)}>Dates</a></li>
          <li><a href={`/${year}#venue`} onClick={() => setOpen(false)}>Venue</a></li>
          <li><Link href={`/${year}/registration`} onClick={() => setOpen(false)}>Register</Link></li>
          <li><Link href={`/${year}/past-congresses`} onClick={() => setOpen(false)}>Past Congresses</Link></li>
          
          {/* Auth Submenu */}
          <li className="nav-dropdown">
            <span className="nav-dropdown-toggle">
              {user ? `👤 ${user.email?.split('@')[0] || 'Account'}` : 'Account'}
            </span>
            <ul className="nav-dropdown-menu">
              {user ? (
                // Logged in
                <>
                  <li>
                    <Link 
                      href={userType === 'congress' ? '/congress/dashboard' : 
                            userType === 'wahs' ? '/wahs/dashboard' : 
                            '/admin'}
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        // Sign out logic will be added
                        setOpen(false);
                      }}
                    >
                      Sign Out
                    </Link>
                  </li>
                </>
              ) : (
                // Not logged in
                <>
                  <li className="nav-dropdown-header">Congress 2026</li>
                  <li>
                    <Link href="/congress/submit-abstract" onClick={() => setOpen(false)}>
                      Submit Abstract
                    </Link>
                  </li>
                  <li>
                    <Link href="/congress/login" onClick={() => setOpen(false)}>
                      Congress Login
                    </Link>
                  </li>
                  
                  <li className="nav-dropdown-header">WAHS Membership</li>
                  <li>
                    <Link href="/wahs/register" onClick={() => setOpen(false)}>
                      Join WAHS
                    </Link>
                  </li>
                  <li>
                    <Link href="/wahs/login" onClick={() => setOpen(false)}>
                      Member Login
                    </Link>
                  </li>
                  
                  <li className="nav-dropdown-header">Admin</li>
                  <li>
                    <Link href="/admin/login" onClick={() => setOpen(false)}>
                      Admin Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
