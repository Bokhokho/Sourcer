"use client";

import { useState } from 'react';

interface NormalizedPlace {
  placeId?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  main_service: string;
  keywords?: string;
  contact_info?: {
    phone?: string;
    website?: string;
    email?: string;
  };
}

/**
 * ImportForm encapsulates the search and import workflow.  Users can
 * specify search terms, submit a request to the server‑side proxy
 * `/api/google-places`, preview the normalized results, select which
 * ones to import, and then import them into the database via
 * `/api/contractors`.
 */
export default function ImportForm() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [cityOrZip, setCityOrZip] = useState('');
  const [radius, setRadius] = useState(5000);
  const [maxPages, setMaxPages] = useState(1);
  const [results, setResults] = useState<NormalizedPlace[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importSummary, setImportSummary] = useState<{ inserted: number; updated: number } | null>(null);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setImportSummary(null);
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/google-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword || undefined,
          category: category || undefined,
          location: { cityOrZip },
          radiusMeters: radius,
          maxPages: maxPages,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to search');
      }
      setResults(json.results ?? []);
      setSelected(new Set());
    } catch (err: any) {
      setError(err.message || 'Error searching places');
    } finally {
      setLoading(false);
    }
  }

  function toggleSelected(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  async function handleImport() {
    setError('');
    const contractors = results.filter((_, idx) => selected.has(idx));
    if (contractors.length === 0) {
      setError('Please select at least one result to import');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractors }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to import');
      }
      setImportSummary(json);
    } catch (err: any) {
      setError(err.message || 'Error importing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-medium">Search Contractors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Keyword</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. plumber"
            />
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. plumbing contractor"
            />
          </div>
          <div>
            <label className="block mb-1">City or ZIP</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={cityOrZip}
              onChange={(e) => setCityOrZip(e.target.value)}
              placeholder="Tangier, 90000"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Radius (meters)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
              min={100}
              step={100}
            />
          </div>
          <div>
            <label className="block mb-1">Max pages</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value, 10) || 1)}
              min={1}
              max={3}
            />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
      {results.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2"></th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">City</th>
                  <th className="p-2">State</th>
                  <th className="p-2">Zip</th>
                  <th className="p-2">Service</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.has(idx)}
                        onChange={() => toggleSelected(idx)}
                      />
                    </td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.address}</td>
                    <td className="p-2">{row.city}</td>
                    <td className="p-2">{row.state}</td>
                    <td className="p-2">{row.zip}</td>
                    <td className="p-2">{row.main_service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleImport}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading || selected.size === 0}
          >
            {loading ? 'Importing…' : 'Import Selected'}
          </button>
          {importSummary && (
            <p className="mt-2 text-sm text-gray-700">
              Imported {importSummary.inserted} new, updated {importSummary.updated} existing.
            </p>
          )}
        </div>
      )}
    </div>
  );
}