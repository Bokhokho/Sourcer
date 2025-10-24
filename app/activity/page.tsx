import { requireSession } from '@/lib/authGate';
import { prisma } from '@/lib/db';
import dynamic from 'next/dynamic';

const ActivityClient = dynamic(() => import('@/components/activity/ActivityClient'), { ssr: false });

/**
 * Full Activity Log page.  Fetches the most recent activity entries and
 * passes them to a client component for search and display.  Only
 * users with a session can access this page.
 */
export default async function ActivityPage() {
  requireSession();
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { contractor: true },
  });
  const data = logs.map((log) => ({
    id: log.id,
    actor: log.actor,
    action: log.action,
    contractorName: log.contractor?.name ?? null,
    fromStatus: log.fromStatus ?? null,
    toStatus: log.toStatus ?? null,
    fromAssignee: log.fromAssignee ?? null,
    toAssignee: log.toAssignee ?? null,
    notes: log.notes ?? null,
    createdAt: log.createdAt.toLocaleString(),
  }));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Activity Log</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Review all actions performed across the platform.  Use the search box to filter by actor or action.
      </p>
      <ActivityClient initialData={data} />
    </div>
  );
}