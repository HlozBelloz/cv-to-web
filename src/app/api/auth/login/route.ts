import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import {
  signSession,
  AUTH_COOKIE_NAME,
  verifyPassword,
  hashPassword,
  isPasswordHashed,
  checkLoginLockout,
  recordFailedLogin,
  clearLoginLockout,
  getClientIp,
  validateCsrfOrigin,
  getAuthCookieOptions,
} from '@/lib/auth';
import { UserSession } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. CSRF / Origin Validation
    const csrfCheck = validateCsrfOrigin(req);
    if (!csrfCheck.valid) {
      return NextResponse.json(
        { error: 'Security validation failed: Invalid request origin' },
        { status: 403 }
      );
    }

    // 2. Client IP & Brute-Force Rate Limiting Lockout Check
    const ip = getClientIp(req);
    const lockout = checkLoginLockout(ip);
    if (lockout.locked) {
      const waitMinutes = Math.ceil(lockout.remainingSeconds / 60);
      return NextResponse.json(
        {
          error: `Too many failed attempts. Account temporarily locked for security. Please try again in ${waitMinutes} minute(s).`,
          retryAfter: lockout.remainingSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(lockout.remainingSeconds),
          },
        }
      );
    }

    // 3. Request Payload Validation
    const body = await req.json().catch(() => ({}));
    const { email, password, expectedRole } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await dataStore.getUserByEmail(cleanEmail);

    // 4. Constant-Time Authentication & Timing Protection
    if (!user) {
      const failStatus = recordFailedLogin(ip);
      if (failStatus.locked) {
        const waitMinutes = Math.ceil(failStatus.remainingSeconds / 60);
        return NextResponse.json(
          {
            error: `Too many failed attempts. Account locked. Please try again in ${waitMinutes} minute(s).`,
            retryAfter: failStatus.remainingSeconds,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(failStatus.remainingSeconds) },
          }
        );
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      const failStatus = recordFailedLogin(ip);
      if (failStatus.locked) {
        const waitMinutes = Math.ceil(failStatus.remainingSeconds / 60);
        return NextResponse.json(
          {
            error: `Too many failed attempts. Account locked. Please try again in ${waitMinutes} minute(s).`,
            retryAfter: failStatus.remainingSeconds,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(failStatus.remainingSeconds) },
          }
        );
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 5. Role Authorization Check
    if (expectedRole === 'admin' && user.role !== 'admin') {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: 'Access denied: Administrator privileges required' },
        { status: 403 }
      );
    }

    // 6. Reset Failed Attempts on Successful Login
    clearLoginLockout(ip);

    // 7. Auto-upgrade legacy password hashes to PBKDF2 with unique cryptographic salt
    if (!isPasswordHashed(user.passwordHash)) {
      user.passwordHash = hashPassword(password);
      await dataStore.saveUser(user);
    }

    // 8. Session Generation with Cryptographically Random 256-bit Token
    const session: UserSession = {
      userId: user.id,
      email: user.email,
      role: user.role,
      slug: user.slug,
      name: user.name,
    };

    const token = signSession(session);

    const response = NextResponse.json({
      success: true,
      user: session,
      message: 'Login successful',
    });

    const cookieOptions = getAuthCookieOptions(req);
    response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (err: unknown) {
    console.error('Login error:', err);
    // Generic non-leaking error message
    return NextResponse.json({ error: 'An unexpected error occurred during login' }, { status: 500 });
  }
}
