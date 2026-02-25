import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const year = url.searchParams.get('year');
    if (!email || !year) {
      return NextResponse.json({ error: 'Missing email or year' }, { status: 400 });
    }
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('congress_registrations')
      .select('id, ticket_type, is_wahs_member')
      .eq('email', email.toLowerCase())
      .eq('congress_year', parseInt(year))
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data || data.length === 0) {
      return NextResponse.json({ registered: false });
    }
    return NextResponse.json({ registered: true, ticket_type: data[0].ticket_type, is_wahs_member: data[0].is_wahs_member });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
