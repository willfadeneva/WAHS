'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Footer() {
  const { user, userType } = useAuth();

  return (
    <footer>
      <p>World Association for Hallyu Studies (WAHS) · <a href="https://www.iwahs.org" target="_blank">www.iwahs.org</a></p>
      
      {/* Auth Links */}
      <div style={{ marginTop: '15px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {user ? (
          // Logged in - show dashboard links
          <>
            {userType === 'congress' && (
              <Link href="/congress/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>
                Congress Dashboard
              </Link>
            )}
            {userType === 'wahs' && (
              <Link href="/wahs/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>
                Member Dashboard
              </Link>
            )}
            {userType === 'admin' && (
              <Link href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>
                Admin Dashboard
              </Link>
            )}
            <Link href="#" onClick={() => {/* Sign out will be added */}} style={{ color: '#fff', textDecoration: 'none' }}>
              Sign Out
            </Link>
          </>
        ) : (
          // Not logged in - show login/register links
          <>
            <Link href="/congress/register" style={{ color: '#fff', textDecoration: 'none' }}>
              Submit Abstract
            </Link>
            <Link href="/wahs/register" style={{ color: '#fff', textDecoration: 'none' }}>
              Join WAHS
            </Link>
            <Link href="/congress/login" style={{ color: '#fff', textDecoration: 'none' }}>
              Congress Login
            </Link>
            <Link href="/wahs/login" style={{ color: '#fff', textDecoration: 'none' }}>
              Member Login
            </Link>
          </>
        )}
      </div>
      
      <p style={{ textAlign: 'center', color: '#fff', marginTop: 15, fontSize: '0.9rem' }}>WAHS | 세계한류학회</p>
    </footer>
  );
}
