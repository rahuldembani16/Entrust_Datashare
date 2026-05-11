import { LogOut, Moon, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  return (
    <header className="navbar">
      <div className="brand"><Sprout /> FarmShare</div>
      <div className="nav-user">
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode"><Moon size={18} /></button>
        <span>{user?.name}</span>
        <span className="role-pill">{user?.role?.replace('_', ' ')}</span>
        <button className="ghost-button" onClick={logout}><LogOut size={16} /> Logout</button>
      </div>
    </header>
  );
}
