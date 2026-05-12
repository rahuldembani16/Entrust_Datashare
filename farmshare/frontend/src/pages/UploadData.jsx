import { useEffect, useState } from 'react';
import CropSelector from '../components/CropSelector.jsx';
import MotivationPicker from '../components/MotivationPicker.jsx';
import YieldComparisonChart from '../components/Charts/YieldComparisonChart.jsx';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const stakeholderMeta = [
  { type: 'farmer_org', icon: '🌾', title: 'Farmer Organisations', description: 'Member-level aggregate planning' },
  { type: 'researcher', icon: '🔬', title: 'Research Institutions', description: 'Anonymous regional analysis' },
  { type: 'service_provider', icon: '🏢', title: 'Private Service Providers', description: 'Advisory trends for subscribed farmers' },
  { type: 'government', icon: '🏛️', title: 'Government', description: 'Compliance and regional summaries' }
];

export default function UploadData() {
  const api = useApi();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [crops, setCrops] = useState([]);
  const [regions, setRegions] = useState([]);
  const [result, setResult] = useState(null);
  const [sharing, setSharing] = useState({
    farmer_org: false,
    researcher: false,
    service_provider: false,
    government: false
  });
  const [form, setForm] = useState({
    crop_id: '',
    region_id: user.region_id || '',
    season: '2024B',
    yield_kg_ha: 2600,
    input_cost: 620,
    water_use: 160,
    notes: '',
    motivation: 'benchmarking'
  });

  useEffect(() => {
    api('/crops').then(setCrops);
    api('/regions').then(setRegions);
  }, []);

  function toggleSharing(type) {
    setSharing((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  async function submit() {
    const record = await api('/farmers/records', {
      method: 'POST',
      body: JSON.stringify({ ...form, sharing })
    });
    const benchmark = await api(`/benchmarks/${form.region_id}/${form.crop_id}`);
    setResult({ record, benchmark: benchmark.latest });
  }

  if (result) {
    return (
      <section className="page-stack">
        <div className="hero-card">
          <div>
            <p className="eyebrow">Uploaded successfully</p>
            <h1>Your benchmark is ready</h1>
            <p>Immediate value: compare your new record with the regional average.</p>
          </div>
        </div>
        <YieldComparisonChart
          mine={result.record.yield_kg_ha}
          regional={result.benchmark?.avg_yield || result.record.yield_kg_ha * 0.9}
        />
      </section>
    );
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Step {step} of 4</p>
        <h1>Upload farm data</h1>
      </div>

      {/* Step 1: Select Crop */}
      {step === 1 && (
        <div className="panel">
          <h2>What are you farming?</h2>
          <CropSelector crops={crops} selected={form.crop_id} onSelect={(crop_id) => setForm({ ...form, crop_id })} />
          <button className="primary-button" disabled={!form.crop_id} onClick={() => setStep(2)}>
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Select who to share with */}
      {step === 2 && (
        <div className="panel">
          <h2>Who would you like to share your data with?</h2>
          <p className="hint-text">Select the stakeholders you want to share your farm data with. You can change this later.</p>
          <div className="stakeholder-grid">
            {stakeholderMeta.map((s) => (
              <button
                key={s.type}
                type="button"
                className={`stakeholder-toggle ${sharing[s.type] ? 'active' : ''}`}
                onClick={() => toggleSharing(s.type)}
              >
                <span className="stakeholder-icon">{s.icon}</span>
                <strong>{s.title}</strong>
                <small>{s.description}</small>
                <span className="toggle-indicator">{sharing[s.type] ? '✓ Sharing' : 'Not sharing'}</span>
              </button>
            ))}
          </div>
          <div className="button-row">
            <button className="secondary-button" onClick={() => setStep(1)}>Back</button>
            <button className="primary-button" onClick={() => setStep(3)}>Continue</button>
          </div>
        </div>
      )}

      {/* Step 3: Enter Farm Data */}
      {step === 3 && (
        <div className="panel">
          <h2>Your farm data</h2>
          <div className="form-grid">
            <label>
              Region
              <select value={form.region_id} onChange={(e) => setForm({ ...form, region_id: Number(e.target.value) })}>
                <option value="">Select region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </label>
            <label>
              Season
              <input value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} />
            </label>
            <label>
              Yield kg/ha
              <input type="number" value={form.yield_kg_ha} onChange={(e) => setForm({ ...form, yield_kg_ha: Number(e.target.value) })} />
            </label>
            <label>
              Input cost
              <input type="number" value={form.input_cost} onChange={(e) => setForm({ ...form, input_cost: Number(e.target.value) })} />
            </label>
            <label>
              Water use
              <input type="number" value={form.water_use} onChange={(e) => setForm({ ...form, water_use: Number(e.target.value) })} />
            </label>
          </div>
          <textarea
            placeholder="Optional notes or pasted CSV text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div className="button-row">
            <button className="secondary-button" onClick={() => setStep(2)}>Back</button>
            <button className="primary-button" disabled={!form.region_id} onClick={() => setStep(4)}>Continue</button>
          </div>
        </div>
      )}

      {/* Step 4: Motivation */}
      {step === 4 && (
        <div className="panel">
          <h2>Why are you sharing?</h2>
          <MotivationPicker selected={form.motivation} onSelect={(motivation) => setForm({ ...form, motivation })} />
          <div className="button-row">
            <button className="secondary-button" onClick={() => setStep(3)}>Back</button>
            <button className="primary-button" onClick={submit}>Submit and compare</button>
          </div>
        </div>
      )}
    </section>
  );
}
