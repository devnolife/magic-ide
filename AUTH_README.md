# Authentication System Documentation

## Overview
Sistem autentikasi Python Learning Platform menggunakan JWT token dengan HttpOnly cookies dan device fingerprinting untuk keamanan.

## Features
- ✅ User registration dan login
- ✅ JWT token dengan HttpOnly cookies
- ✅ Device fingerprinting untuk single device restriction
- ✅ Session management dengan logout time tracking
- ✅ Progress tracking per user
- ✅ Protected routes dengan middleware
- ✅ Responsive login/register UI

## Quick Start

### 1. Environment Setup
Buat file `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ide_magic"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
DEVICE_ENCRYPTION_KEY="your-device-encryption-key-change-this"
```

### 2. Database Setup
```bash
npx prisma db push
```

### 3. Test User Registration
1. Buka http://localhost:3000/register
2. Isi form dengan:
   - Full Name: Test User
   - Username: testuser (min 3 karakter)
   - Password: password123 (min 6 karakter)
3. Klik "Create account"

### 4. Test Login
1. Buka http://localhost:3000/login
2. Login dengan username dan password yang dibuat
3. Akan redirect ke dashboard

## API Endpoints

### POST /api/auth/register
```json
{
  "username": "testuser",
  "password": "password123", 
  "fullName": "Test User"
}
```

### POST /api/auth/login
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### GET /api/auth/verify
Header: Cookie dengan auth-token

### POST /api/auth/logout
Header: Cookie dengan auth-token

## Components

### useAuth Hook
```tsx
const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
```

### LoginForm
```tsx
import { LoginForm } from '@/components/auth/LoginForm';
```

### RegisterForm  
```tsx
import { RegisterForm } from '@/components/auth/RegisterForm';
```

### LogoutButton
```tsx
import { LogoutButton } from '@/components/auth/LogoutButton';

// Button variant
<LogoutButton variant="button" />

// Dropdown variant (with avatar)
<LogoutButton variant="dropdown" />
```

## Protected Routes
Middleware otomatis protect routes:
- `/dashboard`
- `/chapter*` 
- `/api/progress`
- `/api/analytics`
- `/api/time-tracking`

## Security Features

### Single Device Policy
- User hanya bisa login di 1 device
- Login baru akan logout device lama
- Device fingerprint berdasarkan browser + OS + IP

### Token Security
- JWT token via HttpOnly cookies
- Access token: 7 hari
- Refresh token: 30 hari
- Secure flag di production

### Session Tracking
- Login/logout time 
- Session duration calculation
- Device last used tracking

## Database Schema

### User
- id, username, password, fullName, avatar
- isActive flag
- timestamps

### Device  
- deviceFingerprint (encrypted)
- deviceInfo (JSON: browser, OS, etc)
- userId relation

### UserSession
- sessionToken
- loginTime, logoutTime, duration
- isActive flag
- userId, deviceId relations

### Progress Tables
- ChapterProgress (per user, per chapter)
- LessonProgress (detailed per lesson)
- LearningAnalytics (daily stats)

## Error Handling
- Input validation dengan Zod
- Password strength requirements
- Username uniqueness check
- Session expiry handling
- Device conflict resolution

## Next Steps
1. ✅ Basic auth flow working
2. 🔄 Add password reset functionality
3. 🔄 Add email verification
4. 🔄 Add 2FA option
5. 🔄 Add social login (Google, GitHub)
6. 🔄 Add rate limiting
7. 🔄 Add audit logging
8. 🔄 Add admin panel

## Testing
```bash
# Create sample user
node scripts/create-sample-user.js

# Test endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","fullName":"Test User"}'
```
