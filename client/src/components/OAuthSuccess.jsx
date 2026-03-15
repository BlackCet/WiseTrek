import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook into your global state

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth(); // Pull the refresh function

  useEffect(() => {
    const processOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          // 1. Drop the token into storage
          localStorage.setItem('token', token);
          
          // 2. Force the context to immediately fetch the user data
          await refreshUser();
          
          // 3. Smooth SPA redirect to home—no hard reloads required
          navigate('/'); 
        } else {
          navigate('/?error=no_token');
        }
      } catch (err) {
        console.error("OAuth Error:", err);
        navigate('/?error=processing_failed');
      }
    };

    processOAuth();
  }, [navigate, refreshUser]);

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <p>Finalizing your WiseTrek login...</p>
    </div>
  );
}