import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function CostBreakdownChart({ mine = 0, regional = 0 }) {
  return (
    <div className="chart-card">
      <h3>Input cost comparison</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={[{ name: 'Your farm', cost: mine }, { name: 'Region avg', cost: regional }]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" fill="#E8A838" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
