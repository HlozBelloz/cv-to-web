import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import {
  signSession,
  AUTH_COOKIE_NAME,
  hashPassword,
  validateCsrfOrigin,
  getAuthCookieOptions,
} from '@/lib/auth';
import { User, UserSession } from '@/types';

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

    const body = await req.json().catch(() => ({}));
    const { email, password, name, slug } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await dataStore.getUserByEmail(cleanEmail);

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    // 2. Hash password with PBKDF2 and cryptographically unique per-user salt
    const passwordHash = hashPassword(password);

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name: name.trim(),
      role: 'user',
      slug: slug?.trim() || undefined,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    await dataStore.saveUser(newUser);

    // 3. Issue secure session
    const session: UserSession = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      slug: newUser.slug,
      name: newUser.name,
    };

    const token = signSession(session);

    const response = NextResponse.json({
      success: true,
      user: session,
      message: 'Account created successfully',
    });

    const cookieOptions = getAuthCookieOptions(req);
    response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (err: unknown) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
