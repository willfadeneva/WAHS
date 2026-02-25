import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const WAHS_PROTECTED = ['/wahs/dashboard', '/wahs/profile', '/wahs/members', '/wahs/resources'];
const ADMIN_PROTECTED = ['/admin'];

// Congress auth-required paths: /{year}/dashboard, /{year}/submit-abstract, /{year}/submissions/{id}/edit
const CONGRESS_AUTH_RE = /^\/(\d{4})\/(dashboard|submit-abstract|submissions\/.+\/edit)/;

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const path = request.nextUrl.pathname;

  // Protect WAHS member pages
  if (WAHS_PROTECTED.some(p => path.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL('/wahs/login', request.url));
    }
  }

  // Protect congress auth-required pages (dashboard, submit-abstract, submissions edit)
  const congressMatch = CONGRESS_AUTH_RE.exec(path);
  if (congressMatch) {
    if (!session) {
      const year = congressMatch[1];
      return NextResponse.redirect(new URL(`/${year}/login`, request.url));
    }
  }

  // Protect Admin (exclude /admin/login to avoid redirect loop)
  if (ADMIN_PROTECTED.some(p => path.startsWith(p))) {
    if (path !== '/admin/login' && !session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/wahs/:path*',
    '/admin/:path*',
    '/:year(\\d{4})/dashboard',
    '/:year(\\d{4})/submit-abstract',
    '/:year(\\d{4})/submissions/:id/edit',
  ],
};
