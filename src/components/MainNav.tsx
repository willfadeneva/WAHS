'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [congressOpen, setCongressOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const pathname = usePathname();

  const close = () => { setIsMenuOpen(false); setAboutOpen(false); setCongressOpen(false); setMemberOpen(false); };

  return (
    <nav className="main-nav">
      <div className="main-nav-inner">
        <Link href="/" className="main-nav-brand" onClick={close}>
          <img src="/wahs-logo.png" alt="WAHS" style={{ height: '80px', width: 'auto' }} />
        </Link>

        <button
          className={`main-nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <ul className={`main-nav-links ${isMenuOpen ? 'active' : ''}`}>

          {/* Home */}
          <li>
            <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={close}>
              Home
            </Link>
          </li>

          {/* About */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}>
            <button
              className={`nav-dropdown-trigger${(pathname?.includes('/history') || pathname?.includes('/board-members')) ? ' active' : ''}`}
              onClick={() => setAboutOpen(!aboutOpen)}
            >
              About <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${aboutOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/2026/history" onClick={close}>History</Link></li>
              <li><Link href="/2026/board-members" onClick={close}>Board Members</Link></li>
            </ul>
          </li>

          {/* Congress → 2026 Congress */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setCongressOpen(true)}
              onMouseLeave={() => setCongressOpen(false)}>
            <button
              className={`nav-dropdown-trigger${pathname?.startsWith('/2026') || pathname?.startsWith('/congress') ? ' active' : ''}`}
              onClick={() => setCongressOpen(!congressOpen)}
            >
              Congress <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${congressOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/2026" onClick={close}>2026 Congress</Link></li>
            </ul>
          </li>

          {/* Membership */}
          <li className="nav-dropdown-parent"
              onMouseEnter={() => setMemberOpen(true)}
              onMouseLeave={() => setMemberOpen(false)}>
            <button
              className={`nav-dropdown-trigger${(pathname?.startsWith('/wahs') || pathname === '/membership') ? ' active' : ''}`}
              onClick={() => setMemberOpen(!memberOpen)}
            >
              Membership <span className="nav-dropdown-arrow">▾</span>
            </button>
            <ul className={`nav-dropdown${memberOpen ? ' nav-dropdown-open' : ''}`}>
              <li><Link href="/membership" onClick={close}>Join WAHS</Link></li>
              <li><Link href="/wahs/login" onClick={close}>Member Login</Link></li>
              <li><Link href="/wahs/dashboard" onClick={close}>My Dashboard</Link></li>
              <li><Link href="/wahs/resources" onClick={close}>Resources</Link></li>
            </ul>
          </li>

        </ul>
      </div>
    </nav>
  );
}
