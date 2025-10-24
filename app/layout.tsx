import '@/app/globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { getActor } from '@/lib/authGate';

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Sorcerer',
  description: 'Your smart assistant for contractor sourcing',
};

/**
 * Root layout wraps all pages with a sidebar and topbar to provide a
 * consistent dashboard experience.  It also loads the global CSS and
 * sets up the HTML structure required for dark mode toggling.  Server
 * side, we hydrate actor information for gating and potential use in
 * client components via cookies.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // We invoke getActor() server side to ensure authentication and
  // redirect unauthenticated users from server components.  It sets
  // cookies accordingly and may throw redirects.  The returned value
  // is not currently used in this layout but could be passed via
  // context providers or props to child components if needed.
  getActor();
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}