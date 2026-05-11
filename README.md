# KrishiYug - AI-Powered Agricultural Insurance Platform

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## 📋 Project Overview

**KrishiYug** is a comprehensive digital insurance platform designed specifically for Nepali farmers. It combines AI-powered assistance, geolocation technology, and bilingual support to make agricultural insurance accessible, affordable, and easy to use.

### 🎯 Key Features

- **Digital Insurance Claims** - Submit and track claims with multimedia evidence
- **AI-Powered Chatbot** - Bilingual (Nepali/English) support with voice capabilities
- **Geolocation Services** - Auto-detect farm location using GPS
- **Real-time Verification** - Admin verification system for fraud prevention
- **Policy Management** - Browse and compare insurance policies
- **Multi-Role Dashboard** - Separate interfaces for farmers, insurers, and admins
- **Mobile Responsive** - Fully responsive UI for all devices

### 🌾 Use Cases

- **Farmers**: Get insurance protection for crops and livestock
- **Insurance Companies**: Manage claims and automate verification
- **Government**: Monitor agricultural insurance ecosystem
- **Admins**: Dashboard for system-wide oversight

### 📱 How to Use the Platform

#### For Farmers
1. Open the web app in a browser or use the mobile-friendly layout.
2. Register with your name, phone number, district, and palika.
3. Use the AI assistant to ask questions in Nepali or English.
4. Tap the microphone icon for voice help and speak your claim details.
5. Browse policies, buy coverage, and submit claims with photos or video.
6. Track your claim status from the dashboard.

#### For Web and Mobile Users
1. Use the top navigation to switch between Home, Login, and role pages.
2. On web, upload images/videos from your computer.
3. On mobile, use the same buttons and voice command flow.
4. The AI assistant can guide you step-by-step in simple Nepali.

#### Quick Voice Commands
- “माइक्रोफोन थिच्नुहोस्”
- “मेरो दाबी कसरी पेश गर्ने?”
- “बीमा हेर्न कहाँ जाने?”
- “How do I upload a photo?”
- “How do I check claim status?”

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 16+ | Runtime environment |
| **Express.js** | 5.2.1 | Web framework |
| **MongoDB** | 9.6.2 | Database |
| **Mongoose** | 9.6.2 | MongoDB ODM |
| **JWT** | 9.0.3 | Authentication |
| **Bcrypt** | 6.0.0 | Password hashing |
| **Multer** | 2.1.1 | File uploads |
| **Cloudinary** | 2.10.0 | Cloud storage |
| **Groq SDK** | 1.2.0 | AI chat API |
| **Google Maps API** | - | Geolocation |
| **Zod** | 4.4.3 | Schema validation |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.5 | UI library |
| **TypeScript** | 6.0.2 | Type safety |
| **Vite** | 8.0.10 | Build tool |
| **React Router** | 7.15.0 | Navigation |
| **Tailwind CSS** | 4.3.0 | Styling |
| **Framer Motion** | 12.38.0 | Animations |
| **Axios** | 1.16.0 | HTTP client |
| **React Hook Form** | 7.75.0 | Form management |
| **Sonner** | latest | Toast notifications |
| **shadcn/ui** | - | UI components |
| **Zod** | 4.4.3 | Schema validation |

### DevOps & Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **pnpm** | 10.14.0 | Package manager |
| **Nodemon** | 3.1.14 | Development auto-reload |
| **ESLint** | 10.2.1 | Code linting |
| **Prisma** | 7.8.0 | Optional: Database ORM |

---

## 📁 Project Structure

