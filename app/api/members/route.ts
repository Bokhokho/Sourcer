import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/members
 *
 * Returns a list of active members.  Each member has an id and name.
 */
export async function GET() {
  const members = await prisma.member.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ data: members });
}