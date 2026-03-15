import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; 

  if (!user) {
    // Kick them to home, but pass the flag to open the bot
    return <Navigate to="/" state={{ triggerAuthBot: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;