import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/activity
 *
 * Returns recent activity logs.  Supports optional query parameters:
 * - contractorId: filter by contractor
 * - actor: filter by actor name
 * - limit: maximum number of logs to return (default 50)
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const contractorId = params.get('contractorId') ?? undefined;
  const actor = params.get('actor') ?? undefined;
  const limit = parseInt(params.get('limit') ?? '50', 10);
  const where: any = {};
  if (contractorId) where.contractorId = contractorId;
  if (actor) where.actor = actor;
  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return NextResponse.json({ data: logs });
}

/**
 * POST /api/activity
 *
 * Creates a new activity log.  The body should contain fields
 * matching the ActivityLog model.  This route is primarily intended
 * for internal use when server actions need to record events.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const log = await prisma.activityLog.create({ data: body });
    return NextResponse.json({ data: log });
  } catch (error: any) {
    console.error('Error creating activity log:', error);
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 });
  }
}