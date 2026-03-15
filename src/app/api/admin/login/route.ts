import { NextRequest, NextResponse } from 'next/server';
import { validateWordPressUser, setAdminSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }
    const valid = await validateWordPressUser(
      String(username).trim(),
      String(password)
    );
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    await setAdminSessionCookie(String(username).trim());
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/admin/login', e);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
