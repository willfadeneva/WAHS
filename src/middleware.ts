import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const WAHS_PROTECTED = ['/wahs/dashboard', '/wahs/profile', '/wahs/members', '/wahs/resources'];
const CONGRESS_PROTECTED = ['/congress'];
const ADMIN_PROTECTED = ['/admin'];

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

  // Protect WAHS pages
  if (WAHS_PROTECTED.some(p => path.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL('/wahs/login', request.url));
    }
  }

  // Protect Congress dashboard/submit pages (allow login/register pages)
  if (CONGRESS_PROTECTED.some(p => path.startsWith(p))) {
    const isAuthPage = path.endsWith('/login') || path.endsWith('/register');
    if (!session && !isAuthPage) {
      const year = path.split('/')[2] || '2026';
      return NextResponse.redirect(new URL(`/congress/${year}/login`, request.url));
    }
  }

  // Protect Admin (exclude /admin/login itself to avoid redirect loop)
  if (ADMIN_PROTECTED.some(p => path.startsWith(p))) {
    const isAdminLoginPage = path === '/admin/login';
    if (!session && !isAdminLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/wahs/:path*', '/congress/:path*', '/admin/:path*'],
};
