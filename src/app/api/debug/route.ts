import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return NextResponse.json({ error: 'missing env', url: !!url, key: !!key });

  const client = createClient(url, key);
  const { data: anon, error: anonErr } = await client.from('congresses').select('year').eq('year', 2026).single();

  const admin = createClient(url, svc!, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: svcData, error: svcErr } = await admin.from('congresses').select('year').eq('year', 2026).single();

  return NextResponse.json({
    url_preview: url.slice(0, 40),
    key_preview: key.slice(0, 20),
    svc_preview: svc?.slice(0, 20),
    anon_query: { data: anon, error: anonErr?.message, code: anonErr?.code },
    svc_query: { data: svcData, error: svcErr?.message },
  });
}
