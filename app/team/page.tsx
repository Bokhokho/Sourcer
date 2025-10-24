import { requireSession } from '@/lib/authGate';
import { prisma } from '@/lib/db';

/**
 * Team management page.  Displays a list of current members and allows
 * future enhancements like adding or removing members.  Only active
 * members are shown for now.
 */
export default async function TeamPage() {
  requireSession();
  const members = await prisma.member.findMany({ orderBy: { name: 'asc' } });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Team</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Manage team members.  This section will allow adding, editing and deleting members in future releases.
      </p>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-2 whitespace-nowrap">{member.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {member.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">Active</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}