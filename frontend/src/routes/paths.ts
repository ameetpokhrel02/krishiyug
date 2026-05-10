export const PATHS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    FARMER: '/dashboard/farmer',
    WITNESS: '/dashboard/witness',
    PALIKA: '/dashboard/palika',
    INSURANCE: '/dashboard/insurance',
    ADMIN: '/dashboard/admin',
  },
  CLAIMS: {
    LIST: '/claims',
    DETAILS: (id: string) => `/claims/${id}`,
    CREATE: '/claims/new',
  },
} as const;
