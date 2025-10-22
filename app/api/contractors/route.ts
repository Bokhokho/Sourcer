import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { normalizeAddress, normalizeName } from '@/lib/normalize';

/**
 * GET /api/contractors
 *
 * Fetches contractors with optional filtering.  Supports the following
 * query parameters:
 * - page (default 1)
 * - limit (default 20)
 * - status (one of the Status enum)
 * - assignedTo (member id or "self" to use the current actor)
 * - city, state
 * - q (free text search on name/keywords)
 *
 * The result is paginated and includes a total count.  Non‑admin
 * callers will only see their own assigned contractors.
 */
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const page = parseInt(search.get('page') ?? '1', 10);
  const limit = parseInt(search.get('limit') ?? '20', 10);
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
    // look up member id for current actor
    const member = await prisma.member.findUnique({ where: { name: actor } });
    actorMemberId = member?.id;
  }
  // Build where clause
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
  // Assignment filter: if assignedTo provided or actor is not admin
  if (assignedTo && assignedTo !== 'self') {
    where.assignedToId = assignedTo;
  } else if (assignedTo === 'self' && actorMemberId) {
    where.assignedToId = actorMemberId;
  } else if (!isAdmin) {
    if (actorMemberId) {
      where.assignedToId = actorMemberId;
    } else {
      // if no actor (should not happen), return empty
      where.assignedToId = null;
    }
  }
  const total = await prisma.contractor.count({ where });
  const contractors = await prisma.contractor.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: { assignedTo: true },
  });
  return NextResponse.json({ data: contractors, page, limit, total });
}

/**
 * POST /api/contractors
 *
 * Performs a bulk upsert of contractors imported from the Google Places
 * API.  Expects a body of the form { contractors: NormalizedPlace[] }.
 * De‑duplicates entries based on placeId or (name, address).  Returns
 * counts of how many were inserted and updated.  Also writes an
 * ActivityLog entry summarising the import.
 */
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const actor = cookieStore.get('actor')?.value ?? 'Unknown';
  let inserted = 0;
  let updated = 0;
  try {
    const body = await req.json();
    const contractors: any[] = body.contractors ?? [];
    for (const item of contractors) {
      const placeId: string | undefined = item.placeId ?? undefined;
      const name: string = item.name;
      const address: string = item.address;
      const normalizedName = normalizeName(name);
      const normalizedAddress = normalizeAddress(address);
      let existing = null;
      if (placeId) {
        existing = await prisma.contractor.findUnique({ where: { placeId } });
      }
      if (!existing) {
        existing = await prisma.contractor.findFirst({ where: { name, address } });
      }
      if (existing) {
        // update existing record with new info
        await prisma.contractor.update({
          where: { id: existing.id },
          data: {
            placeId: placeId ?? existing.placeId,
            name,
            address,
            city: item.city,
            state: item.state,
            zip: item.zip,
            mainService: item.main_service,
            keywords: item.keywords,
            contactInfo: item.contact_info,
          },
        });
        updated++;
      } else {
        await prisma.contractor.create({
          data: {
            placeId,
            name,
            address,
            city: item.city,
            state: item.state,
            zip: item.zip,
            mainService: item.main_service,
            keywords: item.keywords,
            contactInfo: item.contact_info,
          },
        });
        inserted++;
      }
    }
    // Log activity
    await prisma.activityLog.create({
      data: {
        actor: actor,
        action: 'IMPORT',
        notes: JSON.stringify({ inserted, updated }),
      },
    });
    return NextResponse.json({ inserted, updated });
  } catch (error: any) {
    console.error('Error importing contractors:', error);
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 });
  }
}

/**
 * PATCH /api/contractors
 *
 * Updates a single contractor.  Expects body { id, status?, assignedToId?, notes? }.
 * Performs optimistic updates on the contractor and records activity
 * logs describing what changed.  Only the fields present in the body
 * are modified.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, assignedToId, notes } = body;
    if (!id) {
      return NextResponse.json({ error: 'Missing contractor id' }, { status: 400 });
    }
    const cookieStore = cookies();
    const actor = cookieStore.get('actor')?.value ?? 'Unknown';
    const contractor = await prisma.contractor.findUnique({ where: { id } });
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }
    const updates: any = {};
    const logs: any[] = [];
    // Status change
    if (status && status !== contractor.status) {
      updates.status = status;
      logs.push({
        actor,
        action: 'STATUS_CHANGE',
        contractorId: id,
        fromStatus: contractor.status,
        toStatus: status,
      });
    }
    // Assignment change
    if (assignedToId && assignedToId !== contractor.assignedToId) {
      updates.assignedToId = assignedToId;
      logs.push({
        actor,
        action: 'ASSIGN_CHANGE',
        contractorId: id,
        fromAssignee: contractor.assignedToId,
        toAssignee: assignedToId,
      });
    }
    // Notes change
    if (typeof notes === 'string' && notes !== contractor.notes) {
      updates.notes = notes;
      logs.push({
        actor,
        action: 'NOTES_EDIT',
        contractorId: id,
        notes,
      });
    }
    if (Object.keys(updates).length > 0) {
      await prisma.contractor.update({ where: { id }, data: updates });
    }
    // Create activity logs in parallel
    for (const log of logs) {
      await prisma.activityLog.create({ data: log });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error updating contractor:', error);
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 });
  }
}