import { requireSession } from '@/lib/authGate';

/**
 * Profile page.  Allows users to view and update their personal
 * preferences.  Theme and notification settings are planned for
 * future implementation.
 */
export default async function ProfilePage() {
  requireSession();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Personalise your experience.  Profile editing and theme
        selection will be available soon.
      </p>
      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 bg-white dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Profile settings are under construction.</p>
      </div>
    </div>
  );
}