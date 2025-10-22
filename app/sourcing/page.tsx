import { requireSession, getActor } from '@/lib/authGate';
import { prisma } from '@/lib/db';
import dynamic from 'next/dynamic';

const SourcingClient = dynamic(() => import('@/components/SourcingClient'), { ssr: false });

export default async function SourcingPage() {
  requireSession();
  const actor = getActor() || '';
  // Determine which members' lists to show.  Admin sees all; others see only their own.
  let visibleMembers: any[] = [];
  if (actor === 'Admin') {
    visibleMembers = await prisma.member.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  } else {
    const member = await prisma.member.findUnique({ where: { name: actor } });
    if (member) visibleMembers = [member];
  }
  // Fetch contractors for each visible member
  const lists: { member: any; contractors: any[] }[] = [];
  for (const m of visibleMembers) {
    const contractors = await prisma.contractor.findMany({
      where: { assignedToId: m.id },
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: true },
    });
    lists.push({ member: { id: m.id, name: m.name }, contractors: contractors.map((c) => ({ ...c })) });
  }
  // All active members for the assignment dropdown
  const allMembers = await prisma.member.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  const plainMembers = allMembers.map((m) => ({ id: m.id, name: m.name }));
  return <SourcingClient lists={lists} members={plainMembers} actor={actor} />;
}