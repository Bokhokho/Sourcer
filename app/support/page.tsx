import { requireSession } from '@/lib/authGate';

/**
 * Support page.  Provides guidance on how to get help and contact
 * information for the Sorcerer team.  Use this page to link to
 * documentation, FAQs or support channels.
 */
export default async function SupportPage() {
  requireSession();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Support</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Need help?  Check our FAQ below or reach out to us directly.
      </p>
      <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <h2 className="text-lg font-medium">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><span className="font-medium">Why can’t I import businesses?</span> Ensure your Google API key is set correctly in settings.  Imports may also be throttled based on quota.</li>
          <li><span className="font-medium">How do I add new team members?</span> Visit the Team page to see current members.  Adding/deleting members will be available in a future release.</li>
          <li><span className="font-medium">Where can I see recent changes?</span> The Activity Log page lists all status changes, assignments and imports.</li>
        </ul>
        <h2 className="text-lg font-medium">Contact Us</h2>
        <p>If you need direct assistance, email us at <a href="mailto:support@sorcerer.app" className="text-indigo-600 dark:text-indigo-400 underline">support@sorcerer.app</a> or join our Slack community.</p>
      </div>
    </div>
  );
}