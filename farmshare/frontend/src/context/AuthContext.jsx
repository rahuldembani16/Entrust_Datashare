import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('farmshare_token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('farmshare_user') || 'null'));

  useEffect(() => {
    if (token) localStorage.setItem('farmshare_token', token);
    else localStorage.removeItem('farmshare_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('farmshare_user', JSON.stringify(user));
    else localStorage.removeItem('farmshare_user');
  }, [user]);

  async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
  }

  return <AuthContext.Provider value={{ API_URL, token, user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
