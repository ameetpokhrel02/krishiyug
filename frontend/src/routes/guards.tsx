import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PATHS } from './paths';

// ──────────────────────────────────────────────
// Auth hook — reads token + user from localStorage
// ──────────────────────────────────────────────
const useAuth = () => {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');

  let user: any = null;
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
    token,
  };
};

// ──────────────────────────────────────────────
// AuthGuard — redirects unauthenticated users to login
// For admin paths → admin login page, others → regular login
// ──────────────────────────────────────────────
export const AuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const isAdminPath = location.pathname.startsWith('/admin');
    const loginPath = isAdminPath ? PATHS.AUTH.ADMIN_LOGIN : PATHS.AUTH.LOGIN;
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// ──────────────────────────────────────────────
// RoleGuard — protects routes by role
// allowedRoles: e.g. ['ADMIN'] or ['FARMER'] or ['INSURANCE_COMPANY']
// Backend stores role as lowercase: 'admin', 'farmer', 'insurance_company'
// We normalize both sides to uppercase for comparison
// ──────────────────────────────────────────────
export const RoleGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to role-appropriate login
    const isAdminPath = location.pathname.startsWith('/admin');
    const loginPath = isAdminPath ? PATHS.AUTH.ADMIN_LOGIN : PATHS.AUTH.LOGIN;
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Backend sends lowercase role e.g. 'admin', 'farmer', 'insurance_company'
  // allowedRoles may be passed as uppercase e.g. ['ADMIN', 'FARMER']
  const userRole = (user.role || '').toUpperCase();
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

  if (!normalizedAllowed.includes(userRole)) {
    // Redirect to the user's own dashboard instead of home
    const roleDashboard: Record<string, string> = {
      admin: PATHS.ADMIN.ROOT,
      farmer: PATHS.FARMER.ROOT,
      insurance_company: PATHS.INSURANCE.ROOT,
      insurance_agent: PATHS.INSURANCE.ROOT,
      insurance_officer: PATHS.INSURANCE.ROOT,
    };
    const userDashboard = roleDashboard[user.role.toLowerCase()] || PATHS.HOME;
    return <Navigate to={userDashboard} replace />;
  }

  return <Outlet />;
};

// ──────────────────────────────────────────────
// AdminLoginGuard — prevent logged-in users from seeing admin login page
// ──────────────────────────────────────────────
export const AdminLoginGuard = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to={PATHS.ADMIN.ROOT} replace />;
  }

  return <Outlet />;
};

// ──────────────────────────────────────────────
// PublicGuard — prevent already-logged-in users from seeing auth pages
// ──────────────────────────────────────────────
export const PublicGuard = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const roleDashboard: Record<string, string> = {
      admin: PATHS.ADMIN.ROOT,
      farmer: PATHS.FARMER.ROOT,
      insurance_company: PATHS.INSURANCE.ROOT,
    };
    return <Navigate to={roleDashboard[user.role] || PATHS.HOME} replace />;
  }

  return <Outlet />;
};
