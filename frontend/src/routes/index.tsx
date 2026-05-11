import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PATHS } from './paths';
import { RoleGuard } from './guards';

import LandingPage from '@/pages/LandingPage';

// Auth Imports
import { AuthLayout } from '@/components/layout/auth-layout';
import { WelcomeScreen } from '@/pages/auth/WelcomeScreen';
import { LoginPage } from '@/pages/auth/LoginPage';
import { AdminLoginPage } from '@/pages/auth/AdminLoginPage';
import { RoleSelection } from '@/pages/auth/RoleSelection';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { OtpVerification } from '@/pages/auth/OtpVerification';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Admin Imports
import { AdminLayout } from '@/modules/admin/components/AdminLayout';
import { AdminOverview } from '@/modules/admin/pages/Overview';
import { AdminUserManagement } from '@/modules/admin/pages/UserManagement';
import { InsuranceCompanyManagement } from '@/modules/admin/pages/InsuranceCompanies';
import { ClaimsMonitoring } from '@/modules/admin/pages/Claims';
import { AdminClaimDetail } from '@/modules/admin/pages/ClaimDetail';
import { AdminPolicyManagement } from '@/modules/admin/pages/PolicyManagement';
import { FraudMonitoring } from '@/modules/admin/pages/FraudDetection';
import { AuditLogs } from '@/modules/admin/pages/AuditLogs';
import { AdminSettings } from '@/modules/admin/pages/Settings';

// Farmer Imports
import { FarmerLayout } from '@/modules/farmer/components/FarmerLayout';
import { FarmerOverview } from '@/modules/farmer/pages/Overview';
import { FarmerBrowsePolicies } from '@/modules/farmer/pages/BrowsePolicies';
import { FarmerSubmitClaim } from '@/modules/farmer/pages/SubmitClaim';

// Insurance Officer Imports
import { InsuranceOfficerLayout } from '@/modules/insurance/components/InsuranceOfficerLayout';
import { InsuranceOverview } from '@/modules/insurance/pages/Overview';
import { InsuranceClaimsRegistry } from '@/modules/insurance/pages/ClaimsRegistry';

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
      { path: PATHS.AUTH.ADMIN_LOGIN, element: <AdminLoginPage /> },
      { path: PATHS.AUTH.ROLE_SELECTION, element: <RoleSelection /> },
      { path: PATHS.AUTH.REGISTER, element: <RegisterPage /> },
      { path: PATHS.AUTH.OTP_VERIFICATION, element: <OtpVerification /> },
      { path: PATHS.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: PATHS.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
    ],
  },
  
  // Admin Dashboard Routes (KrishiYug Team)
  {
    element: <RoleGuard allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: PATHS.ADMIN.OVERVIEW, element: <AdminOverview /> },
          { path: '/admin/users', element: <AdminUserManagement /> },
          { path: PATHS.ADMIN.INSURANCE.COMPANIES, element: <InsuranceCompanyManagement /> },
          { path: PATHS.ADMIN.POLICIES, element: <AdminPolicyManagement /> },
          { path: PATHS.ADMIN.CLAIMS, element: <ClaimsMonitoring /> },
          { path: PATHS.ADMIN.CLAIM_DETAIL(':id'), element: <AdminClaimDetail /> },
          { path: PATHS.ADMIN.FRAUD, element: <FraudMonitoring /> },
          { path: PATHS.ADMIN.AUDIT_LOGS, element: <AuditLogs /> },
          { path: PATHS.ADMIN.SETTINGS, element: <AdminSettings /> },
        ],
      },
    ],
  },

  // Farmer Dashboard Routes
  {
    element: <RoleGuard allowedRoles={['FARMER']} />,
    children: [
      {
        element: <FarmerLayout />,
        children: [
          { path: PATHS.FARMER.OVERVIEW, element: <FarmerOverview /> },
          { path: PATHS.FARMER.BROWSE, element: <FarmerBrowsePolicies /> },
          { path: PATHS.FARMER.SUBMIT_CLAIM, element: <FarmerSubmitClaim /> },
          { path: PATHS.FARMER.POLICIES, element: <div className="p-8"><h1 className="text-2xl font-bold text-slate-900">My Policies</h1><p className="mt-2 text-slate-500">Implemented History coming soon.</p></div> },
        ],
      },
    ],
  },

  // Insurance Partner Dashboard Routes
  {
    element: <RoleGuard allowedRoles={['INSURANCE_OFFICER', 'INSURANCE']} />,
    children: [
      {
        element: <InsuranceOfficerLayout />,
        children: [
          { path: PATHS.INSURANCE.OVERVIEW, element: <InsuranceOverview /> },
          { path: PATHS.INSURANCE.CLAIMS, element: <InsuranceClaimsRegistry /> },
          { path: PATHS.INSURANCE.FARMERS, element: <div className="p-8"><h1 className="text-2xl font-bold text-slate-900">Insured Farmers</h1><p className="mt-2 text-slate-500">Registry coming soon.</p></div> },
        ],
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
