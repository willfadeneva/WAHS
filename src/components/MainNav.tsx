'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [congressOpen, setCongressOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const isAboutActive = pathname?.includes('/history') || pathname?.includes('/board-members');
  const isCongressActive = pathname === '/2026';

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">
        <Link href="/" className="main-nav-brand">
          <Image 
            src="/wahs-logo.png" 
            alt="WAHS" 
            width={80} 
            height={80}
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
          <li><Link href="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}>
            <button className={`nav-dropdown-trigger${isAboutActive ? ' active' : ''}`} onClick={() => setAboutOpen(!aboutOpen)}>
              About <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${aboutOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/2026/history" onClick={() => { setIsMenuOpen(false); setAboutOpen(false); }}>History</Link></li>
              <li><Link href="/2026/board-members" onClick={() => { setIsMenuOpen(false); setAboutOpen(false); }}>Board Members</Link></li>
            </ul>
          </li>
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setCongressOpen(true)}
              onMouseLeave={() => setCongressOpen(false)}>
            <button className={`nav-dropdown-trigger${isCongressActive ? ' active' : ''}`} onClick={() => setCongressOpen(!congressOpen)}>
              Congress <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${congressOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/2026" onClick={() => { setIsMenuOpen(false); setCongressOpen(false); }}>2026 Congress</Link></li>
            </ul>
          </li>
          <li><Link href="/2026/submissions" className={pathname?.includes('/submissions') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Call for Papers</Link></li>
          <li><Link href="/membership" className={isActive('/membership') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Membership</Link></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
