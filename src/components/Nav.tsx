'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Nav({ year }: { year: number }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, userType } = useAuth();

  const toggleAccountDropdown = () => {
    setAccountOpen(!accountOpen);
  };

  const closeAll = () => {
    setOpen(false);
    setAccountOpen(false);
  };

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
          <li><Link href="/" onClick={closeAll}>Home</Link></li>
          <li><a href={`/${year}#overview`} onClick={closeAll}>Overview</a></li>
          <li><a href={`/${year}#speakers`} onClick={closeAll}>Speakers</a></li>
          <li><a href={`/${year}#plenary`} onClick={closeAll}>Plenary Panel</a></li>
          <li><a href={`/${year}#tracks`} onClick={closeAll}>Tracks</a></li>
          <li><Link href={`/${year}/submissions-new`} onClick={closeAll}>Call for Papers</Link></li>
          <li><a href={`/${year}#dates`} onClick={closeAll}>Dates</a></li>
          <li><a href={`/${year}#venue`} onClick={closeAll}>Venue</a></li>
          <li><Link href={`/${year}/registration`} onClick={closeAll}>Register</Link></li>
          <li><Link href={`/${year}/past-congresses`} onClick={closeAll}>Past Congresses</Link></li>
          
          {/* Auth Submenu - Click to toggle */}
          <li className="nav-dropdown-parent">
            <button 
              className="nav-dropdown-trigger" 
              onClick={toggleAccountDropdown}
              aria-expanded={accountOpen}
            >
              {user ? `👤 ${user.email?.split('@')[0] || 'Account'}` : 'Account'}
              <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${accountOpen ? ' nav-dropdown-open' : ''}`}>
              {user ? (
                // Logged in
                <>
                  <li>
                    <Link 
                      href={userType === 'congress' ? '/congress/dashboard' : 
                            userType === 'wahs' ? '/wahs/dashboard' : 
                            '/admin'}
                      onClick={closeAll}
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
                        closeAll();
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
                    <Link href="/congress/submit-abstract" onClick={closeAll}>
                      Submit Abstract
                    </Link>
                  </li>
                  <li>
                    <Link href="/congress/login" onClick={closeAll}>
                      Congress Login
                    </Link>
                  </li>
                  
                  <li className="nav-dropdown-header">WAHS Membership</li>
                  <li>
                    <Link href="/membership" onClick={closeAll}>
                      Join WAHS
                    </Link>
                  </li>
                  <li>
                    <Link href="/wahs/login" onClick={closeAll}>
                      Member Login
                    </Link>
                  </li>
                  
                  <li className="nav-dropdown-header">Admin</li>
                  <li>
                    <Link href="/admin/login" onClick={closeAll}>
                      Admin Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>
        </ul>
      </div>

      {/* Click outside overlay */}
      {accountOpen && (
        <div 
          className="dropdown-overlay"
          onClick={() => setAccountOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 998,
            background: 'transparent'
          }}
        />
      )}
    </nav>
  );
}