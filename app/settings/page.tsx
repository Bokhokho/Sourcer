import { requireSession } from '@/lib/authGate';

/**
 * Settings page.  Exposes environment variables in read‑only mode and
 * provides guidance on how to update them via the Vercel dashboard.
 */
export default async function SettingsPage() {
  requireSession();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Manage application secrets and configuration.  For security
        reasons the values shown here are read‑only.  To change
        passwords or API keys, update your <code>.env</code> or Vercel
        environment variables and redeploy.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 bg-white dark:bg-gray-800">
          <h2 className="font-medium mb-2">Authentication</h2>
          <dl className="text-sm space-y-1">
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">App Password</dt>
              <dd className="text-gray-900 dark:text-gray-200">••••••</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Admin Passcode</dt>
              <dd className="text-gray-900 dark:text-gray-200">••••••</dd>
            </div>
          </dl>
        </div>
        <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 bg-white dark:bg-gray-800">
          <h2 className="font-medium mb-2">API Keys</h2>
          <dl className="text-sm space-y-1">
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Google Maps API Key</dt>
              <dd className="text-gray-900 dark:text-gray-200">••••••</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}