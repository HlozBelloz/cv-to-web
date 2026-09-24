import crypto from 'crypto';
import { UserSession } from '@/types';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET || 'cv-platform-super-secret-key-32-chars-minimum-needed';
export const AUTH_COOKIE_NAME = 'cv_auth_session';

export function signSession(session: UserSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySession(token: string): UserSession | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('base64url');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
      return JSON.parse(decoded) as UserSession;
    }
  } catch (err) {
    console.warn('Session verification failed:', err);
  }
  return null;
}

export async function getCurrentSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
  } catch {
    return null;
  }
}
