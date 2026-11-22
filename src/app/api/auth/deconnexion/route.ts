import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

/** POST /api/auth/deconnexion — supprime le cookie de session. */
export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
