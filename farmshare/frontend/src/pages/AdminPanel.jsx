import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi.js';

export default function AdminPanel() {
  const api = useApi();
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [audit, setAudit] = useState([]);
  useEffect(() => { api('/admin/users').then(setUsers); api('/admin/records').then(setRecords); api('/admin/audit').then(setAudit); }, []);

  return <section className="page-stack"><div className="hero-card"><div><p className="eyebrow">Platform administration</p><h1>Admin panel</h1><p>Manage users, inspect demo records, and review access logs.</p></div><button className="secondary-button" onClick={() => alert('Run npm run seed in backend to reset demo data.')}>Seed/reset demo data</button></div><AdminTable title="Users" rows={users} cols={['name', 'email', 'role', 'region_name']} /><AdminTable title="Data records" rows={records.slice(0, 15)} cols={['farmer_name', 'crop_name', 'region_name', 'season', 'yield_kg_ha']} /><AdminTable title="Audit log" rows={audit} cols={['timestamp', 'email', 'action', 'target_table']} /></section>;
}

function AdminTable({ title, rows, cols }) {
  return <div className="table-wrap"><h2>{title}</h2><table><thead><tr>{cols.map((c) => <th key={c}>{c.replaceAll('_', ' ')}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{cols.map((c) => <td key={c}>{row[c]}</td>)}</tr>)}</tbody></table></div>;
}
