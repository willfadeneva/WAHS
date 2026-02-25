import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'missing env vars', url: !!url, key: !!key });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('congresses').select('year').eq('year', 2026).single();

  return NextResponse.json({ url: url.slice(0, 30), keyStart: key.slice(0, 20), data, error });
}
