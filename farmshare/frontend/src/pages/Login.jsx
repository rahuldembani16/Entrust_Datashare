import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const demos = [
  ['Farmer', 'farmer@demo.com'],
  ['Researcher', 'researcher@demo.com'],
  ['Service Provider', 'provider@demo.com'],
  ['Government', 'govt@demo.com'],
  ['Admin', 'admin@demo.com']
];

export default function Login() {
  const [email, setEmail] = useState('farmer@demo.com');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero"><Sprout size={44} /><h1>Share farm data on your terms.</h1><p>Get regional benchmarks, stronger services, and transparent governance without exposing individual records.</p></section>
      <form className="auth-card" onSubmit={submit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="primary-button">Enter FarmShare</button>
        <div className="demo-grid">{demos.map(([role, demoEmail]) => <button key={role} type="button" onClick={() => { setEmail(demoEmail); setPassword('demo1234'); }}>{role}</button>)}</div>
        <p>New farmer? <Link to="/register">Create account</Link></p>
      </form>
    </main>
  );
}
