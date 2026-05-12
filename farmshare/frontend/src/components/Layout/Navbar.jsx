import { useState } from 'react';
import { LogOut, Moon, Pencil, Check, X, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApi } from '../../hooks/useApi.js';

export default function Navbar() {
  const { user, logout, updateUser } = useAuth();
  const api = useApi();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  async function saveName() {
    if (!name.trim() || name.trim() === user?.name) {
      setEditing(false);
      setName(user?.name || '');
      return;
    }
    try {
      const data = await api('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim() })
      });
      updateUser(data.user);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  }

  function cancelEdit() {
    setName(user?.name || '');
    setEditing(false);
  }

  return (
    <header className="navbar">
      <div className="brand"><Sprout /> FarmShare</div>
      <div className="nav-user">
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode"><Moon size={18} /></button>
        {editing ? (
          <span className="name-edit-row">
            <input
              className="name-edit-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEdit(); }}
              autoFocus
            />
            <button className="icon-button" onClick={saveName} aria-label="Save name"><Check size={16} /></button>
            <button className="icon-button" onClick={cancelEdit} aria-label="Cancel"><X size={16} /></button>
          </span>
        ) : (
          <span className="name-display" onClick={() => { setName(user?.name || ''); setEditing(true); }}>
            {user?.name} <Pencil size={14} className="edit-icon" />
          </span>
        )}
        <span className="role-pill">{user?.role?.replace('_', ' ')}</span>
        <button className="ghost-button" onClick={logout}><LogOut size={16} /> Logout</button>
      </div>
    </header>
  );
}
