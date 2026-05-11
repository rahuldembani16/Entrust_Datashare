import { useEffect, useState } from 'react';
import CropSelector from '../components/CropSelector.jsx';
import MotivationPicker from '../components/MotivationPicker.jsx';
import YieldComparisonChart from '../components/Charts/YieldComparisonChart.jsx';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function UploadData() {
  const api = useApi();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [crops, setCrops] = useState([]);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ crop_id: '', region_id: user.region_id, season: '2024B', yield_kg_ha: 2600, input_cost: 620, water_use: 160, notes: '', motivation: 'benchmarking' });

  useEffect(() => { api('/crops').then(setCrops); }, []);

  async function submit() {
    const record = await api('/farmers/records', { method: 'POST', body: JSON.stringify(form) });
    const benchmark = await api(`/benchmarks/${form.region_id}/${form.crop_id}`);
    setResult({ record, benchmark: benchmark.latest });
  }

  if (result) return <section className="page-stack"><div className="hero-card"><div><p className="eyebrow">Uploaded successfully</p><h1>Your benchmark is ready</h1><p>Immediate value: compare your new record with the regional average.</p></div></div><YieldComparisonChart mine={result.record.yield_kg_ha} regional={result.benchmark?.avg_yield || result.record.yield_kg_ha * 0.9} /></section>;

  return (
    <section className="page-stack">
      <div className="section-heading"><p className="eyebrow">Step {step} of 3</p><h1>Upload farm data</h1></div>
      {step === 1 && <div className="panel"><h2>What are you farming?</h2><CropSelector crops={crops} selected={form.crop_id} onSelect={(crop_id) => setForm({ ...form, crop_id })} /><button className="primary-button" disabled={!form.crop_id} onClick={() => setStep(2)}>Continue</button></div>}
      {step === 2 && <div className="panel"><h2>Your farm data</h2><div className="form-grid"><label>Season<input value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} /></label><label>Yield kg/ha<input type="number" value={form.yield_kg_ha} onChange={(e) => setForm({ ...form, yield_kg_ha: Number(e.target.value) })} /></label><label>Input cost<input type="number" value={form.input_cost} onChange={(e) => setForm({ ...form, input_cost: Number(e.target.value) })} /></label><label>Water use<input type="number" value={form.water_use} onChange={(e) => setForm({ ...form, water_use: Number(e.target.value) })} /></label></div><textarea placeholder="Optional notes or pasted CSV text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /><button className="secondary-button" type="button">Audio/Video upload coming soon</button><button className="primary-button" onClick={() => setStep(3)}>Continue</button></div>}
      {step === 3 && <div className="panel"><h2>Why are you sharing?</h2><MotivationPicker selected={form.motivation} onSelect={(motivation) => setForm({ ...form, motivation })} /><button className="primary-button" onClick={submit}>Submit and compare</button></div>}
    </section>
  );
}
