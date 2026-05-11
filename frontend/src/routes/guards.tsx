import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PATHS } from './paths';

// Get actual user from localStorage
const useAuth = () => {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
    }
  }
  
  return { 
    isAuthenticated: !!token && !!user, 
    user,
    token 
  };
};

export const AuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const RoleGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Normalize roles to uppercase for comparison
  const userRole = (user.role || '').toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
};
