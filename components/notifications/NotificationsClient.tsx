"use client";

import { useState } from 'react';

interface NotificationRow {
  id: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}

/**
 * NotificationsClient displays a list of notifications and allows the
 * user to mark them all as read.  It is a client component so that
 * interactions (e.g. POST requests) can occur without a full page
 * reload.
 */
export default function NotificationsClient({ initialData }: { initialData: NotificationRow[] }) {
  const [notifications, setNotifications] = useState(initialData);
  const markAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button
          onClick={markAllRead}
          className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Mark all as read
        </button>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-md">
        {notifications.length === 0 && (
          <li className="p-4 text-gray-600 dark:text-gray-400 text-sm">No notifications.</li>
        )}
        {notifications.map((note) => (
          <li key={note.id} className={"p-4 flex justify-between" + (note.read ? '' : ' bg-indigo-50 dark:bg-indigo-900') }>
            <span className="text-sm">
              {note.message}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{note.createdAt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}