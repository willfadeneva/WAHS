'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function WahsLoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await signIn(email, 'wahs');
    
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send magic link' });
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Check your email for a magic link to login! You can close this page.' 
      });
      setEmail('');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            WAHS Member Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access member-only resources and directory
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Sending magic link...' : 'Send Magic Link'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Not a WAHS member yet?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/membership" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Learn about WAHS membership
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                href="/auth/reset-password" 
                className="font-medium text-blue-600 hover:text-blue-500 text-sm"
              >
                Forgot your password? Reset it here
              </Link>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p className="mt-2">
                <Link href="/" className="text-blue-600 hover:text-blue-500">
                  ← Back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact wahskorea@gmail.com</p>
        </div>
      </div>
    </div>
  );
}