import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="route-loading__spinner" aria-label="Cargando..." />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/inicio" replace />;

  return children;
}
