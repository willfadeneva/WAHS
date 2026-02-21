'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type UserType = 'wahs' | 'congress' | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userType: UserType;
  loading: boolean;
  signIn: (email: string, password: string, userType: UserType) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, userType: UserType) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Determine user type based on session
        if (currentSession?.user) {
          await determineUserType(currentSession.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          await determineUserType(newSession.user);
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const determineUserType = async (user: User) => {
    try {
      // Check if user is a WAHS member
      const { data: wahsMember, error: wahsError } = await supabase
        .from('wahs_members')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!wahsError && wahsMember) {
        setUserType('wahs');
        return;
      }

      // Check if user is a Congress submitter
      const { data: congressSubmitter, error: congressError } = await supabase
        .from('congress_submitters')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!congressError && congressSubmitter) {
        setUserType('congress');
        return;
      }

      // Default to null if not found in either table
      setUserType(null);
    } catch (error) {
      console.error('Error determining user type:', error);
      setUserType(null);
    }
  };

  const signIn = async (email: string, password: string, userType: UserType): Promise<{ error: any }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // After successful login, determine user type
      if (data.user) {
        await determineUserType(data.user);
        
        // Redirect based on user type
        if (userType === 'wahs') {
          router.push('/wahs/dashboard');
        } else if (userType === 'congress') {
          router.push('/congress/dashboard');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userType: UserType): Promise<{ error: any }> => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        return { error: authError };
      }

      if (!authData.user) {
        return { error: new Error('User creation failed') };
      }

      // Create user profile based on type
      if (userType === 'wahs') {
        const { error: profileError } = await supabase
          .from('wahs_members')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              email: email,
              membership_type: 'pending',
              membership_status: 'pending',
            },
          ]);

        if (profileError) {
          // If profile creation fails, delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          return { error: profileError };
        }
      } else if (userType === 'congress') {
        const { error: profileError } = await supabase
          .from('congress_submitters')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              email: email,
            },
          ]);

        if (profileError) {
          await supabase.auth.admin.deleteUser(authData.user.id);
          return { error: profileError };
        }
      }

      // Set user type
      setUserType(userType);
      
      // Redirect based on user type
      if (userType === 'wahs') {
        router.push('/membership');
      } else if (userType === 'congress') {
        // Redirect to profile completion first
        router.push('/congress/profile');
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: any): Promise<{ error: any }> => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      let error;
      
      if (userType === 'wahs') {
        const { error: updateError } = await supabase
          .from('wahs_members')
          .update(data)
          .eq('id', user.id);
        error = updateError;
      } else if (userType === 'congress') {
        const { error: updateError } = await supabase
          .from('congress_submitters')
          .update(data)
          .eq('id', user.id);
        error = updateError;
      } else {
        return { error: new Error('Unknown user type') };
      }

      return { error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const value = {
    session,
    user,
    userType,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
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