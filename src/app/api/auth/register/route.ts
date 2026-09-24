import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { signSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { User, UserSession } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, slug } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await dataStore.getUserByEmail(cleanEmail);

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name,
      role: 'user',
      slug: slug || undefined,
      passwordHash: password,
      createdAt: new Date().toISOString(),
    };

    await dataStore.saveUser(newUser);

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
      message: 'Account created successfully'
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
