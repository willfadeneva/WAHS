'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

type UserType = 'congress' | 'wahs' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  userType: UserType;
  profile: any;
  loading: boolean;
  signIn: (email: string, userType: 'congress' | 'wahs') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
          setUserType(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Check if user is a congress submitter
      const { data: congressData } = await supabase
        .from('congress_submitters')
        .select('*')
        .eq('id', userId)
        .single();

      if (congressData) {
        setProfile(congressData);
        setUserType('congress');
        return;
      }

      // Check if user is a WAHS member
      const { data: wahsData } = await supabase
        .from('wahs_members')
        .select('*')
        .eq('id', userId)
        .single();

      if (wahsData) {
        setProfile(wahsData);
        setUserType('wahs');
        return;
      }

      // Check if user is an admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (adminData) {
        setProfile(adminData);
        setUserType('admin');
        return;
      }

      // User authenticated but no profile yet (just signed up)
      setProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, type: 'congress' | 'wahs') => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { user_type: type }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const value = {
    user,
    userType,
    profile,
    loading,
    signIn,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}