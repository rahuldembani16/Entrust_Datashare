import { useAuth } from '../context/AuthContext.jsx';

export function useApi() {
  const { API_URL, token } = useAuth();

  return async function api(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });

    if (response.status === 204) return null;
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API request failed');
    return data;
  };
}
