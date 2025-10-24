import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getActor } from '@/lib/authGate';

/**
 * GET /api/notifications/count returns the number of unread notifications.
 */
export async function GET(req: NextRequest) {
  getActor();
  const count = await db.notification.count({ where: { read: false } });
  return NextResponse.json({ count });
}