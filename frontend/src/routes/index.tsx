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
          {
            element: <RoleGuard allowedRoles={['ADMIN']} />,
            children: [
              {
                path: PATHS.DASHBOARD.ADMIN,
                element: <DashboardHome role="Admin" />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
