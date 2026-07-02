import crypto from 'crypto';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'cmm-construtora-secret-token-key-2026-high-standards-secure';
const COOKIE_NAME = 'cmm_session';

// Hashing Password using Node's native crypto (PBKDF2)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// JWT helpers using jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { userId: number; email: string; role: string; name: string }) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as { userId: number; email: string; role: string; name: string };
  } catch (error) {
    return null;
  }
}

// Session Helpers for Server Components / Actions
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function setSession(user: { id: number; email: string; role: string; name: string }) {
  const token = await signToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
