import { requireSession, getActor } from '@/lib/authGate';
import { prisma } from '@/lib/db';
import dynamic from 'next/dynamic';

// Dynamically import the client wrapper so that it only runs on the client
const ResponsiveClient = dynamic(() => import('@/components/ResponsiveClient'), { ssr: false });

export default async function ResponsivePage() {
  requireSession();
  const actor = getActor() || '';
  // Determine the current member id if the actor is not admin
  let myMemberId: string | null = null;
  if (actor && actor !== 'Admin') {
    const m = await prisma.member.findUnique({ where: { name: actor } });
    myMemberId = m?.id ?? null;
  }
  // Fetch all contractors with status=RESPONSIVE
  const contractors = await prisma.contractor.findMany({
    where: { status: 'RESPONSIVE' },
    orderBy: { createdAt: 'desc' },
    include: { assignedTo: true },
  });
  const members = await prisma.member.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  const plainContractors = contractors.map((c) => ({ ...c })) as any;
  const plainMembers = members.map((m) => ({ id: m.id, name: m.name }));
  return (
    <ResponsiveClient
      initialData={plainContractors}
      members={plainMembers}
      actor={actor}
      myMemberId={myMemberId}
    />
  );
}