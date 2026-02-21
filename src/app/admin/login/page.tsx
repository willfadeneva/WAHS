'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { sendAdminMagicLink } from '@/lib/magic-link';

// Admin emails (using magic links instead of passwords)
const ADMIN_EMAILS = [
  'oingyu@gmail.com',
  'charanjotsingh@gmail.com',
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if email is an admin email
      if (!ADMIN_EMAILS.includes(email)) {
        setError('Invalid admin email');
        setLoading(false);
        return;
      }

      // Check if user exists in auth.users
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (!userData) {
        setError('Admin user not found in system. Please register first.');
        setLoading(false);
        return;
      }

      // Check if user is in admin_users table
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (!adminData) {
        setError('Not authorized as admin. Please contact system administrator.');
        setLoading(false);
        return;
      }

      // Send magic link for admin login
      const { success, error: magicError } = await sendAdminMagicLink(email);
      
      if (!success) {
        setError(magicError || 'Failed to send magic link');
        setLoading(false);
        return;
      }

      setSent(true);
      setError('');
      
    } catch (err) {
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            WAHS Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Original design: Email/password authentication for two admin emails only
          </p>
        </div>
        
        {sent ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-medium">Magic link sent!</p>
            <p className="text-sm mt-1">Check your email at <strong>{email}</strong> for a login link.</p>
            <p className="text-xs mt-2 text-green-600">The link will expire in 15 minutes.</p>
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="mt-3 text-sm text-green-700 hover:text-green-800"
            >
              Send another link
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending magic link...' : 'Send Magic Link'}
              </button>
            </div>

            <div className="text-sm text-center text-gray-600">
              <p>Hardcoded admin emails only:</p>
              <p className="font-mono text-xs mt-1">oingyu@gmail.com</p>
              <p className="font-mono text-xs">charanjotsingh@gmail.com</p>
              <p className="mt-2 text-xs text-gray-500">No passwords — magic links only</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}