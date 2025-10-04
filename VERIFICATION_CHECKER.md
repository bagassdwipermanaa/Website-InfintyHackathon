# Verification Checker Implementation

## Overview
Sistem checker untuk memastikan user sudah login dan melengkapi profil sebelum dapat melakukan verifikasi karya.

## Backend Implementation

### 1. Profile Checker Middleware (`backend/middleware/profileChecker.js`)
- **`checkVerificationEligibility`**: Middleware untuk cek kelengkapan profil sebelum verifikasi
- **`getProfileCompleteness`**: Function untuk menghitung persentase kelengkapan profil
- **Required fields**: `name`, `email`
- **Recommended fields**: `bio`, `walletAddress`, `avatar`, `website`

### 2. Updated Routes
- **`/api/artworks/upload`**: Sekarang menggunakan `checkVerificationEligibility` middleware
- **`/api/auth/me`**: Menambahkan info `profileCompleteness`
- **`/api/auth/profile-status`**: Endpoint baru untuk cek status profil

## Frontend Implementation

### 1. Auth Context (`frontend/hooks/useAuth.ts`)
- Centralized authentication state management
- Profile completeness tracking
- Verification eligibility checking

### 2. Auth Guard Component (`frontend/components/AuthGuard.tsx`)
- Protects routes that require authentication
- Shows modal warning for incomplete profiles
- Redirects to login/profile completion

### 3. Profile Completeness Component (`frontend/components/ProfileCompleteness.tsx`)
- Visual indicator of profile completion percentage
- Shows missing and completed fields
- Verification eligibility status

### 4. Updated Header (`frontend/components/Header.tsx`)
- Shows user authentication status
- Profile completion indicator
- User menu with profile access

## Usage

### Protecting Routes
```tsx
// Require login only
<AuthGuard requireAuth={true}>
  <YourComponent />
</AuthGuard>

// Require login + complete profile
<AuthGuard requireAuth={true} requireCompleteProfile={true}>
  <VerificationComponent />
</AuthGuard>
```

### API Response Examples

#### Profile Status Check
```json
{
  "success": true,
  "canVerify": false,
  "profileCompleteness": {
    "percentage": 50,
    "completedFields": ["name", "email"],
    "missingFields": ["bio", "walletAddress", "avatar", "website"],
    "totalFields": 6
  },
  "missingRequired": [],
  "isActive": true,
  "recommendations": ["bio", "walletAddress", "avatar", "website"]
}
```

#### Upload Artwork (Profile Incomplete)
```json
{
  "success": false,
  "message": "Profile incomplete. Please complete your profile to verify artwork.",
  "code": "PROFILE_INCOMPLETE",
  "missingFields": ["name"],
  "recommendations": ["bio", "walletAddress"],
  "profileUrl": "/dashboard?tab=profile"
}
```

## Testing Scenarios

### 1. User Not Logged In
- Accessing `/verify` → Redirected to `/login`
- Upload artwork API → 401 Unauthorized

### 2. User Logged In, Profile Incomplete
- Accessing `/verify` → Shows completion modal
- Upload artwork API → 400 Profile Incomplete
- Header shows warning indicator

### 3. User Logged In, Profile Complete
- Full access to verification features
- Upload artwork works normally
- Header shows green status

## Environment Setup
Add to `.env`:
```
BACKEND_URL=http://localhost:5000/api
```

## Key Features
✅ Login requirement for verification
✅ Profile completeness checking
✅ Visual indicators in UI
✅ Graceful error handling
✅ Mobile-responsive design
✅ Consistent user experience
✅ Backend API protection
✅ Frontend route guards
