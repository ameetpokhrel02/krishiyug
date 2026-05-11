export const PATHS = {
  HOME: '/',
  AUTH: {
    WELCOME: '/auth/welcome',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ROLE_SELECTION: '/auth/role-selection',
    OTP_VERIFICATION: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ADMIN: {
    ROOT: '/admin',
    OVERVIEW: '/admin',
    FARMERS: '/admin/farmers',
    WARDS: {
      MUNICIPALITIES: '/admin/wards/municipalities',
      OFFICERS: '/admin/wards/officers',
    },
    INSURANCE: {
      COMPANIES: '/admin/insurance/companies',
      OFFICERS: '/admin/insurance/officers',
    },
    CLAIMS: '/admin/claims',
    FRAUD: '/admin/fraud',
    ANALYTICS: '/admin/analytics',
    NOTIFICATIONS: '/admin/notifications',
    AUDIT_LOGS: '/admin/audit-logs',
    SETTINGS: '/admin/settings',
    PROFILE: '/admin/profile',
  },
  DASHBOARD: {
    FARMER: '/dashboard/farmer',

    WARD: '/dashboard/ward',
    INSURANCE: '/dashboard/insurance',
  },
  CLAIMS: {
    LIST: '/claims',
    DETAILS: (id: string) => `/claims/${id}`,
    CREATE: '/claims/new',
  },
} as const;
