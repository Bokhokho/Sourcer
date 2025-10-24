"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Sun, Moon, Search, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Topbar provides the search input, theme toggle, notification bell and
 * user profile dropdown.  It sits at the top of the main content area.
 */
export function Topbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const pathname = usePathname();

  // Hydrate the dark mode state from the html class on mount.  This
  // ensures SSR/CSR consistency.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  // Toggle dark mode by adding/removing the `dark` class on the html
  // element.  This works with Tailwind's dark: variants.
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    setDarkMode(isDark);
  };

  // Fetch notifications count from the API.  In a real app this would
  // poll or use websockets for real‑time updates.  Here we do a simple
  // fetch on mount and whenever the route changes.
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/notifications/count');
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(data.count ?? 0);
      } catch (err) {
        console.error('failed to fetch notifications count', err);
      }
    }
    fetchCount();
  }, [pathname]);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Left: Search bar or page title placeholder */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        {/* Notifications bell */}
        <Link href="/notifications" className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
        {/* User avatar / profile */}
        <Link href="/profile" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Profile">
          <UserIcon className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}