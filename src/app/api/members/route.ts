import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, institution, country, membership_type } = body;
    if (!full_name || !email || !membership_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('wahs_members').insert([{
      full_name, email, institution, country, membership_type,
      membership_status: 'pending',
    }]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let query = supabase.from('wahs_members').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('membership_status', status);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
