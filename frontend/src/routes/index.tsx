import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import { AuthGuard, RoleGuard } from './guards';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import DashboardHome from '@/components/shared/dashboard-home';

// Placeholder Pages
const LoginPage = () => <div className="p-10">Login Page</div>;
const HomePage = () => <Navigate to={PATHS.DASHBOARD.FARMER} replace />;

const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <HomePage />,
  },
  {
    path: PATHS.AUTH.LOGIN,
    element: <LoginPage />,
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
            element: <RoleGuard allowedRoles={['WITNESS']} />,
            children: [
              {
                path: PATHS.DASHBOARD.WITNESS,
                element: <DashboardHome role="Witness" />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['PALIKA']} />,
            children: [
              {
                path: PATHS.DASHBOARD.PALIKA,
                element: <DashboardHome role="Palika Officer" />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['INSURANCE']} />,
            children: [
              {
                path: PATHS.DASHBOARD.INSURANCE,
                element: <DashboardHome role="Insurance Officer" />,
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
