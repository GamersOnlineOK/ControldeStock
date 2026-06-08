import { createContext, useContext, useEffect, useState } from 'react';
import URL from '../utils/apiUrl';
import readApiResponse from '../utils/readApiResponse';

const AuthContext = createContext(null);
const STORAGE_KEY = 'panificadora_auth';

const readStoredSession = () => {
  try {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const storedSession = readStoredSession();
  const [token, setToken] = useState(storedSession?.token || '');
  const [user, setUser] = useState(storedSession?.user || null);
  const [assignableRoles, setAssignableRoles] = useState(storedSession?.assignableRoles || []);
  const [loading, setLoading] = useState(Boolean(storedSession?.token));

  const saveSession = (session) => {
    setToken(session.token);
    setUser(session.user);
    setAssignableRoles(session.assignableRoles || []);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setAssignableRoles([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`${URL}auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          logout();
          return;
        }

        const session = await readApiResponse(response);
        const nextSession = {
          token,
          user: session.user,
          assignableRoles: session.assignableRoles || [],
        };
        setUser(nextSession.user);
        setAssignableRoles(nextSession.assignableRoles);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async ({ email, password }) => {
    const response = await fetch(`${URL}auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await readApiResponse(response);
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo iniciar sesion');
    }

    saveSession(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ token, user, assignableRoles, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
