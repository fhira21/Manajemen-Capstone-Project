import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing during the initial loading
  if (loading) return null;

  if (!user) {
    // Save the attempted URL for redirecting after login
    sessionStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show nothing during initial loading
  if (loading) return null;

  if (user) {
    // Check if there's a saved redirect path
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      return <Navigate to={redirectPath} replace />;
    }
    
    // Default redirects based on role
    switch(user.role) {
      case 'Mahasiswa':
        return <Navigate to="/student/dashboard" replace />;
      case 'Dosen':
        return <Navigate to="/lecturer/dashboard" replace />;
      case 'Mitra':
        return <Navigate to="/partner/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}