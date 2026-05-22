import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader message="Checking your session..." />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <Loader message="Checking admin session..." />;
  if (!admin) return <Navigate to="/admin/login" />;
  return children;
};
