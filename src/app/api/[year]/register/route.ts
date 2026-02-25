import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest, { params }: { params: Promise<{ year: string }> }) {
  try {
    const { year: yearStr } = await params;
    const year = parseInt(yearStr);

    if (isNaN(year)) {
      return NextResponse.json({ error: 'Invalid congress year.' }, { status: 400 });
    }

    const body = await request.json();
    const { full_name, email, password, institution } = body;

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Check if user already exists — if so, they can log in directly
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email.toLowerCase());

    let userId: string;

    if (existingUser) {
      // User already has an account — use it (they just need to log in)
      userId = existingUser.id;
    } else {
      // Create new auth user
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: email.toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: { full_name },
      });

      if (authError) {
        if (authError.message?.includes('already registered') || authError.message?.includes('already been registered')) {
          return NextResponse.json({ error: 'An account with this email already exists. Please log in instead.' }, { status: 409 });
        }
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }
      userId = authData.user.id;
    }

    // Sign in the user so they get a session
    // Note: We return success and the frontend logs in via supabase.auth.signInWithPassword
    return NextResponse.json({
      success: true,
      userId,
      message: existingUser ? 'existing_account' : 'new_account',
    });
  } catch (err) {
    console.error('Congress register error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
