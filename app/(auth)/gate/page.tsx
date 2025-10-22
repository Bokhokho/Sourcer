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
    <div className="max-w-md mx-auto mt-16 bg-white shadow-lg p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Access the App</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 0 && (
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter app password"
              required
            />
          </div>
        )}
        {step >= 1 && (
          <div>
            <label className="block mb-1">Select your identity</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              required
            >
              <option value="">-- Choose --</option>
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}
        {step === 2 && (
          <div>
            <label className="block mb-1">Admin passcode</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {step === 0 && 'Next'}
          {step === 1 && (actor === 'Admin' ? 'Next' : 'Login')}
          {step === 2 && 'Login'}
        </button>
      </form>
    </div>
  );
}