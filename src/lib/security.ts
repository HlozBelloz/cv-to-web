import crypto from 'crypto';
import { NextRequest } from 'next/server';

const SESSION_SECRET = process.env.SESSION_SECRET || 'cv-platform-super-secure-production-secret-at-least-32-chars-long';
export const AUTH_COOKIE_NAME = 'cv_auth_session';

// --- 1. Constant-Time / Timing-Safe String Comparison ---
export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  // Hashing both strings to 32-byte SHA-256 guarantees equal length and constant-time execution
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

// --- 2. Strong Password Hashing with PBKDF2 & Per-User Salt ---
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = 'sha512';

export function hashPassword(password: string): string {
  if (!password) throw new Error('Password cannot be empty');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString('hex');
  return `pbkdf2:${PBKDF2_DIGEST}:${PBKDF2_ITERATIONS}:${salt}:${hash}`;
}

export function isPasswordHashed(stored: string): boolean {
  return typeof stored === 'string' && stored.startsWith('pbkdf2:');
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  if (isPasswordHashed(storedHash)) {
    try {
      const [scheme, algo, iterStr, salt, expectedHash] = storedHash.split(':');
      if (scheme !== 'pbkdf2' || !salt || !expectedHash) return false;
      const iterations = parseInt(iterStr, 10);
      if (isNaN(iterations) || iterations < 1000) return false;

      const calculatedHash = crypto.pbkdf2Sync(password, salt, iterations, PBKDF2_KEYLEN, algo).toString('hex');
      return timingSafeEqualString(calculatedHash, expectedHash);
    } catch {
      return false;
    }
  }

  // Legacy fallback: constant-time plain comparison, then upgrade upon login
  return timingSafeEqualString(password, storedHash);
}

// --- 3. Brute Force Protection & Rate Limiting (Exponential Backoff) ---
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil: number;
}

const failedAttemptsMap = new Map<string, AttemptRecord>();

// Periodically clean up entries older than 24 hours to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of failedAttemptsMap.entries()) {
      if (now - record.lastAttempt > 24 * 60 * 60 * 1000 && record.lockedUntil <= now) {
        failedAttemptsMap.delete(ip);
      }
    }
  }, 30 * 60 * 1000).unref?.();
}

export function getClientIp(req: Request | NextRequest): string {
  const headers = req.headers;
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  return '127.0.0.1';
}

export function checkLoginLockout(ip: string): { locked: boolean; remainingSeconds: number; attempts: number } {
  const record = failedAttemptsMap.get(ip);
  if (!record) return { locked: false, remainingSeconds: 0, attempts: 0 };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { locked: true, remainingSeconds, attempts: record.count };
  }

  // If lockout expired, reset attempts
  if (record.count >= 5 && record.lockedUntil <= now) {
    failedAttemptsMap.delete(ip);
    return { locked: false, remainingSeconds: 0, attempts: 0 };
  }

  return { locked: false, remainingSeconds: 0, attempts: record.count };
}

export function recordFailedLogin(ip: string): { locked: boolean; remainingSeconds: number; attempts: number } {
  const now = Date.now();
  const record = failedAttemptsMap.get(ip) || {
    count: 0,
    firstAttempt: now,
    lastAttempt: now,
    lockedUntil: 0,
  };

  record.count += 1;
  record.lastAttempt = now;

  // Lockout begins on 5th failed attempt: 15 min base cooldown with exponential backoff
  if (record.count >= 5) {
    const exponent = Math.min(record.count - 5, 4); // max multiplier 2^4 = 16x
    const lockoutMs = 15 * 60 * 1000 * Math.pow(2, exponent);
    record.lockedUntil = now + lockoutMs;
  }

  failedAttemptsMap.set(ip, record);

  const locked = record.lockedUntil > now;
  const remainingSeconds = locked ? Math.ceil((record.lockedUntil - now) / 1000) : 0;
  return { locked, remainingSeconds, attempts: record.count };
}

