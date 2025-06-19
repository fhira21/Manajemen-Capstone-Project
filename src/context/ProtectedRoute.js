import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export function AuthRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    // Redirect based on role
    switch(user.role) {
      case 'Mahasiswa':
        return <Navigate to="/student/dashboard" state={{ from: location }} replace />;
      case 'Dosen':
        return <Navigate to="/lecturer/dashboard" state={{ from: location }} replace />;
      case 'Mitra':
        return <Navigate to="/partner/dashboard" state={{ from: location }} replace />;
      default:
        return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  return children;
}