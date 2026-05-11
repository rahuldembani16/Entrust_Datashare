export default function StakeholderCard({ icon, title, use, returnValue, active, onToggle }) {
  return (
    <article className="stakeholder-card">
      <div className="stakeholder-head"><span>{icon}</span><h3>{title}</h3></div>
      <p><strong>Use:</strong> {use}</p>
      <p><strong>Return:</strong> {returnValue}</p>
      <p className="agreement">They receive only opted-in, anonymised data and must not attempt to identify farms.</p>
      <label className="switch"><input type="checkbox" checked={active} onChange={(event) => onToggle(event.target.checked)} /><span /> {active ? 'ON' : 'OFF'}</label>
    </article>
  );
}
