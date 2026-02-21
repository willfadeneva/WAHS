'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';

export default function WahsMembersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated as WAHS member
      const authData = localStorage.getItem('wahs_auth');
      if (!authData) {
        router.push('/wahs/login?redirect=/wahs/members');
        return;
      }

      try {
        const auth = JSON.parse(authData);
        if (!auth.authenticated || auth.userType !== 'wahs') {
          router.push('/wahs/login?redirect=/wahs/members');
          return;
        }

        // User is WAHS member - fetch member directory
        setIsMember(true);
        
        const { data: membersData, error } = await supabase
          .from('wahs_members')
          .select('id, name, affiliation, country, membership_type, membership_status, approved_at')
          .eq('membership_status', 'active')
          .order('name', { ascending: true });

        if (error) throw error;
        
        setMembers(membersData || []);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/wahs/login?redirect=/wahs/members');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member directory...</p>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return null; // Already redirecting
  }

  return (
    <>
      <MainNav />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">WAHS Member Directory</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with fellow WAHS members from around the world. This directory is only accessible to active WAHS members.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Total members: {members.length}
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {members.length === 0 ? (
                <li className="px-6 py-8 text-center text-gray-500">
                  No members found. Be the first to join!
                </li>
              ) : (
                members.map((member) => (
                  <li key={member.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">{member.affiliation}</p>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {member.membership_type === 'professional' ? 'Professional Member' : 'Non-Professional Member'}
                            </span>
                            <span className="text-sm text-gray-500">{member.country}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Member since {new Date(member.approved_at).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Member Guidelines</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• This directory is for WAHS members only</li>
              <li>• Respect member privacy - do not share contact information outside WAHS</li>
              <li>• Use this directory for professional networking and collaboration</li>
              <li>• Contact members respectfully and professionally</li>
            </ul>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
}