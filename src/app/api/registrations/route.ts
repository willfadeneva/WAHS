import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, institution, country, ticket_type, congress_year } = body;
    if (!full_name || !email || !ticket_type || !congress_year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('congress_registrations').insert([{
      full_name, email, institution, country, ticket_type, congress_year,
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
    let query = supabase.from('congress_registrations').select('*').order('created_at', { ascending: false });
    if (year) query = query.eq('congress_year', parseInt(year));
    if (status) query = query.eq('ticket_type', status);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
