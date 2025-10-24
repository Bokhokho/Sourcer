import { requireSession } from '@/lib/authGate';
import { prisma } from '@/lib/db';

/**
 * Reports page offers CSV export of contractor lists filtered by status
 * and assignee.  Users can select criteria and generate the report via
 * the existing /api/export endpoint.  Future enhancements may add PDF
 * export and scheduled reporting.
 */
export default async function ReportsPage() {
  requireSession();
  const members = await prisma.member.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  const statuses = ['NOT_CONTACTED','CONTACTED','RESPONSIVE','QUOTING','CONTRACTED','NON_RESPONSIVE'];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Export your contractors to CSV for further analysis.  Select
        optional filters below before generating.
      </p>
      <form className="flex flex-col md:flex-row gap-4" action="/api/export" method="get">
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
          <select name="status" id="status" className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800">
            <option value="">All</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="member" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Assigned To</label>
          <select name="assignedToId" id="member" className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800">
            <option value="">All</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">
            Download CSV
          </button>
        </div>
      </form>
    </div>
  );
}