import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardPlus, LockKeyhole, Scale } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function FarmerDashboard() {
  const api = useApi();
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => { api('/farmers/records').then(setRecords); api('/sharing/permissions').then(setPermissions); }, []);
  const activeSharing = permissions.filter((p) => p.is_active).length;

  return (
    <section className="page-stack">
      <div className="hero-card"><div><p className="eyebrow">Current season 2024B</p><h1>{user.name}'s farm dashboard</h1><p>Region-linked data, private by default, useful immediately.</p></div><button className="danger-button">Remove my data</button></div>
      <div className="stats-grid"><div><strong>{records.length}</strong><span>records uploaded</span></div><div><strong>{records.length ? 'Unlocked' : 'Pending'}</strong><span>benchmarks</span></div><div><strong>{activeSharing}/4</strong><span>sharing groups active</span></div></div>
      <div className="action-grid">
        <Link to="/upload" className="action-card"><ClipboardPlus /> <h3>Upload Data</h3><p>Three simple steps with crop icons and motivation choice.</p></Link>
        <Link to="/benchmarks" className="action-card"><Scale /> <h3>My Benchmarks</h3><p>Compare yield, costs, and water with your region.</p></Link>
        <Link to="/sharing" className="action-card"><LockKeyhole /> <h3>Manage Sharing</h3><p>Choose who can use anonymised summaries.</p></Link>
        <Link to="/casestudies" className="action-card"><BookOpen /> <h3>Case Studies</h3><p>See what farmers gain from pooled data.</p></Link>
      </div>
    </section>
  );
}
