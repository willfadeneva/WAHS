'use client';
import { supabase } from '@/lib/supabase';

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 18px',
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
        borderRadius: 6,
        fontSize: '0.88rem',
        fontWeight: 600,
        border: '1px solid rgba(255,255,255,0.25)',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  );
}
