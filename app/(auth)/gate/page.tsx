"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [actor, setActor] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(data.data ?? []))
      .catch(() => setMembers([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (step === 0 && !password) return setError("Please enter the app password");
    if (step === 1 && !actor) return setError("Please select your identity");
    if (step === 2 && !adminPasscode) return setError("Please enter the admin passcode");

    if (step === 0) setStep(1);
    else if (step === 1 && actor === "Admin") setStep(2);
    else await login();
  }

  async function login() {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, actor, adminPasscode }),
    });
    if (res.ok) router.push("/importer");
    else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Authentication failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
          Welcome to Contractor Sourcing
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 0 && (
            <div>
              <label className="block mb-2 text-sm font-medium">App Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900"
                placeholder="Enter password"
              />
            </div>
          )}

          {step >= 1 && (
            <div>
              <label className="block mb-2 text-sm font-medium">Select Identity</label>
              <select
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900"
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
              <label className="block mb-2 text-sm font-medium">Admin Passcode</label>
              <input
                type="password"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900"
                placeholder="Enter admin code"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 mt-2 transition-colors duration-200"
          >
            {step === 0 && "Next"}
            {step === 1 && (actor === "Admin" ? "Next" : "Login")}
            {step === 2 && "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
