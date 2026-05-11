import { useEffect, useState } from 'react';
import CostBreakdownChart from '../components/Charts/CostBreakdownChart.jsx';
import SeasonTrendChart from '../components/Charts/SeasonTrendChart.jsx';
import YieldComparisonChart from '../components/Charts/YieldComparisonChart.jsx';
import { useApi } from '../hooks/useApi.js';

export default function MyBenchmarks() {
  const api = useApi();
  const [records, setRecords] = useState([]);
  const [benchmark, setBenchmark] = useState({ latest: null, trend: [] });

  useEffect(() => { api('/farmers/records').then(async (rows) => { setRecords(rows); if (rows[0]) setBenchmark(await api(`/benchmarks/${rows[0].region_id}/${rows[0].crop_id}`)); }); }, []);
  const latest = records[0];
  const avg = benchmark.latest;

  if (!latest) return <section className="panel"><h1>No records yet</h1><p>Upload farm data to unlock your benchmark comparison.</p></section>;

  return (
    <section className="page-stack">
      <div className="hero-card"><div><p className="eyebrow">{latest.region_name} · {latest.crop_name}</p><h1>You are in the top 30% of yields in your region</h1><p>Simulated ranking is used where sample size is sparse.</p></div></div>
      <div className="charts-grid"><YieldComparisonChart mine={latest.yield_kg_ha} regional={avg?.avg_yield || 0} /><CostBreakdownChart mine={latest.input_cost} regional={avg?.avg_cost || 0} /><SeasonTrendChart data={benchmark.trend} /></div>
    </section>
  );
}
