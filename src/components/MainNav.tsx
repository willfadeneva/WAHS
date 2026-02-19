'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">
        <Link href="/" className="main-nav-brand">
          <Image 
            src="/wahs-logo.png" 
            alt="WAHS" 
            width={52} 
            height={52}
            className="main-nav-logo"
          />
        </Link>
        
        <button 
          className={`main-nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`main-nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link href="/">Home</Link></li>
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}>
            <button className="nav-dropdown-trigger" onClick={() => setAboutOpen(!aboutOpen)}>
              About <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${aboutOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/2026/history" onClick={() => { setIsMenuOpen(false); setAboutOpen(false); }}>History</Link></li>
              <li><Link href="/2026/board-members" onClick={() => { setIsMenuOpen(false); setAboutOpen(false); }}>Board Members</Link></li>
            </ul>
          </li>
          <li><Link href="/membership">Membership</Link></li>
          <li><Link href="/2026" className="main-nav-congress">2026 Congress</Link></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
