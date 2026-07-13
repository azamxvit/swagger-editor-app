import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const PRIVATE_ROUTES = ['/history'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

const intlMiddleware = createIntlMiddleware(routing);

function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if ((routing.locales as readonly string[]).includes(maybeLocale)) {
    const rest = `/${segments.slice(2).join('/')}`;
    return rest === '/' ? '/' : rest.replace(/\/$/, '') || '/';
  }

  return pathname;
}

function getCurrentLocale(pathname: string): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  if ((routing.locales as readonly string[]).includes(maybeLocale)) {
    return maybeLocale;
  }
  return routing.defaultLocale;
}

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get('location')) {
    return intlResponse;
  }

  const rawPathname = request.nextUrl.pathname;
  const pathname = stripLocale(rawPathname);
  const currentLocale = getCurrentLocale(rawPathname);

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
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPrivate = PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isPrivate && !user) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = `/${currentLocale}`;
    targetUrl.search = '';

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0;url=${targetUrl.toString()}" />
    <title>401 Unauthorized</title>
  </head>
  <body style="margin:0;background:#0a0a0a;color:#fafafa;font-family:system-ui;display:grid;place-items:center;min-height:100vh">
    <main style="text-align:center">
      <h1 style="font-size:2rem;margin:0">401</h1>
      <p>Unauthorized. Redirecting…</p>
    </main>
  </body>
</html>`;

    return new NextResponse(html, {
      status: 401,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'WWW-Authenticate': 'Bearer',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${currentLocale}`;
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
