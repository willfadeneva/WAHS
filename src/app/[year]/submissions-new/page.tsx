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

    // Check authentication
    if (!loading && !user) {
      // Not logged in - redirect to Congress login
      router.push(`/congress/login?redirect=/2026/submissions`);
      return;
    }

    // Check user type
    if (!loading && user && userType !== 'congress') {
      // Wrong user type - redirect based on user type
      if (userType === 'wahs') {
        router.push('/wahs/dashboard');
      } else if (userType === 'admin') {
        router.push('/admin');
      } else {
        // No profile yet - redirect to profile completion
        router.push('/congress/register?completeProfile=true');
      }
    }
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

  if (!user || userType !== 'congress') {
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

export function generateMetadata() {
  return {
    title: 'Submit Your Abstract — WAHS 2026',
  };
}