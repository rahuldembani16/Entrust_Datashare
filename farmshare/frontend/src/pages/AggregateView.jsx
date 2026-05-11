import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApi } from '../hooks/useApi.js';

export default function AggregateView({ title, subtitle }) {
  const api = useApi();
  const [rows, setRows] = useState([]);
  const [regions, setRegions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filters, setFilters] = useState({ region_id: '', crop_id: '', season: '' });

  useEffect(() => { api('/regions').then(setRegions); api('/crops').then(setCrops); }, []);
  useEffect(() => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    api(`/benchmarks?${params}`).then(setRows);
  }, [filters.region_id, filters.crop_id, filters.season]);

  return (
    <section className="page-stack">
      <div className="hero-card"><div><p className="eyebrow">Showing aggregated data only</p><h1>{title}</h1><p>{subtitle}</p></div><span className="watermark">Individual records are never exposed</span></div>
      <div className="filter-row"><select value={filters.region_id} onChange={(e) => setFilters({ ...filters, region_id: e.target.value })}><option value="">All regions</option>{regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select><select value={filters.crop_id} onChange={(e) => setFilters({ ...filters, crop_id: e.target.value })}><option value="">All crops</option>{crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input placeholder="Season" value={filters.season} onChange={(e) => setFilters({ ...filters, season: e.target.value })} /></div>
      <div className="chart-card wide"><ResponsiveContainer width="100%" height={300}><BarChart data={rows.slice(0, 16)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="crop_name" /><YAxis /><Tooltip /><Bar dataKey="avg_yield" fill="#4A7C59" /></BarChart></ResponsiveContainer></div>
      <div className="table-wrap"><table><thead><tr><th>Region</th><th>Crop</th><th>Season</th><th>Avg yield</th><th>Avg cost</th><th>Sample</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.region_id}-${row.crop_id}-${row.season}`}><td>{row.region_name}</td><td>{row.crop_name}</td><td>{row.season}</td><td>{row.avg_yield}</td><td>{row.avg_cost}</td><td>{row.sample_size}</td></tr>)}</tbody></table></div>
    </section>
  );
}
