'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyMagicLinkToken } from '@/lib/magic-link';
import { supabase } from '@/lib/supabase';

export default function MagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMagicLink = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid magic link. Missing token or email.');
        return;
      }

      try {
        // Verify the magic link token
        const { valid, userType, error } = await verifyMagicLinkToken(token, email);
        
        if (!valid) {
          setStatus('error');
          setMessage(error || 'Invalid or expired magic link.');
          return;
        }

        // Sign in the user with Supabase Auth
        // First, check if user exists
        const { data: existingUser } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', email.toLowerCase())
          .single();

        let userId: string;

        if (existingUser) {
          // User exists, sign them in
          userId = existingUser.id;
        } else {
          // Create new user
          const { data: newUser, error: createError } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            options: {
              data: { user_type: userType }
            }
          });

          if (createError || !newUser.user) {
            setStatus('error');
            setMessage(createError?.message || 'Failed to create user account.');
            return;
          }

          userId = newUser.user.id;
        }

        // Set session in localStorage (similar to Supabase Auth)
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'magic-link-auth',
          user: { id: userId, email: email.toLowerCase() }
        }));

        // Redirect based on user type
        if (userType === 'congress') {
          // Check if user has a congress profile
          const { data: congressProfile } = await supabase
            .from('congress_submitters')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (congressProfile) {
            router.push('/congress/dashboard');
          } else {
            router.push('/congress/register/profile');
          }
        } else if (userType === 'wahs') {
          // Check if user has a WAHS profile
          const { data: wahsProfile } = await supabase
            .from('wahs_members')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (wahsProfile) {
            router.push('/wahs/dashboard');
          } else {
            router.push('/wahs/register/profile');
          }
        }

        setStatus('success');
        setMessage('Login successful! Redirecting...');

      } catch (error) {
        console.error('Magic link error:', error);
        setStatus('error');
        setMessage('An error occurred during login. Please try again.');
      }
    };

    handleMagicLink();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            WAHS Magic Link Login
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your magic link...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-gray-600">{message}</p>
              <p className="mt-2 text-sm text-gray-500">If you are not redirected automatically, please click the link in your dashboard.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-4 text-red-600">{message}</p>
              <div className="mt-6">
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Homepage
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Using custom magic link system with Resend email service.</p>
          <p className="mt-1 text-xs text-gray-500">No Supabase email rate limits!</p>
        </div>
      </div>
    </div>
  );
}