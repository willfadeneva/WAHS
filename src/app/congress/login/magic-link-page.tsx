'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sendMagicLink } from '@/lib/magic-link';

export default function CongressMagicLinkLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Get congress year from URL or default to 2026
  const congressYear = searchParams.get('year') || '2026';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      setLoading(false);
      return;
    }

    try {
      const { success, error } = await sendMagicLink(email, 'congress', congressYear);
      
      if (success) {
        setMessage({ 
          type: 'success', 
          text: `Magic link sent to ${email}! Check your email and click the link to login.` 
        });
        setEmail('');
      } else {
        setMessage({ 
          type: 'error', 
          text: error || 'Failed to send magic link. Please try again.' 
        });
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Congress {congressYear} Abstract Submission
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a magic link for login
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This login is for abstract submission only. 
              To register for the Congress event (buy tickets), visit{' '}
              <a href={`/${congressYear}/registration`} className="underline font-medium">
                /{congressYear}/registration
              </a>
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          {message && (
            <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending magic link...
                </>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </div>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              No password needed! We'll email you a secure login link.
            </p>
            <p className="mt-2 text-gray-500">
              Having trouble? Contact{' '}
              <a href="mailto:wahskorea@gmail.com" className="font-medium text-blue-600 hover:text-blue-500">
                wahskorea@gmail.com
              </a>
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              <strong>Important:</strong> Use the same email for all congress years.
              Your profile will be shared across Congress {congressYear}, 2027, and future years.
            </p>
            <div className="mt-2 flex space-x-4 justify-center">
              <Link 
                href={`/congress/login?year=2026`}
                className={`text-sm ${congressYear === '2026' ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Congress 2026
              </Link>
              <Link 
                href={`/congress/login?year=2027`}
                className={`text-sm ${congressYear === '2027' ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Congress 2027
              </Link>
              <Link 
                href={`/congress/login?year=2028`}
                className={`text-sm ${congressYear === '2028' ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Congress 2028
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}