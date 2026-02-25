import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, affiliation, country, membership_type, year } = body;
    if (!name || !email || !membership_type || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('members').insert([{
      name, email, affiliation, country, membership_type, year, payment_status: 'pending',
    }]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const status = url.searchParams.get('status');
    let query = supabase.from('members').select('*').order('created_at', { ascending: false });
    if (year) query = query.eq('year', parseInt(year));
    if (status) query = query.eq('payment_status', status);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
