'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function WahsRegisterPage() {
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
        text: 'Check your email for a magic link! After logging in, you\'ll complete your profile and payment to activate your membership.' 
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
            WAHS Membership Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the World Association for Hallyu Studies
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">Membership Information</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• <strong>Professional Membership:</strong> $250/year</li>
              <li>• <strong>Non-Professional Membership:</strong> $150/year</li>
              <li>• All members get access to member dashboard</li>
              <li>• Professional members get free congress registration</li>
              <li>• Non-Professional members get discounted congress registration</li>
            </ul>
            <p className="mt-2 text-xs text-blue-600">
              After logging in, you'll complete your profile and payment.
            </p>
          </div>
          
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
              <p className="mt-1 text-sm text-gray-500">
                Use your institutional email if possible
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Sending magic link...' : 'Register for WAHS Membership'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already a member?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/wahs/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in to your account
              </Link>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>By registering, you agree to WAHS terms and conditions.</p>
              <p className="mt-2">
                <Link href="/" className="text-blue-600 hover:text-blue-500">
                  ← Back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Questions? Contact wahskorea@gmail.com</p>
        </div>
      </div>
    </div>
  );
}