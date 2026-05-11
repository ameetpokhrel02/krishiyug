# Backend API Endpoints

Base URL: `http://localhost:3000`

## General Notes
- Public endpoints do not require authentication.
- Protected endpoints require header:
  - `Authorization: Bearer <JWT_TOKEN>`
- The app exposes `GET /health` and `GET /api/v1` for basic status checks.

---

## 1. Public endpoints

### GET /health
- Description: Server health check.
- Auth: None

### GET /api/v1
- Description: API status check.
- Auth: None

---

## 2. Authentication

### POST /api/auth/register
- Description: Register a new user.
- Auth: None
- Body: JSON
- Response includes:
  - `token` - JWT authentication token
  - `user` - User object
  - `redirectTo` - Frontend route to redirect based on role

#### Farmer example
```json
{
  "phoneNumber": "9841234567",
  "password": "NepalFarm123!",
  "name": "Ram Bahadur",
  "role": "farmer",
  "farmerDetails": {
    "farmSize": 8.5,
    "cropTypes": ["maize", "paddy"],
    "location": {
      "district": "Chitwan",
      "village": "Ratnanagar"
    }
  }
}
```

#### Ward official example
```json
{
  "phoneNumber": "9851234567",
  "password": "WardNepal123!",
  "name": "Sita Sharma",
  "role": "ward_official",
  "wardNumber": "Ward No. 5"
}
```

#### Insurance company example (admin should create this via admin API)
```json
{
  "phoneNumber": "9861234567",
  "password": "BeemaNepal123!",
  "name": "Nepal Beema Admin",
  "role": "insurance_company",
  "companyName": "Rastriya Beema Sansthan"
}
```

### POST /api/auth/login
- Description: Login and receive JWT token.
- Auth: None
- Body: JSON

```json
{
  "phoneNumber": "9876543210",
  "password": "Password123!"
}
```

- Response includes:
  - `token` - JWT authentication token
  - `user` - User object
  - `redirectTo` - Frontend route to redirect based on role
    - farmer → `/farmer/dashboard`
    - admin → `/admin/dashboard`
    - insurance_company → `/insurance/dashboard`
    - ward_official → `/ward/dashboard`
    - insurance_agent → `/agent/dashboard`

### POST /api/auth/logout
- Description: Logout user (client should clear token).
- Auth: Required (any authenticated user)
- Response: Success message

---

## 3. Farmer endpoints

> Requires `Authorization: Bearer <token>` from a user with role `farmer`.

### GET /api/farmer/dashboard
- Description: Farmer dashboard data.

### GET /api/farmer/profile
- Description: Farmer profile data.

### GET /api/farmer/crops
- Description: Farmer crop details.

---

## 4. Ward official endpoints

> Requires `Authorization: Bearer <token>` from a user with role `ward_official`.

### GET /api/ward/dashboard
- Description: Ward official dashboard.

### GET /api/ward/profile
- Description: Ward official profile.

### GET /api/ward/claims/pending
- Description: Pending claims for the ward.
- Note: Returns placeholder data in current implementation.

---

## 5. Insurance company endpoints

> Requires `Authorization: Bearer <token>` from a user with role `insurance_company`.

### GET /api/insurance/dashboard
- Description: Insurance company dashboard stats.

### GET /api/insurance/claims/verified
- Description: Claims already verified by admin.

### GET /api/insurance/claims/all
- Description: All claims for this insurance company.

### POST /api/insurance/claims/decide
- Description: Approve or reject a verified claim.
- Body: JSON

```json
{
  "claimId": "64b4f5a9c2d4e7f125a1b2c3",
  "decision": "approved",
  "reason": "Claim looks valid and is within coverage"
}
```

---

## 6. Admin endpoints

> Requires `Authorization: Bearer <token>` from a user with role `admin`.

### GET /api/admin/dashboard/stats
- Description: Admin dashboard statistics.

### GET /api/admin/claims/pending
- Description: Get pending claims.

### GET /api/admin/claims/all
- Description: Get all claims, optional filter by status.
- Query example: `?status=pending`

### POST /api/admin/claims/verify
- Description: Verify a claim and notify insurance + farmer.
- Body: JSON

```json
{
  "claimId": "64b4f5a9c2d4e7f125a1b2c3",
  "remarks": "Claim verified successfully after document review"
}
```

### POST /api/admin/claims/reject
- Description: Reject a claim.
- Body: JSON

```json
{
  "claimId": "64b4f5a9c2d4e7f125a1b2c3",
  "reason": "Insufficient proof of damage"
}
```

### POST /api/admin/insurance-company
- Description: Create a new insurance company account.
- Body: JSON

```json
{
  "name": "Nepal Beema Admin",
  "phoneNumber": "9861234567",
  "password": "BeemaNepal123!",
  "companyName": "Rastriya Beema Sansthan"
}
```

---

## 7. Policy endpoints

### Admin routes (require admin role)

#### POST /api/policies/
- Description: Create a new insurance policy.
- Auth: Required (admin only)

#### GET /api/policies/all
- Description: Get all policies.
- Auth: Required (admin only)

#### PATCH /api/policies/:policyId/toggle
- Description: Toggle policy active status.
- Auth: Required (admin only)

#### PUT /api/policies/:policyId
- Description: Update policy details.
- Auth: Required (admin only)

### Farmer routes (require farmer role)

#### GET /api/policies/recommended
- Description: Get recommended policies for the farmer.
- Auth: Required (farmer only)

#### POST /api/policies/buy
- Description: Purchase a policy.
- Auth: Required (farmer only)

---

## 8. Claim endpoints

### Farmer routes (require farmer role)

#### POST /api/claims/submit
- Description: Submit a new insurance claim with media files.
- Auth: Required (farmer only)
- Content-Type: multipart/form-data
- Supports file uploads for claim evidence

#### GET /api/claims/my-claims
- Description: Get all claims submitted by the farmer.
- Auth: Required (farmer only)

#### GET /api/claims/:claimId/status
- Description: Get status of a specific claim.
- Auth: Required (farmer only)

### Admin/Insurance routes

#### GET /api/claims/:claimId
- Description: Get detailed claim information.
- Auth: Required (admin or insurance_company)

---

## 9. Notification endpoints

> Requires `Authorization: Bearer <token>` from any authenticated user.

### GET /api/notifications/
- Description: Get user's notifications.
- Query params: `?read=true|false` (optional filter)

### PATCH /api/notifications/:notificationId/read
- Description: Mark a specific notification as read.

### PATCH /api/notifications/mark-all-read
- Description: Mark all user's notifications as read.

---

## 10. CORS Configuration

The API accepts requests from the following origins:
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`
- Custom origin from `FRONTEND_URL` environment variable

**Configuration:**
- Credentials: Enabled
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allowed Headers: Content-Type, Authorization

---

## 11. Suggested Postman workflow
1. `POST /api/auth/register` to create a user.
2. `POST /api/auth/login` to obtain `token`.
3. Add header:
   - `Authorization: Bearer <token>`
4. Call protected routes matching the user role.

---

## 12. Example tokens
- Use the `token` returned by `/api/auth/login`.
- Example header in Postman:
  - Key: `Authorization`
  - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
