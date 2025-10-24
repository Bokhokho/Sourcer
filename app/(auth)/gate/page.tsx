"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The gate page implements a simple password screen followed by an
 * identity selector.  Users must enter the shared password and then
 * pick their identity (one of the seeded members or **Admin**).  If
 * **Admin** is selected a second passcode prompt is shown.  On
 * successful authentication the user is redirected to the importer.
 */
export default function GatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState('');
  const [actor, setActor] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch member names for the identity dropdown
    fetch('/api/members')
      .then((res) => res.json())
      .then((data) => setMembers(data.data ?? []))
      .catch(() => setMembers([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 0) {
      // Proceed to identity selection
      setError('');
      if (!password) {
        setError('Please enter the application password');
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!actor) {
        setError('Please select your identity');
        return;
      }
      if (actor === 'Admin') {
        // Show admin passcode input
        setStep(2);
      } else {
        await login();
      }
    } else if (step === 2) {
      if (!adminPasscode) {
        setError('Please enter the admin passcode');
        return;
      }
      await login();
    }
  }

  async function login() {
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        actor,
        adminPasscode: actor === 'Admin' ? adminPasscode : undefined,
      }),
    });
    if (res.ok) {
      // Redirect to importer by default
      router.push('/importer');
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || 'Authentication failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center space-y-2">
          {/* Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
          >
            <path
              fillRule="evenodd"
              d="M5.5 3.75A2.75 2.75 0 0 1 8.25 1h7.5A2.75 2.75 0 0 1 18.5 3.75v16.5a.75.75 0 0 1-1.146.629l-5.854-3.784a.75.75 0 0 0-.8 0l-5.854 3.784A.75.75 0 0 1 5.5 20.25V3.75Z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Welcome to Sorcerer
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your password to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {step === 0 && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter app password"
                required
              />
            </div>
          )}
          {step >= 1 && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Identity</label>
              <select
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                required
              >
                <option value="">-- Select --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Admin passcode</label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                required
              />
            </div>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {step === 0 && 'Continue'}
            {step === 1 && (actor === 'Admin' ? 'Continue' : 'Login')}
            {step === 2 && 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}