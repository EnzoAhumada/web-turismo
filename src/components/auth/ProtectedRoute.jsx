import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="route-loading__spinner" aria-label="Cargando..." />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return children;
}
