import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import { RoleGuard, PublicGuard, AdminLoginGuard } from './guards';

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
import { FarmerVoiceAssistant } from '@/modules/farmer/pages/VoiceAssistant';

// Insurance Officer Imports
import { InsuranceOfficerLayout } from '@/modules/insurance/components/InsuranceOfficerLayout';
import { InsuranceOverview } from '@/modules/insurance/pages/Overview';
import { InsuranceClaimsRegistry } from '@/modules/insurance/pages/ClaimsRegistry';
import { InsuredFarmers } from '@/modules/insurance/pages/InsuredFarmers';
import { ActivePolicies } from '@/modules/insurance/pages/ActivePolicies';
import ProfilePage from '../pages/ProfilePage';
import ProfileRedirect from '../pages/ProfileRedirect';

const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <LandingPage />,
  },
  {
    element: <PublicGuard />,
    children: [
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
    ]
  },
  {
    element: <AdminLoginGuard />,
    children: [
      { path: PATHS.AUTH.ADMIN_LOGIN, element: <AdminLoginPage /> },
    ]
  },

  // ──────────────────────────────────────────────
  // Admin Dashboard Routes
  // ──────────────────────────────────────────────
  {
    path: '/admin',
    element: <RoleGuard allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverview /> },
          { path: 'users', element: <AdminUserManagement /> },
          { path: 'insurance/companies', element: <InsuranceCompanyManagement /> },
          { path: 'policies', element: <AdminPolicyManagement /> },
          { path: 'claims', element: <ClaimsMonitoring /> },
          { path: 'claims/:id', element: <AdminClaimDetail /> },
          { path: 'fraud', element: <FraudMonitoring /> },
          { path: 'audit-logs', element: <AuditLogs /> },
          { path: 'settings', element: <AdminSettings /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Farmer Dashboard Routes
  // ──────────────────────────────────────────────
  {
    path: '/farmer',
    element: <RoleGuard allowedRoles={['FARMER']} />,
    children: [
      {
        element: <FarmerLayout />,
        children: [
          { index: true, element: <FarmerOverview /> },
          { path: 'browse', element: <FarmerBrowsePolicies /> },
          { path: 'submit-claim', element: <FarmerSubmitClaim /> },
          { path: 'voice-assistant', element: <FarmerVoiceAssistant /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'policies', element: <div className="p-8"><h1 className="text-2xl font-bold text-slate-900">My Policies</h1><p className="mt-2 text-slate-500">History coming soon.</p></div> },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Insurance Partner Dashboard Routes
  // ──────────────────────────────────────────────
  {
    path: '/insurance',
    element: <RoleGuard allowedRoles={['INSURANCE_COMPANY', 'INSURANCE_OFFICER', 'INSURANCE']} />,
    children: [
      {
        element: <InsuranceOfficerLayout />,
        children: [
          { index: true, element: <InsuranceOverview /> },
          { path: 'claims', element: <InsuranceClaimsRegistry /> },
          { path: 'farmers', element: <InsuredFarmers /> },
          { path: 'policies', element: <ActivePolicies /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },

  // Profile Page
  {
    path: '/profile',
    element: <ProfileRedirect />,
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;
