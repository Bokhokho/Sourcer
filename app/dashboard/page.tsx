import { db } from '@/lib/db';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { Notification } from '@prisma/client';

/**
 * Dashboard page summarises the health of your sourcing pipeline.  It
 * displays key metrics, a chart breaking down contractors by status and
 * recent notifications.  All data is fetched server‑side via Prisma
 * queries to ensure consistent SSR and to avoid exposing secrets.
 */
export default async function DashboardPage() {
  // Fetch counts for each status from the database.  The groupBy API
  // returns an array of objects with the grouping key and aggregate
  // values.  We convert it into a lookup map for convenience.
  const group = await db.contractor.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  const statusMap: Record<string, number> = {};
  group.forEach((item) => {
    statusMap[item.status] = item._count.id;
  });
  const total = await db.contractor.count();
  const responsive = statusMap['RESPONSIVE'] ?? 0;
  const quoting = statusMap['QUOTING'] ?? 0;
  const contracted = statusMap['CONTRACTED'] ?? 0;
  const nonResponsive = statusMap['NON_RESPONSIVE'] ?? 0;
  const contacted = statusMap['CONTACTED'] ?? 0;

  const chartData = [
    { name: 'Not Contacted', value: statusMap['NOT_CONTACTED'] ?? 0 },
    { name: 'Contacted', value: contacted },
    { name: 'Responsive', value: responsive },
    { name: 'Quoting', value: quoting },
    { name: 'Contracted', value: contracted },
    { name: 'Non‑responsive', value: nonResponsive },
  ];

  // Fetch recent notifications (limit 5, newest first).
  const notifications: Notification[] = await db.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total" value={total} />
        <MetricCard label="Responsive" value={responsive} />
        <MetricCard label="Contacted" value={contacted} />
        <MetricCard label="Quoting" value={quoting} />
        <MetricCard label="Contracted" value={contracted} />
        <MetricCard label="Non‑responsive" value={nonResponsive} />
      </div>
      {/* Chart section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Status Breakdown</h2>
        <DashboardChart data={chartData} />
      </div>
      {/* Notifications section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Notifications</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-800 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          {notifications.length === 0 && (
            <li className="p-4 text-sm text-gray-500">No notifications yet.</li>
          )}
          {notifications.map((note) => (
            <li key={note.id} className="p-4 flex justify-between items-center">
              <span className="text-sm">
                {note.message}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{note.createdAt.toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}