```
krishiyug/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Entry point
│   │   ├── config/                  # Configuration files
│   │   │   ├── cloudinary.js        # Cloudinary setup
│   │   │   └── multer.js            # File upload config
│   │   ├── controllers/             # Business logic
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── claim.controller.js
│   │   │   ├── insurance.controller.js
│   │   │   ├── location.controller.js
│   │   │   └── policy.controller.js
│   │   ├── db/
│   │   │   └── dbConnection.js      # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   └── roleAuth.middleware.js # Role authorization
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── claim.model.js
│   │   │   ├── notification.model.js
│   │   │   ├── policy.model.js
│   │   │   └── user.model.js
│   │   ├── modules/
│   │   │   └── ai/                  # AI chat module
│   │   │       ├── ai.controller.js
│   │   │       ├── ai.prompts.js
│   │   │       ├── ai.routes.js
│   │   │       └── ai.service.js
│   │   ├── routes/                  # API routes
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── claim.routes.js
│   │   │   ├── farmer.routes.js
│   │   │   ├── insurance.routes.js
│   │   │   ├── location.routes.js
│   │   │   ├── notification.routes.js
│   │   │   └── policy.routes.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── validation.schemas.js
│   │   └── scripts/
│   │       └── seedUsers.js         # Database seeding
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── README.md

├── frontend/
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx
│   │   ├── components/              # Reusable components
│   │   │   ├── ai/                  # AI chat components
│   │   │   ├── cards/
│   │   │   ├── chatbot/
│   │   │   ├── common/
│   │   │   ├── dialogs/
│   │   │   ├── forms/
│   │   │   ├── landing/
│   │   │   ├── layout/
│   │   │   ├── loaders/
│   │   │   ├── shared/
│   │   │   ├── ui/
│   │   │   └── voice-assistant/
│   │   ├── config/
│   │   ├── context/                 # React Context
│   │   │   └── LanguageContext.tsx
│   │   ├── features/                # Feature modules
│   │   │   ├── admin/
│   │   │   ├── ai-chatbot/
│   │   │   ├── auth/
│   │   │   ├── claims/
│   │   │   ├── farmer/
│   │   │   ├── insurance/
│   │   │   ├── palika/
│   │   │   └── witness/
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── modules/                 # Route-based modules
│   │   │   ├── admin/
│   │   │   ├── farmer/
│   │   │   ├── insurance/
│   │   │   └── shared/
│   │   ├── pages/                   # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── auth/
│   │   │   └── dashboard/
│   │   ├── providers/               # Context providers
│   │   ├── routes/                  # Route definitions
│   │   │   ├── guards.tsx
│   │   │   ├── index.tsx
│   │   │   └── paths.ts
│   │   ├── services/                # API integration
│   │   │   ├── api.ts               # Centralized API service
│   │   │   └── aiService.ts
│   │   ├── stores/                  # State management
│   │   ├── types/                   # TypeScript types
│   │   └── utils/
│   ├── public/
│   ├── .env.example
│   ├── .env.local
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md

├── API_INTEGRATION_GUIDE.md         # API Documentation
├── SETUP_AND_TESTING_GUIDE.md       # Setup Instructions
├── INTEGRATION_SUMMARY.md           # Integration Overview
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ LTS
- **pnpm** 10.14.0+ (install with `npm install -g pnpm`)
- **MongoDB** (Local or Atlas cluster)
- **Git** for version control

### Backend Setup

#### Linux/Mac Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env with your credentials
nano .env  # or use your preferred editor

# 4. Install dependencies
pnpm install

# 5. Start development server
pnpm dev
```

**Backend will run on:** `http://localhost:3000`

#### Windows Setup

```bash
# Same commands, or use PowerShell
cd backend
Copy-Item .env.example -Destination .env
notepad .env  # Edit environment variables
pnpm install
pnpm dev
```

### Frontend Setup

#### Linux/Mac Setup

```bash
# 1. Navigate to frontend (new terminal)
cd frontend

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit environment (optional for local dev)
nano .env.local

# 4. Install dependencies
pnpm install

# 5. Start development server
pnpm dev
```

**Frontend will run on:** `http://localhost:5173`

#### Windows Setup

```bash
cd frontend
Copy-Item .env.example -Destination .env.local
notepad .env.local  # Optional
pnpm install
pnpm dev
```

---

## 🔐 Environment Configuration

### Backend `.env` Required Variables

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/krishiyug

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# AI Services
GROQ_API_KEY=gsk_your_groq_api_key
AI_MODEL=llama-3.1-70b-versatile

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSyD_your_google_maps_key

