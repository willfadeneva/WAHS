'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">
        <Link href="/" className="main-nav-brand">
          <Image 
            src="/wahs-logo.png" 
            alt="WAHS Logo" 
            width={40} 
            height={40}
            className="main-nav-logo"
          />
          <span className="main-nav-brand-text">WAHS</span>
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
          <li><Link href="/about">About</Link></li>
          <li><Link href="/membership">Membership</Link></li>
          <li><Link href="/2026" className="main-nav-congress">2026 Congress</Link></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}