'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Nav from '@/components/Nav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Submissions from '@/components/Submissions';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function ProtectedSubmissionsPage({ params }: { params: { year: string } }) {
  const { year: yearStr } = params;
  const year = parseInt(yearStr);
  const { user, userType, loading } = useAuth();
  const router = useRouter();
  const [isValidYear, setIsValidYear] = useState(true);

  useEffect(() => {
    // Validate year
    if (isNaN(year) || year < 2000 || year > 2100) {
      setIsValidYear(false);
      return;
    }

    // Check authentication - try custom auth first, then Supabase Auth
    const checkAuth = async () => {
      // Check custom auth (magic link system)
      const authData = localStorage.getItem('wahs_auth');
      if (authData) {
        try {
          const auth = JSON.parse(authData);
          if (auth.authenticated && auth.userType === 'congress') {
            // User is authenticated via custom system
            return;
          }
        } catch (error) {
          // Invalid auth data
        }
      }

      // Check Supabase Auth (for admin users or legacy)
      if (!loading && !user) {
        // Not logged in - redirect to Congress login
        router.push(`/congress/login?redirect=/2026/submissions-new`);
        return;
      }

      // Check user type for Supabase Auth users
      if (!loading && user && userType !== 'congress') {
        // Wrong user type - redirect based on user type
        if (userType === 'wahs') {
          router.push('/wahs/dashboard');
        } else if (userType === 'admin') {
          router.push('/admin');
        } else {
          // No profile yet - redirect to profile completion
          router.push('/congress/submit-abstract?completeProfile=true');
        }
      }
    };

    checkAuth();
  }, [user, userType, loading, year, router]);

  if (!isValidYear) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Congress Year</h1>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated (either via custom auth or Supabase Auth)
  const authData = localStorage.getItem('wahs_auth');
  let isAuthenticated = false;
  let isCongressUser = false;
  
  if (authData) {
    try {
      const auth = JSON.parse(authData);
      isAuthenticated = auth.authenticated;
      isCongressUser = auth.userType === 'congress';
    } catch (error) {
      // Invalid auth data
    }
  }

  // Also check Supabase Auth
  const isSupabaseAuthenticated = user && userType === 'congress';

  if (!isAuthenticated && !isSupabaseAuthenticated) {
    // Still redirecting or checking
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authenticated as Congress submitter - show submissions page
  return (
    <>
      <Nav year={year} />
      <div style={{ paddingTop: '80px' }}><Breadcrumbs /></div>
      <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
      <Submissions year={year} />
      <Footer />
      <ScrollReveal />
    </>
  );
}

// Metadata moved to layout or removed since this is a client component