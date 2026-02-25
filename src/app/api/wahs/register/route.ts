import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { sendMembershipConfirmation } from '@/lib/email';

const PAYPAL_LINKS: Record<string, string> = {
  professional: process.env.NEXT_PUBLIC_PAYPAL_WAHS_PROFESSIONAL || 'https://www.paypal.com/ncp/payment/9K9JC2CZ6N7S2',
  student: process.env.NEXT_PUBLIC_PAYPAL_WAHS_STUDENT || 'https://www.paypal.com/ncp/payment/Y2V33KK92X5SU',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, password, institution, country, membership_type } = body;

    if (!full_name || !email || !password || !membership_type) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (authError) {
      if (authError.message?.includes('already registered') || authError.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 });
      }
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Create wahs_members record
    const { error: memberError } = await adminClient
      .from('wahs_members')
      .insert({
        user_id: userId,
        email,
        full_name,
        institution: institution || null,
        country: country || null,
        membership_type,
        membership_status: 'pending',
        joined_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

    if (memberError) {
      // Rollback: delete auth user
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    // Send welcome email (non-blocking)
    sendMembershipConfirmation(email, full_name, membership_type).catch(console.error);

    const paypalUrl = PAYPAL_LINKS[membership_type] || PAYPAL_LINKS.professional;

    return NextResponse.json({ success: true, paypalUrl });
  } catch (err) {
    console.error('WAHS register error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
