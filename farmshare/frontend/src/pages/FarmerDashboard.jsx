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
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api('/farmers/records').then(setRecords);
    api('/sharing/permissions').then(setPermissions);
  }, []);

  const activeSharing = permissions.filter((p) => p.is_active).length;

  function toggleSelect(id) {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function toggleSelectAll() {
    if (selected.length === records.length) {
      setSelected([]);
    } else {
      setSelected(records.map((r) => r.id));
    }
  }

  async function deleteSelected() {
    if (selected.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(selected.map((id) => api(`/farmers/records/${id}`, { method: 'DELETE' })));
      setRecords((prev) => prev.filter((r) => !selected.includes(r.id)));
      setSelected([]);
      setShowDeletePanel(false);
    } catch (err) {
      console.error('Failed to delete records:', err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="page-stack">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Current season 2024B</p>
          <h1>{user.name}'s farm dashboard</h1>
          <p>Region-linked data, private by default, useful immediately.</p>
        </div>
        <button className="danger-button" onClick={() => setShowDeletePanel(!showDeletePanel)}>
          Remove my data
        </button>
      </div>

      {showDeletePanel && (
        <div className="panel delete-panel">
          <div className="delete-panel-header">
            <h2>Select records to remove</h2>
            <p className="hint-text">Choose which records you want to permanently delete.</p>
          </div>
          {records.length === 0 ? (
            <p className="hint-text">No records to delete.</p>
          ) : (
            <>
              <div className="delete-actions-row">
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={selected.length === records.length && records.length > 0}
                    onChange={toggleSelectAll}
                  />
                  <strong>Select all ({records.length} records)</strong>
                </label>
                <button
                  className="danger-button"
                  disabled={selected.length === 0 || deleting}
                  onClick={deleteSelected}
                >
                  {deleting ? 'Deleting...' : `Delete ${selected.length} selected`}
                </button>
              </div>
              <div className="delete-records-list">
                {records.map((record) => (
                  <label key={record.id} className={`delete-record-item ${selected.includes(record.id) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selected.includes(record.id)}
                      onChange={() => toggleSelect(record.id)}
                    />
                    <span className="delete-record-info">
                      <strong>{record.crop_name}</strong>
                      <span>{record.region_name} · {record.season} · {record.yield_kg_ha} kg/ha</span>
                      <small>{new Date(record.created_at).toLocaleDateString()}</small>
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
          <button className="secondary-button" onClick={() => { setShowDeletePanel(false); setSelected([]); }}>
            Cancel
          </button>
        </div>
      )}

      <div className="stats-grid">
        <div><strong>{records.length}</strong><span>records uploaded</span></div>
        <div><strong>{records.length ? 'Unlocked' : 'Pending'}</strong><span>benchmarks</span></div>
        <div><strong>{activeSharing}/4</strong><span>sharing groups active</span></div>
      </div>
      <div className="action-grid">
        <Link to="/upload" className="action-card"><ClipboardPlus /> <h3>Upload Data</h3><p>Three simple steps with crop icons and motivation choice.</p></Link>
        <Link to="/benchmarks" className="action-card"><Scale /> <h3>My Benchmarks</h3><p>Compare yield, costs, and water with your region.</p></Link>
        <Link to="/sharing" className="action-card"><LockKeyhole /> <h3>Manage Sharing</h3><p>Choose who can use anonymised summaries.</p></Link>
        <Link to="/casestudies" className="action-card"><BookOpen /> <h3>Case Studies</h3><p>See what farmers gain from pooled data.</p></Link>
      </div>
    </section>
  );
}
