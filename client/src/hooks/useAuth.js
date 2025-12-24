import { useState, useEffect } from 'react';
import api from '../services/apiService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data using the token in LocalStorage
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/users/me'); // Backend route we discussed
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
    // Optional: redirect to home
    window.location.href = '/';
  };

  return { user, loading, login, logout, refreshUser };
};