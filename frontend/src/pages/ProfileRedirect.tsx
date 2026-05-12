import { Navigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

const getRoleRoute = (role?: string) => {
  const normalizedRole = (role || '').toLowerCase();

  if (normalizedRole === 'admin') return PATHS.ADMIN.PROFILE;
  if (normalizedRole === 'insurance_company') return PATHS.INSURANCE.PROFILE;
  return PATHS.FARMER.PROFILE;
};

export default function ProfileRedirect() {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to={PATHS.AUTH.LOGIN} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    return <Navigate to={getRoleRoute(user?.role)} replace />;
  } catch {
    return <Navigate to={PATHS.AUTH.LOGIN} replace />;
  }
}
