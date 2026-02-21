import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetLink } from '@/lib/magic-link';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists and determine user type
    const { data: congressUser } = await supabase
      .from('congress_submitters')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    const { data: wahsUser } = await supabase
      .from('wahs_members')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    let userType: 'congress' | 'wahs' | null = null;
    
    if (congressUser) {
      userType = 'congress';
    } else if (wahsUser) {
      userType = 'wahs';
    } else {
      // User doesn't exist in either table
      // Still send a magic link that will fail gracefully
      userType = 'congress'; // Default
    }

    // Send magic link for password reset (which is just a login link)
    const result = await sendPasswordResetLink(email);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Login link sent successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send login link' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Send login link error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}