import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, affiliation, country, congress_year } = body;

    if (!name || !email || !affiliation || !country || !congress_year) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Verify WAHS membership by email
    const { data: member, error: memberError } = await supabase
      .from('wahs_members')
      .select('membership_status, dues_paid_until')
      .eq('email', email.toLowerCase())
      .single();

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

    if (member.dues_paid_until) {
      const dueDate = new Date(member.dues_paid_until);
      if (dueDate < new Date()) {
        return NextResponse.json({
          error: 'Your WAHS dues are overdue. Please pay your dues at iwahs.org/wahs/login before registering for free.',
        }, { status: 403 });
      }
    }

    // Check for duplicate registration
    const { data: existing } = await supabase
      .from('congress_registrations')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('congress_year', congress_year)
      .single();

    if (existing) {
      return NextResponse.json({
        error: 'You are already registered for this congress.',
      }, { status: 409 });
    }

    // Register as free WAHS member
    const { data, error } = await supabase
      .from('congress_registrations')
      .insert([{
        name,
        email: email.toLowerCase(),
        affiliation,
        country,
        registration_type: 'wahs_member',
        congress_year,
        payment_status: 'free',
      }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
