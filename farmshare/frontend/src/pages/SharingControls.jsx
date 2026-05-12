import { useEffect, useState } from 'react';
import StakeholderCard from '../components/StakeholderCard.jsx';
import { useApi } from '../hooks/useApi.js';

const meta = {
  farmer_org: ['🌾', 'Farmer Organisations'],
  researcher: ['🔬', 'Research Institutions'],
  service_provider: ['🏢', 'Private Service Providers'],
  government: ['🏛️', 'Government']
};

const stakeholderLabels = {
  farmer_org: 'Farmer Organisations',
  researcher: 'Research Institutions',
  service_provider: 'Private Service Providers',
  government: 'Government'
};

const stakeholderMeta = {
  farmer_org: ['🌾', 'Farmer Organisations', 'Member-level aggregate planning', 'Better bargaining power and training'],
  researcher: ['🔬', 'Research Institutions', 'Anonymous regional analysis', 'Evidence-based insights returned to farmers'],
  service_provider: ['🏢', 'Private Service Providers', 'Advisory trends for subscribed farmers', 'More relevant agronomy support'],
  government: ['🏛️', 'Government', 'Compliance and regional summaries', 'Programme eligibility and public planning']
};

export default function SharingControls() {
  const api = useApi();
  const [permissions, setPermissions] = useState([]);
  const [sharedRecords, setSharedRecords] = useState([]);

  useEffect(() => {
    api('/sharing/permissions').then(setPermissions);
    api('/farmers/records/shared').then(setSharedRecords);
  }, []);

  async function toggle(type, is_active) {
    const next = permissions.map((p) => p.stakeholder_type === type ? { ...p, is_active } : p);
    setPermissions(next);
    await api('/sharing/permissions', { method: 'PUT', body: JSON.stringify({ permissions: next }) });
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Transparency and choice</p>
        <h1>Sharing controls</h1>
        <p>You can remove your data at any time.</p>
      </div>

      <div className="stakeholder-grid">
        {permissions.map((p) => {
          const m = stakeholderMeta[p.stakeholder_type];
          return (
            <StakeholderCard
              key={p.stakeholder_type}
              icon={m[0]}
              title={m[1]}
              use={m[2]}
              returnValue={m[3]}
              active={Boolean(p.is_active)}
              onToggle={(value) => toggle(p.stakeholder_type, value)}
            />
          );
        })}
      </div>

      <div className="section-heading" style={{ marginTop: '24px' }}>
        <p className="eyebrow">Your data records</p>
        <h2>What you shared and with whom</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Crop</th>
              <th>Region</th>
              <th>Season</th>
              <th>Yield (kg/ha)</th>
              <th>Date</th>
              <th>Shared with</th>
            </tr>
          </thead>
          <tbody>
            {sharedRecords.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>
                  No records uploaded yet. Upload data to see your sharing history.
                </td>
              </tr>
            )}
            {sharedRecords.map((record) => (
              <tr key={record.id}>
                <td><strong>{record.crop_name}</strong></td>
                <td>{record.region_name}</td>
                <td>{record.season}</td>
                <td>{record.yield_kg_ha}</td>
                <td>{new Date(record.created_at).toLocaleDateString()}</td>
                <td>
                  {record.shared_with && record.shared_with.length > 0 ? (
                    <div className="sharing-tags">
                      {record.shared_with.map((type) => (
                        <span key={type} className="sharing-tag">
                          {meta[type]?.[0]} {stakeholderLabels[type]}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="not-shared">Not shared</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
