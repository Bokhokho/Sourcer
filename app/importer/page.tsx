"use client";

import { useState, useEffect } from "react";

export default function ImporterPage() {
  const [filters, setFilters] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/importer?filter=${encodeURIComponent(filters)}`);
      const json = await res.json();
      setResults(json?.data ?? []);
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
          Solicitation Importer
        </h2>

        <div className="flex gap-3 mb-6">
          <input
            value={filters}
            onChange={(e) => setFilters(e.target.value)}
            placeholder="Search or filter opportunities..."
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-900"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 py-2 text-left text-sm font-semibold">Title</th>
                <th className="px-3 py-2 text-left text-sm font-semibold">Agency</th>
                <th className="px-3 py-2 text-left text-sm font-semibold">Due Date</th>
                <th className="px-3 py-2 text-left text-sm font-semibold">Link</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No results found.
                  </td>
                </tr>
              )}
              {results.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">{r.agency}</td>
                  <td className="px-3 py-2">{r.dueDate}</td>
                  <td className="px-3 py-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
