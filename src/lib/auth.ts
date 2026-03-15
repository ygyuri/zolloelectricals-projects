import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const ADMIN_COOKIE = 'zollo_admin_session';
const SESSION_TTL = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) return '';
  return s;
}

function sign(payload: object): string {
  const secret = getSecret();
  const data = JSON.stringify(payload);
  const sig = createHmac('sha256', secret).update(data).digest('base64url');
  return Buffer.from(JSON.stringify({ ...payload, sig }), 'utf8').toString('base64url');
}

function verify(token: string): { user: string } | null {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const decoded = JSON.parse(
      Buffer.from(token, 'base64url').toString('utf8')
    );
    const { sig, ...payload } = decoded;
    const data = JSON.stringify(payload);
    const expected = createHmac('sha256', secret).update(data).digest('base64url');
    if (sig?.length !== expected.length || !timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))) return null;
    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    return { user: payload.user };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verify(token) !== null;
}

async function hashSession(username: string): Promise<string> {
  const payload = {
    user: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL,
  };
  return sign(payload);
}

export async function setAdminSessionCookie(username: string): Promise<string> {
  const token = await hashSession(username);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL,
    path: '/',
  });
  return token;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function validateWordPressUser(
  username: string,
  password: string
): Promise<boolean> {
  const base = process.env.WORDPRESS_SITE_URL || 'https://zolloelectricals.com';
  const url = `${base.replace(/\/$/, '')}/wp-json/wp/v2/users/me`;
  const credentials = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}
