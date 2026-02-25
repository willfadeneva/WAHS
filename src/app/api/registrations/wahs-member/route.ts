import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { sendRegistrationConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, institution, country, congress_year } = body;

    if (!full_name || !email || !institution || !country || !congress_year) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verify active WAHS membership by email
    const { data: member, error: memberError } = await supabase
      .from('wahs_members')
      .select('membership_status, expires_at')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (memberError || !member) {
      return NextResponse.json({
        error: 'No active WAHS membership found for this email. Please check your email or contact wahskorea@gmail.com.',
      }, { status: 403 });
    }

    if (member.membership_status !== 'active') {
      return NextResponse.json({
        error: 'Your WAHS membership is not currently active. Please renew your membership before registering.',
      }, { status: 403 });
    }

    if (member.expires_at && new Date(member.expires_at) < new Date()) {
      return NextResponse.json({
        error: 'Your WAHS dues are overdue. Please pay your dues at iwahs.org/wahs/login before registering for free.',
      }, { status: 403 });
    }

    // Check for duplicate registration
    const { data: existing } = await supabase
      .from('congress_registrations')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('congress_year', congress_year)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'You are already registered for this congress.' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('congress_registrations')
      .insert([{
        full_name,
        email: email.toLowerCase(),
        institution,
        country,
        ticket_type: 'wahs_member',
        congress_year,
        is_wahs_member: true,
        amount_paid: 0,
      }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    // Send confirmation email (non-blocking)
    sendRegistrationConfirmation(email.toLowerCase(), full_name, 'wahs_member', congress_year).catch(console.error);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
