import React from 'react';

/**
 * A simple card that displays a numeric metric with a label.  Use it in
 * grids to summarise counts or values across the dashboard.  You can
 * customise the icon or add additional elements via children.
 */
export function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </div>
    </div>
  );
}