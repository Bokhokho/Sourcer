import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { buildCsv } from '@/lib/csv';

/**
 * GET /api/export
 *
 * Exports contractors matching the provided filters as a CSV file.  The
 * query parameters mirror those accepted by `GET /api/contractors`.
 * The response is streamed with a `Content-Disposition` header so
 * browsers treat it as a file download.  Only the current actor’s
 * allowed records are exported.
 */
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const status = search.get('status') ?? undefined;
  const assignedTo = search.get('assignedTo') ?? undefined;
  const city = search.get('city') ?? undefined;
  const state = search.get('state') ?? undefined;
  const q = search.get('q') ?? undefined;
  const cookieStore = cookies();
  const actor = cookieStore.get('actor')?.value;
  let actorMemberId: string | undefined;
  let isAdmin = false;
  if (actor === 'Admin') {
    isAdmin = true;
  } else if (actor) {
    const member = await prisma.member.findUnique({ where: { name: actor } });
    actorMemberId = member?.id;
  }
  const where: any = {};
  if (status) where.status = status;
  if (city) where.city = city;
  if (state) where.state = state;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { keywords: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (assignedTo && assignedTo !== 'self') {
    where.assignedToId = assignedTo;
  } else if (assignedTo === 'self' && actorMemberId) {
    where.assignedToId = actorMemberId;
  } else if (!isAdmin) {
    if (actorMemberId) {
      where.assignedToId = actorMemberId;
    } else {
      where.assignedToId = null;
    }
  }
  const contractors = await prisma.contractor.findMany({ where });
  const csvString = buildCsv(contractors);
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const scope = actor === 'Admin' ? 'all' : actor ?? 'export';
  const filename = `contractors_${scope}_${today}.csv`;
  return new Response(csvString, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}