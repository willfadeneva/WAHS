import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const vars = {
    url_set: !!url,
    url_preview: url?.slice(0, 35),
    anon_set: !!anon,
    anon_preview: anon?.slice(0, 20),
    service_set: !!service,
    service_preview: service?.slice(0, 20),
  };

  if (!url || !service) return NextResponse.json({ vars, error: 'missing env vars' });

  // Test service role client
  const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('wahs_members').select('count').limit(1);

  return NextResponse.json({ vars, supabase_test: { data, error: error?.message } });
}
