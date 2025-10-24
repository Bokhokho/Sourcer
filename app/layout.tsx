import '@/app/globals.css';
import { getActor } from '@/lib/authGate';

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Contractor Sourcing',
  description: 'Source and manage contractor outreach',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const actor = getActor();
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl font-bold">
            {process.env.NEXT_PUBLIC_APP_NAME || 'Contractor Sourcing'}
          </div>
          {actor && (
            <div className="text-sm text-gray-600 mt-2 sm:mt-0">Signed in as: {actor}</div>
          )}
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}