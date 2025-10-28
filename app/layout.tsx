// app/layout.tsx
import "@/app/globals.css";
import Link from "next/link";
import { getActor } from "@/lib/authGate";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Contractor Sourcing",
  description: "Source and manage contractor outreach",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const actor = getActor();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <header className="bg-white dark:bg-gray-800 shadow p-4 flex flex-wrap items-center justify-between">
            <div className="text-xl font-bold tracking-tight">
              <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME || "Contractor Sourcing"}</Link>
            </div>
            <nav className="flex gap-4 mt-2 sm:mt-0">
              <Link href="/gate" className="hover:text-blue-500">Gate</Link>
              <Link href="/importer" className="hover:text-blue-500">Importer</Link>
              <Link href="/responsive" className="hover:text-blue-500">Responsive</Link>
              <Link href="/sourcing" className="hover:text-blue-500">Sourcing</Link>
            </nav>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {actor && <span className="text-sm text-gray-500 dark:text-gray-400">Signed in as {actor}</span>}
              <button
                onClick={() =>
                  document.documentElement.classList.toggle("dark")
                }
                className="border rounded-md px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Toggle Theme
              </button>
            </div>
          </header>

          <main className="p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
