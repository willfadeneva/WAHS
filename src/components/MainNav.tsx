'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [congressOpen, setCongressOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const pathname = usePathname();
  const { user, userType } = useAuth();

  const isActive = (href: string) => pathname === href;
  const isAboutActive = pathname?.includes('/history') || pathname?.includes('/board-members');
  const isCongressActive = pathname === '/2026';

  // Close all dropdowns when clicking outside
  const closeAllDropdowns = () => {
    setAboutOpen(false);
    setCongressOpen(false);
    setMembershipOpen(false);
  };

  // Toggle dropdowns (only one open at a time)
  const toggleDropdown = (dropdown: 'about' | 'congress' | 'membership') => {
    if (dropdown === 'about') {
      setAboutOpen(!aboutOpen);
      setCongressOpen(false);
      setMembershipOpen(false);
    } else if (dropdown === 'congress') {
      setCongressOpen(!congressOpen);
      setAboutOpen(false);
      setMembershipOpen(false);
    } else if (dropdown === 'membership') {
      setMembershipOpen(!membershipOpen);
      setAboutOpen(false);
      setCongressOpen(false);
    }
  };

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">
        <Link href="/" className="main-nav-brand">
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '80px', width: 'auto' }} />
        </Link>
        
        <button 
          className={`main-nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            closeAllDropdowns();
          }}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`main-nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link href="/" className={isActive('/') ? 'active' : ''} onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Home</Link></li>
          
          {/* About Dropdown */}
          <li className="nav-dropdown-parent">
            <button 
              className={`nav-dropdown-trigger${isAboutActive ? ' active' : ''}`} 
              onClick={() => toggleDropdown('about')}
              aria-expanded={aboutOpen}
            >
              About <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${aboutOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/2026/history" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>History</Link></li>
              <li><Link href="/2026/board-members" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Board Members</Link></li>
            </ul>
          </li>
          
          {/* Congress Dropdown */}
          <li className="nav-dropdown-parent">
            <button 
              className={`nav-dropdown-trigger${isCongressActive ? ' active' : ''}`} 
              onClick={() => toggleDropdown('congress')}
              aria-expanded={congressOpen}
            >
              Congress <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${congressOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/2026" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>2026 Congress</Link></li>
            </ul>
          </li>
          
          <li><Link href="/2026/submissions" className={pathname?.includes('/submissions') ? 'active' : ''} onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Call for Papers</Link></li>
          
          {/* Membership Dropdown */}
          <li className="nav-dropdown-parent">
            <button 
              className={`nav-dropdown-trigger${isActive('/membership') ? ' active' : ''}`} 
              onClick={() => toggleDropdown('membership')}
              aria-expanded={membershipOpen}
            >
              Membership <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${membershipOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/membership" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Join WAHS</Link></li>
              <li><Link href="/wahs/login" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Member Login</Link></li>
              {user && userType === 'wahs' && (
                <>
                  <li className="nav-dropdown-divider"></li>
                  <li><Link href="/wahs/dashboard" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Dashboard</Link></li>
                  <li><Link href="/wahs/profile" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Profile</Link></li>
                  <li><Link href="/wahs/members" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Member Directory</Link></li>
                  <li className="nav-dropdown-divider"></li>
                  <li><Link href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); closeAllDropdowns(); /* Add sign out logic */ }}>Logout</Link></li>
                </>
              )}
            </ul>
          </li>
          
          <li><a href="#contact" onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>Contact</a></li>
          
          {/* Congress Auth Link (separate) */}
          <li>
            <Link href="/congress/login" className={isActive('/congress/login') ? 'active' : ''} onClick={() => { setIsMenuOpen(false); closeAllDropdowns(); }}>
              Submit Abstract
            </Link>
          </li>
        </ul>
      </div>

      {/* Click outside overlay to close dropdowns */}
      {(aboutOpen || congressOpen || membershipOpen) && (
        <div 
          className="dropdown-overlay"
          onClick={closeAllDropdowns}
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