# Cloudinary (File Storage)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend `.env.local` Required Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD_your_google_maps_key
```

---

## 👤 Default Login Credentials

### Admin Account

```
Email: admin@krishiyug.com
Password: Admin@12345
Role: Administrator
```

### Sample Farmer Account

```
Phone: 9841234567
Password: Farmer@1234
Role: Farmer
Location: Morang, Biratnagar
```

---

## 📊 API Endpoints Overview

### Core Endpoint Groups

| Endpoint | Purpose | Auth |
|----------|---------|------|
| `/api/auth/*` | User registration & login | Public/JWT |
| `/api/policies/*` | Insurance policy management | JWT |
| `/api/claims/*` | Claim submission & tracking | JWT |
| `/api/admin/*` | Admin dashboard & verification | JWT + Admin |
| `/api/insurance/*` | Insurance company operations | JWT + Insurance |
| `/api/farmer/*` | Farmer profile & operations | JWT + Farmer |
| `/api/location/*` | Geolocation services | Public |
| `/api/ai/*` | AI chat & voice support | JWT |
| `/api/notifications/*` | Real-time notifications | JWT |

See `API_INTEGRATION_GUIDE.md` for complete endpoint documentation.

---

## 🎨 Available Commands

### Backend Commands

```bash
pnpm dev          # Start development server with auto-reload
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Frontend Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

---

## 🧪 Testing the Application

### 1. Test User Registration

**Frontend:** Navigate to `/auth/register`
- Enter farmer details
- Click "Auto-Detect" for location
- Submit form

**CLI:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ram Bahadur",
    "phoneNumber": "9841234567",
    "password": "password123",
    "role": "farmer"
  }'
```

### 2. Test Admin Login

**Frontend:** Navigate to `/auth/admin-login`
- Use credentials above
- Access admin dashboard

### 3. Test API Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "KrishiYug Server is Healthy"
}
```

---

## 📚 Key Features Documentation

### User Roles

1. **Farmer**
   - Browse insurance policies
   - Submit claims with evidence
   - Track claim status
   - Access AI support

2. **Insurance Company**
   - Review verified claims
   - Approve/reject settlements
   - View company dashboard
   - Manage policies

3. **Admin**
   - Verify claims authenticity
   - Manage all users
   - System-wide oversight
   - Create insurance accounts

### Geolocation Integration

- Auto-detect farm location using browser GPS
- Reverse geocode to get District/Palika
- Manual override option
- Backend integration with Google Maps API

### AI Chat Features

- Bilingual support (Nepali/English)
- Voice input & output
- Image analysis for claims
- Voice claim submission

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | `lsof -ti:3000 \| xargs kill -9` |
| MongoDB connection fails | Check MONGO_URI and network access |
| API 401 errors | Check JWT token in localStorage |
| CORS errors | Verify FRONTEND_URL in backend .env |
| Location not detecting | Enable geolocation permissions |
| Cloudinary upload fails | Verify API credentials |

See `SETUP_AND_TESTING_GUIDE.md` for more troubleshooting.

---

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

```bash
# Set production environment variables
# Ensure MongoDB Atlas connection string is set
# Deploy using Git push or CLI
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Update VITE_API_URL to production backend
pnpm build
# Deploy the dist/ folder
```

---

## 📈 Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- MongoDB query indexing
- Request caching with React Query
- Rate limiting on API endpoints

---

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control
- Input validation (Zod schemas)
- CORS properly configured
- Secure file upload via Cloudinary
- Environment variables protected

---

## 📝 Development Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test locally
3. Commit with meaningful messages: `git commit -m "feat: add feature"`
4. Push to remote: `git push origin feature/feature-name`
5. Create Pull Request for code review
6. Merge to main after approval

---

## 📞 Support & Documentation

- **API Docs:** See `API_INTEGRATION_GUIDE.md`
- **Setup Guide:** See `SETUP_AND_TESTING_GUIDE.md`
- **Integration Guide:** See `INTEGRATION_SUMMARY.md`

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Team & Contributors

**Project:** KrishiYug - AI-Powered Agricultural Insurance
**Created:** May 2026
**Status:** Production Ready

---

## 🙏 Acknowledgments

- Google Maps API for geolocation
- Groq AI for chat capabilities
- MongoDB for database
- Cloudinary for file storage
- Nepali agricultural community for inspiration

---

**Last Updated:** May 11, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
