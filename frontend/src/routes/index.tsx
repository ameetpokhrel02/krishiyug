import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PATHS } from './paths';
import { AuthGuard, RoleGuard } from './guards';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import DashboardHome from '@/components/shared/dashboard-home';

import LandingPage from '@/pages/LandingPage';

import { AuthLayout } from '@/components/layout/auth-layout';
import { WelcomeScreen } from '@/pages/auth/WelcomeScreen';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RoleSelection } from '@/pages/auth/RoleSelection';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { OtpVerification } from '@/pages/auth/OtpVerification';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { InsuranceDashboard } from '@/pages/dashboard/insurance/InsuranceDashboard';

// Admin Imports
import { AdminLayout } from '@/modules/admin/components/AdminLayout';
import { AdminOverview } from '@/modules/admin/pages/Overview';
import { FarmerManagement } from '@/modules/admin/pages/Farmers';
import { WardManagement } from '@/modules/admin/pages/WardManagement';
import { WardOfficerManagement } from '@/modules/admin/pages/WardOfficers';
import { InsuranceCompanyManagement } from '@/modules/admin/pages/InsuranceCompanies';
import { InsuranceOfficerManagement } from '@/modules/admin/pages/InsuranceOfficers';
import { ClaimsMonitoring } from '@/modules/admin/pages/Claims';
import { FraudMonitoring } from '@/modules/admin/pages/FraudDetection';
import { AuditLogs } from '@/modules/admin/pages/AuditLogs';
import { AdminSettings } from '@/modules/admin/pages/Settings';

const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <LandingPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: PATHS.AUTH.WELCOME, element: <WelcomeScreen /> },
      { path: PATHS.AUTH.LOGIN, element: <LoginPage /> },
      { path: PATHS.AUTH.ROLE_SELECTION, element: <RoleSelection /> },
      { path: PATHS.AUTH.REGISTER, element: <RegisterPage /> },
      { path: PATHS.AUTH.OTP_VERIFICATION, element: <OtpVerification /> },
      { path: PATHS.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: PATHS.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
    ],
  },
  
  // Admin Dashboard Routes
  {
    element: <RoleGuard allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: PATHS.ADMIN.OVERVIEW, element: <AdminOverview /> },
          { path: PATHS.ADMIN.FARMERS, element: <FarmerManagement /> },
          { path: PATHS.ADMIN.WARDS.MUNICIPALITIES, element: <WardManagement /> },
          { path: PATHS.ADMIN.WARDS.OFFICERS, element: <WardOfficerManagement /> },
          { path: PATHS.ADMIN.INSURANCE.COMPANIES, element: <InsuranceCompanyManagement /> },
          { path: PATHS.ADMIN.INSURANCE.OFFICERS, element: <InsuranceOfficerManagement /> },
          { path: PATHS.ADMIN.CLAIMS, element: <ClaimsMonitoring /> },
          { path: PATHS.ADMIN.FRAUD, element: <FraudMonitoring /> },
          { path: PATHS.ADMIN.AUDIT_LOGS, element: <AuditLogs /> },
          { path: PATHS.ADMIN.SETTINGS, element: <AdminSettings /> },
        ],
      },
    ],
  },

  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <RoleGuard allowedRoles={['FARMER']} />,
            children: [
              {
                path: PATHS.DASHBOARD.FARMER,
                element: <DashboardHome role="Farmer" />,
              },
            ],
          },

          {
            element: <RoleGuard allowedRoles={['WARD']} />,
            children: [
              {
                path: PATHS.DASHBOARD.WARD,
                element: <DashboardHome role="Ward Officer" />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['INSURANCE']} />,
            children: [
              {
                path: PATHS.DASHBOARD.INSURANCE,
                element: <InsuranceDashboard />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