export function clearLoginLockout(ip: string): void {
  failedAttemptsMap.delete(ip);
}

// --- 4. Secure Session Management (256-bit Session Tokens & HMAC-SHA256) ---
export interface SecureSessionPayload {
  sessionId: string; // 256-bit random hex (32 bytes)
  userId: string;
  email: string;
  role: 'admin' | 'user';
  slug?: string;
  name: string;
  iat: number; // seconds
  exp: number; // seconds
}

export function createSessionToken(
  session: Omit<SecureSessionPayload, 'sessionId' | 'iat' | 'exp'>,
  maxAgeSeconds = 7 * 24 * 60 * 60
): string {
  const sessionId = crypto.randomBytes(32).toString('hex'); // 256-bit random token
  const now = Math.floor(Date.now() / 1000);
  const payload: SecureSessionPayload = {
    ...session,
    sessionId,
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SecureSessionPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    if (!timingSafeEqualString(signature, expectedSignature)) {
      return null;
    }

    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const parsed = JSON.parse(jsonStr) as SecureSessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!parsed.exp || parsed.exp < now) {
      return null; // Expired
    }

    return parsed;
  } catch {
    return null;
  }
}

export function rotateSessionToken(
  current: SecureSessionPayload,
  maxAgeSeconds = 7 * 24 * 60 * 60
): string {
  return createSessionToken(
    {
      userId: current.userId,
      email: current.email,
      role: current.role,
      slug: current.slug,
      name: current.name,
    },
    maxAgeSeconds
  );
}

export function getAuthCookieOptions(req?: Request | NextRequest) {
  let isSecure = process.env.NODE_ENV === 'production';
  if (req) {
    const proto = req.headers.get('x-forwarded-proto');
    const host = req.headers.get('host') || '';
    if (proto === 'https' || (req instanceof Request && req.url.startsWith('https://'))) {
      isSecure = true;
    } else if (host.includes('localhost') || host.includes('127.0.0.1')) {
      isSecure = false;
    }
  }

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };
}

// --- 5. CSRF / Origin Validation for State-Changing Requests ---
export function validateCsrfOrigin(req: Request | NextRequest): { valid: boolean; reason?: string } {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const currentHost = hostHeader.split(':')[0].toLowerCase();

  const originHeader = req.headers.get('origin');
  const refererHeader = req.headers.get('referer');

  if (originHeader) {
    try {
      const originUrl = new URL(originHeader);
      const originHost = originUrl.hostname.toLowerCase();
      if (originHost === currentHost) {
        return { valid: true };
      }
      const isOriginLocal = originHost === 'localhost' || originHost === '127.0.0.1';
      const isCurrentLocal = currentHost === 'localhost' || currentHost === '127.0.0.1';
      if (isOriginLocal && isCurrentLocal) {
        return { valid: true };
      }
      return { valid: false, reason: `Origin mismatch (${originHost} !== ${currentHost})` };
    } catch {
      return { valid: false, reason: 'Malformed Origin header' };
    }
  }

  if (refererHeader) {
    try {
      const refererUrl = new URL(refererHeader);
      const refererHost = refererUrl.hostname.toLowerCase();
      if (refererHost === currentHost) {
        return { valid: true };
      }
      const isRefererLocal = refererHost === 'localhost' || refererHost === '127.0.0.1';
      const isCurrentLocal = currentHost === 'localhost' || currentHost === '127.0.0.1';
      if (isRefererLocal && isCurrentLocal) {
        return { valid: true };
      }
      return { valid: false, reason: `Referer mismatch (${refererHost} !== ${currentHost})` };
    } catch {
      return { valid: false, reason: 'Malformed Referer header' };
    }
  }

  const secFetchSite = req.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite === 'cross-site') {
    return { valid: false, reason: 'Cross-site request blocked by Sec-Fetch-Site' };
  }

  return { valid: true };
}
