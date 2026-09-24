import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Extract base domain and subdomain
  // Exclude localhost and standard dev ports
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Check for custom subdomain e.g. mohamed.cvplatform.com or duckdns
  const parts = hostname.split('.');

  // If someone accesses via a personal custom domain e.g. mohamed.com
  // or a wildcard subdomain e.g. mohamed.yourdomain.com
  if (!isLocalhost && parts.length > 2 && parts[0] !== 'www') {
    const subdomain = parts[0];
    // If not already accessing /cv/...
    if (!url.pathname.startsWith('/cv/')) {
      return NextResponse.rewrite(new URL(`/cv/${subdomain}`, req.url));
    }
  }

  return NextResponse.next();
}
