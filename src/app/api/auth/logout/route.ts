import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, validateCsrfOrigin, getAuthCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // CSRF validation on logout
  const csrfCheck = validateCsrfOrigin(req);
  if (!csrfCheck.valid) {
    return NextResponse.json(
      { error: 'Security validation failed: Invalid request origin' },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  const cookieOpts = getAuthCookieOptions(req);

  response.cookies.set(AUTH_COOKIE_NAME, '', {
    ...cookieOpts,
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
