import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function SeasonTrendChart({ data = [] }) {
  return (
    <div className="chart-card wide">
      <h3>Regional trend over time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="season" />
          <YAxis />
          <Tooltip />
          <Line dataKey="avg_yield" stroke="#4A7C59" strokeWidth={3} dot={{ r: 5 }} />
          <Line dataKey="avg_cost" stroke="#9C6B30" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
