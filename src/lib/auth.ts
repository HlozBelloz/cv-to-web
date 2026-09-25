import { UserSession } from '@/types';
import { cookies } from 'next/headers';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  rotateSessionToken,
  getAuthCookieOptions,
  hashPassword,
  verifyPassword,
  isPasswordHashed,
  checkLoginLockout,
  recordFailedLogin,
  clearLoginLockout,
  getClientIp,
  validateCsrfOrigin,
  timingSafeEqualString,
  type SecureSessionPayload,
} from './security';

export type { SecureSessionPayload };

export {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  rotateSessionToken,
  getAuthCookieOptions,
  hashPassword,
  verifyPassword,
  isPasswordHashed,
  checkLoginLockout,
  recordFailedLogin,
  clearLoginLockout,
  getClientIp,
  validateCsrfOrigin,
  timingSafeEqualString,
};

export function signSession(session: UserSession): string {
  return createSessionToken({
    userId: session.userId,
    email: session.email,
    role: session.role,
    slug: session.slug,
    name: session.name,
  });
}

export function verifySession(token: string): UserSession | null {
  const verified = verifySessionToken(token);
  if (!verified) return null;
  return {
    userId: verified.userId,
    email: verified.email,
    role: verified.role,
    slug: verified.slug,
    name: verified.name,
  };
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
