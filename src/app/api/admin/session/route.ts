import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ok = await getAdminSession();
  return NextResponse.json({ ok });
}
