"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Upload,
  UserCheck,
  Users,
  Activity,
  Settings,
  FileText,
  HelpCircle,
  Bell,
  User as UserIcon,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the navigation structure for the sidebar.  To add a new page,
// simply append an object here with the desired href, label and
// associated icon from lucide-react.  The order of items controls
// their appearance in the sidebar.  Icons are optional but recommended.
const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/importer', label: 'Importer', icon: Upload },
  { href: '/responsive', label: 'Responsive', icon: UserCheck },
  { href: '/sourcing', label: 'Sourcing', icon: Users },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/support', label: 'Support', icon: HelpCircle },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

/**
 * Sidebar component renders a vertical navigation menu with a collapse
 * toggle.  It highlights the current route and reveals labels on hover
 * when collapsed.  The sidebar can be collapsed to icons only on
 * smaller screens to save space.  It is intended to be used from
 * within the root layout and persists across pages.
 */
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        collapsed ? 'w-16' : 'w-56',
        'h-screen sticky top-0 left-0 transition-all'
      )}
    >
      <div className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          {/* Logo placeholder; replace with your own graphic if desired */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
          >
            <path
              fillRule="evenodd"
              d="M5.5 3.75A2.75 2.75 0 0 1 8.25 1h7.5A2.75 2.75 0 0 1 18.5 3.75v16.5a.75.75 0 0 1-1.146.629l-5.854-3.784a.75.75 0 0 0-.8 0l-5.854 3.784A.75.75 0 0 1 5.5 20.25V3.75Z"
              clipRule="evenodd"
            />
          </svg>
          {!collapsed && <span className="font-semibold text-lg">Sorcerer</span>}
        </Link>
        {/* Collapse/expand toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {/* Icon for toggler: simple arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn(
              'w-5 h-5 transition-transform',
              collapsed ? 'rotate-180' : 'rotate-0'
            )}
          >
            <path
              fillRule="evenodd"
              d="M12.53 8.47a.75.75 0 0 0-1.06 1.06l1.97 1.97-1.97 1.97a.75.75 0 0 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}