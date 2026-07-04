import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PRIVATE_ROUTES = ['/history'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

function getPathWithoutLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(/|$)`);
  return pathname.replace(localePattern, '/') || '/';
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  const isPrivateRoute = PRIVATE_ROUTES.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathWithoutLocale);
  const isApiPrivate =
    pathname.startsWith('/api/schema') ||
    pathname.startsWith('/api/history');

  let response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if ((isPrivateRoute || isApiPrivate) && !user) {
    if (isApiPrivate) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const locale = pathname.split('/')[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (isAuthRoute && user) {
    const locale = pathname.split('/')[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/', '/(en|ru)/:path*', '/api/schema', '/api/schema/:path*', '/api/history', '/api/history/:path*'],
};
