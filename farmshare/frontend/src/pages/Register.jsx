import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RegionMap from '../components/Map/RegionMap.jsx';

export default function Register() {
  const { API_URL, register } = useAuth();
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer', region_id: 1 });

  useEffect(() => { fetch(`${API_URL}/regions`).then((r) => r.json()).then(setRegions); }, [API_URL]);

  async function submit(event) {
    event.preventDefault();
    await register(form);
    navigate('/');
  }

  return (
    <main className="auth-page register">
      <form className="auth-card wide-card" onSubmit={submit}>
        <h2>Welcome to FarmShare</h2>
        <p>Why share? You unlock local benchmarks, better advice, research impact, and full control over who sees aggregate data.</p>
        <div className="form-grid">
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="farmer">Farmer</option><option value="researcher">Researcher</option><option value="service_provider">Service Provider</option><option value="government">Government</option></select></label>
        </div>
        <RegionMap regions={regions} selected={form.region_id} onSelect={(region_id) => setForm({ ...form, region_id })} />
        <button className="primary-button">Create account</button>
        <Link to="/login">Back to login</Link>
      </form>
    </main>
  );
}
