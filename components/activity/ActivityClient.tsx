"use client";

import { useState, useMemo } from 'react';

interface ActivityRow {
  id: string;
  actor: string | null;
  action: string;
  contractorName: string | null;
  fromStatus: string | null;
  toStatus: string | null;
  fromAssignee: string | null;
  toAssignee: string | null;
  notes: string | null;
  createdAt: string;
}

/**
 * ActivityClient renders a searchable table of activity log entries.
 * It expects data preformatted on the server to include contractor
 * names and stringified dates.  Users can filter by actor or action
 * using the search input.
 */
export default function ActivityClient({ initialData }: { initialData: ActivityRow[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    return initialData.filter((row) => {
      const q = query.toLowerCase();
      return (
        row.actor?.toLowerCase().includes(q) ||
        row.action.toLowerCase().includes(q) ||
        row.contractorName?.toLowerCase().includes(q)
      );
    });
  }, [query, initialData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by actor, action or contractor"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contractor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From → To</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {filtered.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {row.createdAt}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {row.actor || '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {row.action}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {row.contractorName || '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {row.fromStatus || row.fromAssignee
                    ? `${row.fromStatus || row.fromAssignee} → ${row.toStatus || row.toAssignee}`
                    : '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {row.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}