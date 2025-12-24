import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        localStorage.setItem('token', token);
        // Using window.location.href ensures the app reloads 
        // and the useAuth hook picks up the new token immediately
        window.location.href = '/'; 
      } else {
        navigate('/?error=no_token');
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      navigate('/?error=processing_failed');
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <p>Finalizing login...</p>
    </div>
  );
}