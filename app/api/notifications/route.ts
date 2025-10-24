import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getActor } from '@/lib/authGate';

/**
 * Handle GET requests to /api/notifications.  Returns a list of the
 * latest notifications for the signed in user.  For this demo all
 * notifications are considered global; you could extend the schema to
 * include a userId or actor and filter accordingly.
 */
export async function GET(req: NextRequest) {
  // Ensure the requester is authenticated.  This will throw and
  // redirect to /gate if no valid session cookie is found.
  getActor();

  const notifications = await db.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ notifications });
}

/**
 * POST /api/notifications can be used to mark notifications read or
 * create new ones.  In this simplified implementation we only support
 * marking all notifications as read.
 */
export async function POST(req: NextRequest) {
  getActor();
  const { action } = await req.json();
  if (action === 'markAllRead') {
    await db.notification.updateMany({ data: { read: true } });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
}