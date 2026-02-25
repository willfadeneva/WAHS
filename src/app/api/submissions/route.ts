import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('submissions').insert([body]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
