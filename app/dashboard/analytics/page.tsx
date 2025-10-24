import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/**
 * Analytics page showcases more detailed metrics and charts.  This
 * example uses a randomly generated data set to plot a simple line
 * chart.  You can replace the random generator with actual data
 * aggregated from the database.
 */
export default function AnalyticsPage() {
  // Generate a demo series for the last 7 days.  Replace this with
  // aggregated data from your Prisma models as needed.
  const data = Array.from({ length: 7 }).map((_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 10) + 1,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Analytics</h1>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" tick={{ fill: '#888888', fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#888888', fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}