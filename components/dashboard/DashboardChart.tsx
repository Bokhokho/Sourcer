"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import React from 'react';

interface ChartDataItem {
  name: string;
  value: number;
}

/**
 * DashboardChart renders a simple bar and pie chart based on status data.
 * It accepts an array of objects with `name` and `value` properties.  The
 * component uses recharts, which must be imported in the page.  Make
 * sure this component is rendered on the client (use client) because
 * recharts relies on browser APIs.
 */
export function DashboardChart({ data }: { data: ChartDataItem[] }) {
  // Colour palette for pie segments.  Extend or customise as needed.
  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];
  return (
    <div className="w-full h-64 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#888888', fontSize: 12 }} />
            <YAxis tick={{ fill: '#888888', fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}