import { useEffect, useState } from 'react';
import StakeholderCard from '../components/StakeholderCard.jsx';
import { useApi } from '../hooks/useApi.js';

const meta = {
  farmer_org: ['🌾', 'Farmer Organisations', 'Member-level aggregate planning', 'Better bargaining power and training'],
  researcher: ['🔬', 'Research Institutions', 'Anonymous regional analysis', 'Evidence-based insights returned to farmers'],
  service_provider: ['🏢', 'Private Service Providers', 'Advisory trends for subscribed farmers', 'More relevant agronomy support'],
  government: ['🏛️', 'Government', 'Compliance and regional summaries', 'Programme eligibility and public planning']
};

export default function SharingControls() {
  const api = useApi();
  const [permissions, setPermissions] = useState([]);
  useEffect(() => { api('/sharing/permissions').then(setPermissions); }, []);

  async function toggle(type, is_active) {
    const next = permissions.map((p) => p.stakeholder_type === type ? { ...p, is_active } : p);
    setPermissions(next);
    await api('/sharing/permissions', { method: 'PUT', body: JSON.stringify({ permissions: next }) });
  }

  return <section className="page-stack"><div className="section-heading"><p className="eyebrow">Transparency and choice</p><h1>Sharing controls</h1><p>You can remove your data at any time.</p></div><div className="stakeholder-grid">{permissions.map((p) => { const m = meta[p.stakeholder_type]; return <StakeholderCard key={p.stakeholder_type} icon={m[0]} title={m[1]} use={m[2]} returnValue={m[3]} active={Boolean(p.is_active)} onToggle={(value) => toggle(p.stakeholder_type, value)} />; })}</div></section>;
}
