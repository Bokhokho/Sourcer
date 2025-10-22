"use client";

import { useState } from 'react';

export interface Member {
  id: string;
  name: string;
}

export interface ContractorRow {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  mainService: string;
  keywords?: string | null;
  contactInfo?: any;
  status: string;
  assignedTo?: Member | null;
  assignedToId?: string | null;
  notes?: string | null;
}

interface ContractorTableProps {
  data: ContractorRow[];
  members: Member[];
  actor: string;
  /** If provided, the member id for the current actor.  Used for the
   * "Move to Me" button on the responsive page. */
  myMemberId?: string | null;
  /** Whether to display the "Move to Me" button for non‑admins. */
  showMoveToMe?: boolean;
  onUpdated?: () => void;
}

/**
 * Display a list of contractors with inline editing of status and assignee.
 * Local edits are kept in a transient state until the user hits the
 * "Save" button on each row.  The component respects the current
 * actor: Admins can assign to anyone, whereas regular members cannot
 * change assignment.
 */
export default function ContractorTable({ data, members, actor, myMemberId, showMoveToMe, onUpdated }: ContractorTableProps) {
  const statuses = [
    'NOT_CONTACTED',
    'CONTACTED',
    'RESPONSIVE',
    'QUOTING',
    'CONTRACTED',
    'NON_RESPONSIVE',
  ];
  const isAdmin = actor === 'Admin';
  // edits stores per‑row changes before they are saved
  const [edits, setEdits] = useState<Record<string, { status?: string; assignedToId?: string }>>({});

  function onFieldChange(id: string, field: 'status' | 'assignedToId', value: string) {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  async function saveRow(id: string) {
    const update = edits[id] || {};
    // Only send fields that actually changed
    const body: any = { id };
    if (update.status) body.status = update.status;
    if (update.assignedToId !== undefined) body.assignedToId = update.assignedToId || null;
    await fetch('/api/contractors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    // Clear the edit entry
    setEdits((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (onUpdated) onUpdated();
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
            <th className="p-2">Service</th>
            <th className="p-2">Status</th>
            <th className="p-2">Assignee</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const current = edits[row.id] || {};
            const statusValue = current.status ?? row.status;
            const assignedValue = current.assignedToId ?? row.assignedToId ?? row.assignedTo?.id ?? '';
            return (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-gray-500 text-xs">{row.address}</div>
                </td>
                <td className="p-2">
                  {row.city}, {row.state} {row.zip}
                </td>
                <td className="p-2">{row.mainService}</td>
                <td className="p-2">
                  <select
                    value={statusValue}
                    onChange={(e) => onFieldChange(row.id, 'status', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  {isAdmin ? (
                    <select
                      value={assignedValue}
                      onChange={(e) => onFieldChange(row.id, 'assignedToId', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{row.assignedTo?.name ?? '-'}</span>
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => saveRow(row.id)}
                    disabled={!edits[row.id]}
                  >
                    Save
                  </button>
                  {!isAdmin && showMoveToMe && myMemberId && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      onClick={async () => {
                        await fetch('/api/contractors', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: row.id, assignedToId: myMemberId }),
                        });
                        if (onUpdated) onUpdated();
                      }}
                    >
                      Move to Me
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}