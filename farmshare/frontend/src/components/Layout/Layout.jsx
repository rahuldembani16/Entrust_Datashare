import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import PrivacyBanner from '../PrivacyBanner.jsx';

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <Navbar />
        <PrivacyBanner />
        <Outlet />
      </main>
    </div>
  );
}
