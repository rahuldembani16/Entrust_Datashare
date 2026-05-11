import { NavLink } from 'react-router-dom';
import { BarChart3, BookOpen, ClipboardPlus, Gauge, Landmark, LockKeyhole, Settings, Shield, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const links = {
  farmer: [
    ['/farmer', 'Dashboard', Gauge],
    ['/upload', 'Upload Data', ClipboardPlus],
    ['/benchmarks', 'Benchmarks', BarChart3],
    ['/sharing', 'Sharing', LockKeyhole],
    ['/casestudies', 'Case Studies', BookOpen]
  ],
  researcher: [['/researcher', 'Research Data', BarChart3], ['/casestudies', 'Case Studies', BookOpen]],
  service_provider: [['/provider', 'Service View', Users], ['/casestudies', 'Case Studies', BookOpen]],
  government: [['/government', 'Govt View', Landmark], ['/casestudies', 'Case Studies', BookOpen]],
  admin: [['/admin', 'Admin Panel', Shield], ['/researcher', 'Aggregates', BarChart3], ['/casestudies', 'Case Studies', BookOpen]]
};

export default function Sidebar() {
  const { user } = useAuth();
  const items = links[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">FS</div>
      {items.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <Icon size={19} /> {label}
        </NavLink>
      ))}
      <div className="side-note"><Settings size={18} /> Remove my data is always available from the farmer dashboard.</div>
    </aside>
  );
}
