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
  DASHBOARD: {
    FARMER: '/dashboard/farmer',

    WARD: '/dashboard/ward',
    INSURANCE: '/dashboard/insurance',
    ADMIN: '/dashboard/admin',
  },
  CLAIMS: {
    LIST: '/claims',
    DETAILS: (id: string) => `/claims/${id}`,
    CREATE: '/claims/new',
  },
} as const;
