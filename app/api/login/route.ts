import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/login
 *
 * Expects a JSON body with { password: string, actor: string, adminPasscode?: string }
 * Verifies the app password and, if the actor is "Admin", the admin passcode as well.
 * On success sets two httpOnly cookies: "session" to indicate a valid session and
 * "actor" to record the chosen identity.  Returns { ok: true } on success.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, actor, adminPasscode } = body ?? {};
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Missing password' }, { status: 400 });
  }
  if (!actor || typeof actor !== 'string') {
    return NextResponse.json({ error: 'Missing actor' }, { status: 400 });
  }
  if (password !== process.env.APP_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  if (actor === 'Admin') {
    if (!adminPasscode || adminPasscode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Invalid admin passcode' }, { status: 401 });
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // one week
  });
  res.cookies.set('actor', actor, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}