import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static public assets (.svg, .png, .jpg, .pdf, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|ico)$).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rawHostname = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const hostname = rawHostname.split(':')[0].toLowerCase();

  // --- 1. CSRF / Origin Validation for State-Changing Auth Endpoints ---
  if (url.pathname.startsWith('/api/auth/')) {
    const method = req.method.toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const origin = req.headers.get('origin');
      const referer = req.headers.get('referer');

      if (origin) {
        try {
          const originHost = new URL(origin).hostname.toLowerCase();
          const isOriginLocal = originHost === 'localhost' || originHost === '127.0.0.1';
          const isHostLocal = hostname === 'localhost' || hostname === '127.0.0.1';
          if (originHost !== hostname && !(isOriginLocal && isHostLocal)) {
            return NextResponse.json(
              { error: 'CSRF validation failed: Unauthorized request origin' },
              { status: 403 }
            );
          }
        } catch {
          return NextResponse.json({ error: 'Malformed Origin header' }, { status: 403 });
        }
      } else if (referer) {
        try {
          const refererHost = new URL(referer).hostname.toLowerCase();
          const isRefererLocal = refererHost === 'localhost' || refererHost === '127.0.0.1';
          const isHostLocal = hostname === 'localhost' || hostname === '127.0.0.1';
          if (refererHost !== hostname && !(isRefererLocal && isHostLocal)) {
            return NextResponse.json(
              { error: 'CSRF validation failed: Unauthorized request referer' },
              { status: 403 }
            );
          }
        } catch {
          return NextResponse.json({ error: 'Malformed Referer header' }, { status: 403 });
        }
      }
    }
    // Allow API auth request to proceed
    return NextResponse.next();
  }

  // Pass through any other API routes without rewriting
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // --- 2. Auth Route Protection ---
  const sessionToken = req.cookies.get('cv_auth_session')?.value;

  // Protect /admin routes (except /admin/login)
  if (url.pathname === '/admin' || (url.pathname.startsWith('/admin/') && url.pathname !== '/admin/login')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Protect /dashboard
  if (url.pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // --- 3. Subdomain Rewriting & Hosting Platform Exclusion ---
  const isLocalhost =
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0';

  // Exclude hosting platforms and tunnel providers from candidate subdomain rewrites
  const isHostingPlatform =
    hostname === 'trycloudflare.com' ||
    hostname.endsWith('.trycloudflare.com') ||
    hostname === 'pages.dev' ||
    hostname.endsWith('.pages.dev') ||
    hostname === 'vercel.app' ||
    hostname.endsWith('.vercel.app') ||
    hostname === 'workers.dev' ||
    hostname.endsWith('.workers.dev');

  const parts = hostname.split('.');

  // Rewrite custom subdomain (e.g. candidate.customdomain.com) to /cv/candidate
  if (!isLocalhost && !isHostingPlatform && parts.length > 2 && parts[0] !== 'www') {
    const subdomain = parts[0];
    if (!url.pathname.startsWith('/cv/')) {
      return NextResponse.rewrite(new URL(`/cv/${subdomain}`, req.url));
    }
  }

  return NextResponse.next();
}
