import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    delete config.headers['content-type'];
  }

  return config;
});

// Handle 401 — redirect to role-appropriate login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userStr = localStorage.getItem('user');
      let redirectPath = '/auth/login';
      try {
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.role === 'admin') redirectPath = '/auth/admin-login';
      } catch (_) { }
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = redirectPath;
    }
    throw error.response?.data || error;
  }
);

// ==================== AUTH ====================
// POST /api/auth/register
// POST /api/auth/login
// POST /api/admin/login  (admin-specific)
export const authAPI = {
  register: (data: {
    phoneNumber: string;
    password: string;
    name: string;
    role: string;
    farmerDetails?: {
      farmType: 'livestock' | 'crop';
      farmSize: number;
      cropTypes?: string[];
      location: { district: string; village: string; region?: string; palika?: string; ward?: string; lat?: number; lng?: number };
      livestockDetails?: { earTags: string[] };
    };
    companyName?: string;
  }) => api.post('/auth/register', data),

  login: (data: { phoneNumber: string; password: string }) =>
    api.post('/auth/login', data),

  adminLogin: (data: { identifier: string; password: string }) =>
    api.post('/admin/login', data),

  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// ==================== FARMER ====================
// GET /api/farmer/profile  → { name, phoneNumber, farmerDetails }
// GET /api/farmer/crops    → { cropTypes, farmSize, location }
// GET /api/farmer/dashboard → { user, farmerDetails }
export const farmerAPI = {
  getProfile: () => api.get('/farmer/profile'),
  getDashboard: () => api.get('/farmer/dashboard'),
  getCrops: () => api.get('/farmer/crops'),
  updateProfile: (data: any) => api.put('/farmer/profile', data),
};

// ==================== CLAIMS ====================
// POST /api/claims/submit  (multipart) — farmer
// GET  /api/claims/user/my-claims → array of claims
// GET  /api/claims/:claimId/status → { claim, timeline }
export const claimAPI = {
  submit: (data: FormData) =>
    api.post('/claims/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getMyClaims: () => api.get('/claims/my-claims'),

  getClaimStatus: (claimId: string) =>
    api.get(`/claims/${claimId}/status`),

  getById: (claimId: string) => api.get(`/claims/${claimId}`),
};

// ==================== POLICIES ====================
// GET /api/policies/all → array of active policies
// GET /api/policies/recommended → recommended for farmer
// GET /api/policies/:id → single policy
// POST /api/policies/buy → { policyId }
export const policyAPI = {
  getAll: () => api.get('/policies/all'),
  getRecommended: () => api.get('/policies/recommended'),
  getById: (id: string) => api.get(`/policies/${id}`),
  buy: (data: FormData) => api.post('/policies/buy', data),
};

// ==================== INSURANCE ====================
// All routes: role = insurance_company
// GET /api/insurance/dashboard → { claims: { total, pendingReview, approved, rejected }, activePolicies, companyName }
// GET /api/insurance/claims/verified → array of admin_verified claims
// GET /api/insurance/claims/all?status=... → all claims for this company
// POST /api/insurance/claims/decide → { claimId, action: 'approved'|'rejected', reason? }
export const insuranceAPI = {
  getDashboard: () => api.get('/insurance/dashboard'),
  getVerifiedClaims: () => api.get('/insurance/claims/verified'),
  getAllClaims: (status?: string) =>
    api.get('/insurance/claims/all', { params: status ? { status } : {} }),
  decideClaim: (data: { claimId: string; action: 'approved' | 'rejected'; reason?: string }) =>
    api.post('/insurance/claims/decide', data),
  getMyPolicies: () => api.get('/insurance/policies'),
  getInsuredFarmers: () => api.get('/insurance/farmers'),
};

// ==================== ADMIN ====================
// POST /api/admin/login — public
// GET  /api/admin/dashboard/stats → { claims: { total, pending, verified, approved, rejected }, farmers, activePolicies }
// GET  /api/admin/claims/pending → pending claims
// GET  /api/admin/claims/all?status=... → all claims
// POST /api/admin/claims/verify → { claimId, remarks? }
// POST /api/admin/claims/reject → { claimId, reason? }
// POST /api/admin/insurance-company → { name, phoneNumber, password, companyName }
// User Management
// GET  /api/admin/users → all users (optional role filter)
// GET  /api/admin/users/:id → specific user
// PUT  /api/admin/users/:id → update user
// PATCH /api/admin/users/:id/toggle-status → toggle active/inactive
// DELETE /api/admin/users/:id → delete user
// Policy Registry
// POST /api/policies → create policy
// GET  /api/policies/all → all policies for admin
// PUT  /api/policies/:id → update policy
// PATCH /api/policies/:id/toggle → activate/deactivate
// DELETE /api/policies/:id → delete policy
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getPendingClaims: () => api.get('/admin/claims/pending'),
  getAllClaims: (status?: string) =>
    api.get('/admin/claims/all', { params: status ? { status } : {} }),
  verifyClaim: (claimId: string, remarks?: string) =>
    api.post('/admin/claims/verify', { claimId, remarks }),
  rejectClaim: (claimId: string, reason: string) =>
    api.post('/admin/claims/reject', { claimId, reason }),
  createInsuranceCompany: (data: { name: string; phoneNumber: string; password: string; companyName: string }) =>
    api.post('/admin/insurance-company', data),
  getInsuranceCompanies: () => api.get('/admin/insurance-companies'),

  // User Management
  getUsers: (role?: string) => api.get('/admin/users', { params: role ? { role: role.toLowerCase() } : {} }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: { name?: string; phoneNumber?: string; email?: string; companyName?: string; wardNumber?: string }) =>
    api.put(`/admin/users/${id}`, data),
  toggleUserStatus: (id: string) => api.patch(`/admin/users/${id}/toggle-status`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  provisionUser: (data: any) => api.post('/admin/provision-user', data),

  // Policy Applications
  getPolicyApplications: (status?: string) => api.get('/admin/policy-applications', { params: status ? { status } : {} }),
  verifyPolicyApplication: (id: string, remarks?: string) => api.post(`/admin/policy-applications/${id}/verify`, { remarks }),
  rejectPolicyApplication: (id: string, remarks?: string) => api.post(`/admin/policy-applications/${id}/reject`, { remarks }),
};

// ==================== LOCATION ====================
// POST /api/location/reverse-geocode → { lat, lng }
// GET  /api/location/districts
// GET  /api/location/palikas/:district
export const locationAPI = {
  reverseGeocode: (lat: number, lng: number) =>
    api.post('/location/reverse-geocode', { lat, lng }),
  getDistricts: () => api.get('/location/districts'),
  getPalikas: (district: string) => api.get(`/location/palikas/${district}`),
};

// ==================== AI ====================
// POST /api/ai/chat → { history }
// POST /api/ai/voice-claim → { transcript }
// POST /api/ai/image-analysis → { imageUrl }
export const aiAPI = {
  chat: (history: any[]) => api.post('/ai/chat', { history }),
  voiceClaim: (transcript: string) => api.post('/ai/voice-claim', { transcript }),
  imageAnalysis: (imageUrl: string) => api.post('/ai/image-analysis', { imageUrl }),
};

// ==================== NOTIFICATIONS ====================
// GET /api/notifications
// GET /api/notifications/unread
// PUT /api/notifications/:id/read
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
};

// ==================== PROFILE ====================
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: FormData) => api.patch('/profile', data),
};

export default api;
