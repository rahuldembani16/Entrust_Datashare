import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function YieldComparisonChart({ mine = 0, regional = 0 }) {
  return (
    <div className="chart-card">
      <h3>Yield comparison</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={[{ name: 'Your farm', yield: mine }, { name: 'Region avg', yield: regional }]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="yield" fill="#4A7C59" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
