import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PATHS } from './paths';

// This is a placeholder for actual auth logic
const useAuth = () => {
  // Mocking auth for now
  return { isAuthenticated: true, user: { role: 'FARMER' } };
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
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
};
