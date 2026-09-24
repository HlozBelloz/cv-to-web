import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { UserSession } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, expectedRole } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await dataStore.getUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check password
    if (user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Role check if logging in to admin
    if (expectedRole === 'admin' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied: Administrator privileges required' }, { status: 403 });
    }

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
      message: 'Login successful'
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
