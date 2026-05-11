import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response as any,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    throw error.response?.data || error;
  }
);

// ==================== AUTH APIS ====================
export const authAPI = {
  register: (data: {
    phoneNumber?: string;
    email?: string;
    password: string;
    name: string;
    role: string;
    farmerDetails?: any;
    companyName?: string;
  }) => api.post('/auth/register', data),

  login: (data: { phoneNumber?: string; email?: string; password: string }) =>
    api.post('/auth/login', data),

  adminLogin: (data: { identifier: string; password: string }) =>
    api.post('/admin/login', data),

  getCurrentUser: () => api.get('/auth/me'),

  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// ==================== POLICY APIS ====================
export const policyAPI = {
  getAll: () => api.get('/policies/all'),

  getById: (id: string) => api.get(`/policies/${id}`),

  getRecommended: () => api.get('/policies/recommended'),

  create: (data: {
    title: string;
    category: string;
    description: string;
    premiumRate: number;
    coverageAmount: number;
    insuranceCompanyId: string;
  }) => api.post('/policies', data),

  update: (id: string, data: any) => api.put(`/policies/${id}`, data),

  toggle: (id: string) => api.patch(`/policies/${id}/toggle`),

  buy: (policyId: string) => api.post('/policies/buy', { policyId }),
};

// ==================== CLAIM APIS ====================
export const claimAPI = {
  submit: (data: FormData) =>
    api.post('/claims/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: () => api.get('/claims'),

  getById: (id: string) => api.get(`/claims/${id}`),

  getUserClaims: () => api.get('/claims/user/my-claims'),

  updateStatus: (id: string, status: string) =>
    api.patch(`/claims/${id}/status`, { status }),

  verify: (id: string, data: any) => api.post(`/claims/${id}/verify`, data),

  reject: (id: string, data: { reason: string }) =>
    api.post(`/claims/${id}/reject`, data),

  getPending: () => api.get('/claims/pending'),
};

// ==================== LOCATION APIS ====================
export const locationAPI = {
  reverseGeocode: (lat: number, lng: number) =>
    api.post('/location/reverse-geocode', { lat, lng }),

  getDistricts: () => api.get('/location/districts'),

  getPalikas: (district: string) =>
    api.get(`/location/palikas/${district}`),

  getWards: (district: string, palika: string) =>
    api.get(`/location/wards/${district}/${palika}`),
};

// ==================== ADMIN APIS ====================
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  getUsers: (role?: string) =>
    api.get('/admin/users', { params: { role } }),

  getUserById: (id: string) => api.get(`/admin/users/${id}`),

  getClaims: (status?: string) =>
    api.get('/admin/claims', { params: { status } }),

  getPendingClaims: () => api.get('/admin/claims/pending'),

  getAllClaims: () => api.get('/admin/claims/all'),

  verifyClaim: (id: string, data: any) =>
    api.post(`/admin/claims/${id}/verify`, data),

  rejectClaim: (id: string, reason: string) =>
    api.post(`/admin/claims/${id}/reject`, { reason }),

  getPolicies: () => api.get('/admin/policies'),

  createPolicy: (data: any) => api.post('/admin/policies', data),

  updatePolicy: (id: string, data: any) =>
    api.put(`/admin/policies/${id}`, data),

  createInsuranceCompany: (data: {
    name: string;
    email: string;
    password: string;
  }) => api.post('/admin/insurance-company', data),

  getFarmers: () => api.get('/admin/farmers'),

  getInsuranceCompanies: () => api.get('/admin/insurance-companies'),
};

// ==================== INSURANCE APIs ====================
export const insuranceAPI = {
  getAssignedClaims: () => api.get('/insurance/claims'),

  getClaimById: (id: string) => api.get(`/insurance/claims/${id}`),

  settleClaim: (id: string, data: { settlementAmount: number }) =>
    api.post(`/insurance/claims/${id}/settle`, data),

  rejectClaim: (id: string, reason: string) =>
    api.post(`/insurance/claims/${id}/reject`, { reason }),

  getCompanyStats: () => api.get('/insurance/stats'),

  searchClaims: (query: string) =>
    api.get('/insurance/claims/search', { params: { q: query } }),
};

// ==================== FARMER APIS ====================
export const farmerAPI = {
  getProfile: () => api.get('/farmer/profile'),

  updateProfile: (data: any) => api.put('/farmer/profile', data),

  getActivePolicies: () => api.get('/farmer/policies'),

  getPolicyById: (id: string) => api.get(`/farmer/policies/${id}`),

  getClaimsHistory: () => api.get('/farmer/claims'),

  getClaimById: (id: string) => api.get(`/farmer/claims/${id}`),

  getTransactions: () => api.get('/farmer/transactions'),

  getBrowsePolicies: () => api.get('/farmer/browse-policies'),
};

// ==================== AI APIS ====================
export const aiAPI = {
  chat: (history: any[]) => api.post('/ai/chat', { history }),

  voiceClaim: (transcript: string) =>
    api.post('/ai/voice-claim', { transcript }),

  imageAnalysis: (imageUrl: string) =>
    api.post('/ai/image-analysis', { imageUrl }),

  textToSpeech: (text: string, language: string = 'en') =>
    api.post('/ai/tts', { text, language }),
};

// ==================== NOTIFICATION APIS ====================
export const notificationAPI = {
  getAll: () => api.get('/notifications'),

  getUnread: () => api.get('/notifications/unread'),

  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),

  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
};

export default api;
