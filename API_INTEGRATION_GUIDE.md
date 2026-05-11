# KrishiYug Backend & Frontend API Integration Guide

## Quick Start

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
pnpm install
```

2. **Create `.env` file**
```env
PORT=3000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/krishiyug
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
AI_MODEL=llama-3.1-70b-versatile
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. **Start Backend Server**
```bash
pnpm dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
pnpm install
```

2. **Create `.env.local` file**
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

3. **Start Frontend Development Server**
```bash
pnpm dev
```

The frontend will run on `http://localhost:5173`

## API Structure

### Authentication Endpoints
- `POST /api/auth/register` - Register new user (farmer/insurance)
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Admin Endpoints
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/claims/pending` - Get pending claims
- `GET /api/admin/claims/all` - Get all claims
- `POST /api/admin/claims/:id/verify` - Verify claim
- `POST /api/admin/claims/:id/reject` - Reject claim
- `GET /api/admin/users` - Get all users
- `GET /api/admin/insurance-companies` - Get insurance companies
- `POST /api/admin/insurance-company` - Create insurance company

### Farmer Endpoints
- `GET /api/farmer/profile` - Get farmer profile
- `PUT /api/farmer/profile` - Update farmer profile
- `GET /api/farmer/policies` - Get active policies
- `GET /api/farmer/browse-policies` - Get available policies to buy
- `GET /api/farmer/claims` - Get farmer's claims
- `POST /api/claims/submit` - Submit new claim

### Policy Endpoints
- `GET /api/policies` - Get all policies
- `GET /api/policies/:id` - Get policy details
- `GET /api/policies/recommended` - Get recommended policies for farmer
- `POST /api/policies` - Create policy (admin)
- `PUT /api/policies/:id` - Update policy (admin)

### Claims Endpoints
- `POST /api/claims/submit` - Submit claim with media
- `GET /api/claims/my-claims` - Get user's claims
- `GET /api/claims/:id` - Get claim details
- `GET /api/claims/:id/status` - Get claim status with timeline

### Insurance Company Endpoints
- `GET /api/insurance/dashboard` - Dashboard stats
- `GET /api/insurance/claims/verified` - Get verified claims
- `GET /api/insurance/claims/all` - Get all claims
- `POST /api/insurance/claims/decide` - Approve/reject claim

### Location Endpoints
- `POST /api/location/reverse-geocode` - Reverse geocode lat/lng
- `GET /api/location/districts` - Get districts
- `GET /api/location/palikas/:district` - Get palikas by district
- `GET /api/location/wards/:district/:palika` - Get wards

### AI Endpoints
- `POST /api/ai/chat` - AI chat with history
- `POST /api/ai/voice-claim` - Process voice input for claims
- `POST /api/ai/image-analysis` - Analyze claim images
- `POST /api/ai/tts` - Text to speech conversion

## Frontend API Service

The frontend uses a centralized API service at `/src/services/api.ts` with organized endpoints:

```typescript
// Import and use
import { authAPI, policyAPI, claimAPI, adminAPI } from '@/services/api';

// Auth
await authAPI.login({ phoneNumber, password });
await authAPI.register(userData);
await authAPI.adminLogin({ email, password });

// Policies
await policyAPI.getAll();
await policyAPI.getRecommended();

// Claims
await claimAPI.submit(formData);
await claimAPI.getUserClaims();

// Admin
await adminAPI.getDashboardStats();
await adminAPI.getClaims();
```

## Data Models

### User Model
```javascript
{
  phoneNumber: String,     // For farmers/insurance
  email: String,          // For admins
  password: String,
  name: String,
  role: 'farmer' | 'insurance_company' | 'admin',
  companyName: String,    // For insurance companies
  farmerDetails: {
    farmType: 'crop' | 'livestock',
    farmSize: Number,
    cropTypes: [String],
    location: {
      district: String,
      palika: String,
      ward: String,
      region: String
    },
    livestockDetails: {
      earTags: [String]
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Policy Model
```javascript
{
  title: String,
  category: 'CROP' | 'LIVESTOCK',
  description: String,
  premiumRate: Number,
  coverageAmount: Number,
  insuranceCompanyId: ObjectId,
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
  createdAt: Date,
  updatedAt: Date
}
```

### Claim Model
```javascript
{
  farmerId: ObjectId,
  policyId: ObjectId,
  tagNumber: String,              // For livestock
  description: String,
  media: {
    images: [String],             // Cloudinary URLs
    video: String
  },
  status: 'pending' | 'admin_verified' | 'refund_approved' | 'rejected',
  adminVerificationReport: Object,
  insuranceDecision: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All API responses follow a standard format:

```javascript
// Success
{
  success: true,
  data: { ... },
  message: "Operation successful"
}

// Error
{
  success: false,
  message: "Error description",
  errors: [ ... ]
}
```

The frontend API service automatically:
- Adds authentication token to all requests
- Handles 401 errors by redirecting to login
- Shows error messages via toast notifications

## Testing Checklist

- [ ] User registration with location detection
- [ ] User login and token storage
- [ ] Admin login
- [ ] Fetch available policies
- [ ] Submit claim with image/video uploads
- [ ] View claim status
- [ ] Admin verify/reject claims
- [ ] Insurance company review claims
- [ ] Location reverse geocoding
- [ ] AI chat functionality
- [ ] Notifications system

## Deployment

### Backend Deployment (Heroku/Vercel)
```bash
pnpm build
pnpm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
pnpm build
# Deploy the 'dist' folder
```

Update `VITE_API_URL` to point to your production backend.

## Support

For API issues, check:
1. Backend logs in terminal
2. Network tab in browser DevTools
3. Console for JavaScript errors
4. MongoDB connection status
