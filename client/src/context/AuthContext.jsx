import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/apiService'; // Make sure this path points to your ONE axios file

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/users/me'); 
      setUser(res.data.user);
    } catch (err) {
      console.error("Session expired or invalid token");
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/'; 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export your hook from here directly. Delete your old useAuth.js file entirely.
export const useAuth = () => useContext(AuthContext);