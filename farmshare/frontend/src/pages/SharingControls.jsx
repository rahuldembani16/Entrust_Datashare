import { useEffect, useState } from 'react';
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

export default function SharingControls() {
  const api = useApi();
  const [sharedRecords, setSharedRecords] = useState([]);

  useEffect(() => {
    api('/farmers/records/shared').then(setSharedRecords);
  }, []);

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Transparency and choice</p>
        <h1>Sharing controls</h1>
        <p>See exactly what data you shared and with whom. You can remove records from your dashboard at any time.</p>
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
