# KrishiYug Complete Setup & Testing Guide

## Prerequisites
- **Node.js 16+** and **pnpm**
- **MongoDB** (local or Atlas connection)
- **Cloudinary** account (for image/video storage)
- **Google Maps API** key
- **Groq API** key (for AI features)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pnpm install
```

### 2. Configure Environment
Create `backend/.env`:
```env
PORT=3000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/krishiyug
JWT_SECRET=super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# AI & Services
GROQ_API_KEY=gsk_xxxxx
AI_MODEL=llama-3.1-70b-versatile
GOOGLE_MAPS_API_KEY=AIzaSyDxxxx
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

### 3. Start Backend Server
```bash
pnpm dev
```

✅ Backend running on `http://localhost:3000`
✅ Health check: `curl http://localhost:3000/health`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
pnpm install
```

### 2. Configure Environment
Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxx
```

### 3. Start Frontend Development Server
```bash
pnpm dev
```

✅ Frontend running on `http://localhost:5173`

## API Testing Checklist

### Auth Endpoints
```bash
# Register Farmer
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ram Bahadur",
    "phoneNumber": "9841234567",
    "password": "password123",
    "role": "farmer",
    "farmerDetails": {
      "location": {
        "district": "Morang",
        "palika": "Biratnagar"
      }
    }
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9841234567",
    "password": "password123"
  }'

# Admin Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@krishiyug.com",
    "password": "adminpass123"
  }'
```

### Location Testing
```bash
# Reverse Geocode
curl -X POST http://localhost:3000/api/location/reverse-geocode \
  -H "Content-Type: application/json" \
  -d '{"lat": 26.1445, "lng": 87.2738}'
```

### Policy Testing
```bash
# Get All Policies (with JWT token)
curl -X GET http://localhost:3000/api/policies/all \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Recommended
curl -X GET http://localhost:3000/api/policies/recommended \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Claim Testing
```bash
# Submit Claim (requires multipart/form-data with images/videos)
curl -X POST http://localhost:3000/api/claims/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "policyId=POLICY_ID" \
  -F "description=Crops damaged by flood" \
  -F "tagNumber=TAG123" \
  -F "images=@/path/to/image.jpg" \
  -F "video=@/path/to/video.mp4"

# Get My Claims
curl -X GET http://localhost:3000/api/claims/my-claims \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Feature Testing

### 1. Authentication Flow
- [ ] Farmer Registration with location auto-detect
- [ ] Farmer Login
- [ ] Admin Login
- [ ] Logout and redirect
- [ ] Token persistence

### 2. Farmer Dashboard
- [ ] View overview/statistics
- [ ] Browse available policies
- [ ] See recommended policies based on farm type
- [ ] Submit claim with images
- [ ] Track claim status
- [ ] View claim history

### 3. Admin Dashboard
- [ ] View dashboard stats (total claims, pending, etc.)
- [ ] See pending claims for verification
- [ ] Verify/reject claims
- [ ] Create insurance company accounts
- [ ] Manage users by role
- [ ] Manage policies

### 4. Insurance Company Dashboard
- [ ] View verified claims
- [ ] Filter by status
- [ ] Approve/reject claims
- [ ] View settlement decisions
- [ ] Dashboard statistics

### 5. Location Services
- [ ] Auto-detect farm location
- [ ] Reverse geocode works correctly
- [ ] Manual location entry
- [ ] Location saves to user profile

### 6. AI Chat Features
- [ ] Chat widget opens/closes
- [ ] Send chat message
- [ ] AI responds in Nepal + English
- [ ] Voice input works
- [ ] Voice readout works

## Database Setup

### Create Admin User (MongoDB)
```javascript
db.users.insertOne({
  name: "KrishiYug Admin",
  email: "admin@krishiyug.com",
  password: bcrypt_hashed_password,
  role: "admin",
  status: "ACTIVE",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Create Insurance Companies
```javascript
db.users.insertOne({
  name: "Shikhar Insurance",
  companyName: "Shikhar Insurance Co. Ltd.",
  email: "info@shikhar.com",
  password: bcrypt_hashed_password,
  role: "insurance_company",
  status: "ACTIVE",
  createdAt: new Date()
})
```

## Troubleshooting

### Backend Issues
| Issue | Solution |
|-------|----------|
| PORT already in use | `lsof -ti:3000 \| xargs kill -9` or change PORT |
| MongoDB connection fails | Check MONGO_URI and network access |
| Cloudinary upload errors | Verify API credentials in .env |
| CORS errors | Check FRONTEND_URL in backend .env |

### Frontend Issues
| Issue | Solution |
|-------|----------|
| API calls failing | Verify VITE_API_URL in .env.local |
| 401 errors | Clear localStorage, re-login |
| Images not loading | Check Cloudinary URL format |
| Location not detecting | Enable geolocation permission in browser |

### Getting Tokens for Testing
1. Register a user or login
2. Copy token from localStorage in browser DevTools → Application → Local Storage
3. Use token for subsequent API calls

## Database Seeding (Optional)

Create sample data:
```bash
cd backend
node scripts/seedUsers.js
```

## Deployment Checklist

### Backend (Heroku/Render/Railway)
- [ ] Set production environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Test all endpoints
- [ ] Enable database backups
- [ ] Monitor error logs

### Frontend (Vercel/Netlify)
- [ ] Update VITE_API_URL to production backend
- [ ] Build optimized: `pnpm build`
- [ ] Test production build locally
- [ ] Set up auto-deployments from GitHub
- [ ] Monitor build logs

## Performance Optimization

### Backend
- Add pagination to list endpoints
- Implement caching for policies
- Add request rate limiting
- Optimize MongoDB queries with indexes

### Frontend
- Enable code splitting with React.lazy()
- Optimize images with next-gen formats
- Implement infinite scroll for claims
- Use React Query for caching

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Password hashing with bcrypt (rounds: 10+)
- [ ] HTTPS enabled in production
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all forms
- [ ] CORS properly configured
- [ ] Sensitive data not logged
- [ ] API keys stored securely
- [ ] Regular dependency updates
- [ ] Consider 2FA for admin accounts

## Monitoring & Logging

### Backend Logs
```bash
# Show errors only
NODE_ENV=production pnpm start 2>&1 | grep -i error
```

### Frontend Errors
Use Sentry or LogRocket for error tracking

### Database Monitoring
- Monitor query performance
- Set up alerts for connection issues
- Regular backups

## Support & Documentation

- API Documentation: See `/API_INTEGRATION_GUIDE.md`
- Code Structure: See `README.md` in each folder
- Issues: Check logs in browser DevTools and server console
- Feature Requests: Create GitHub issues

---

**Last Updated:** May 2026
**Status:** Production Ready
