# 🔐 MDPU Admin System - Setup Instructions

## 🚨 Current Status
The admin system is **PARTIALLY WORKING** due to static deployment limitations.

### ✅ What's Working:
- Admin dashboard UI at https://mdpu-website.web.app/admin
- Firebase authentication
- Role-based access control
- Admin interface design

### ❌ What's Not Working:
- Server-side admin functions (API routes)
- Application approval system
- Payment verification
- Admin initialization endpoint

## 🔑 How to Become an Admin

### Method 1: Firebase Console (Recommended)

1. **Visit Firebase Console**: https://console.firebase.google.com/project/mdpu-website/authentication/users

2. **Create Admin Account**:
   - Click "Add User" 
   - Email: `habmfk@gmail.com` (or your admin email)
   - Set a temporary password
   - Note the User UID

3. **Set Admin Claims** using Firebase CLI:
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login and select project
   firebase login
   firebase use mdpu-website
   
   # Open Functions shell
   firebase functions:shell
   
   # Set admin role (replace USER_UID with actual UID)
   admin.auth().setCustomUserClaims('USER_UID_HERE', { role: 'admin' })
   ```

4. **Sign In**:
   - Go to https://mdpu-website.web.app
   - Sign in with the admin email and password
   - Visit https://mdpu-website.web.app/admin

### Method 2: Manual Database Setup

1. **Go to Firestore Console**: https://console.firebase.google.com/project/mdpu-website/firestore

2. **Create User Profile**:
   - Collection: `profiles`
   - Document ID: `[USER_UID]`
   - Fields:
     ```json
     {
       "email": "habmfk@gmail.com",
       "role": "admin",
       "createdAt": "2025-01-18T00:00:00.000Z",
       "isActive": true
     }
     ```

## 🚀 To Enable Full Admin Functionality

The current deployment is static-only. To enable full admin features:

### Option A: Redeploy with Functions

1. **Update Next.js config** for hybrid deployment:
   ```typescript
   // next.config.ts
   const nextConfig = {
     output: 'standalone', // Change from 'export'
     // ... other config
   };
   ```

2. **Update Firebase config**:
   ```json
   {
     "hosting": {
       "public": ".next/out",
       "rewrites": [
         {
           "source": "/api/**",
           "function": "nextjsFunc"
         }
       ]
     },
     "functions": {
       "source": ".next",
       "runtime": "nodejs20"
     }
   }
   ```

3. **Redeploy**:
   ```bash
   npm run build
   firebase deploy
   ```

### Option B: Use Firebase Functions Only

Deploy the existing Cloud Functions for admin operations:
```bash
firebase deploy --only functions
```

## 🎯 Admin Dashboard Features

Once you have admin access, you can use:

### **Applications Tab**
- View pending membership applications
- Approve/reject applications
- Manage member profiles

### **Content Tab**
- Manage public member profiles
- Add/edit projects
- Manage events
- Upload media assets

### **Finance Tab**
- View payment transactions
- Verify offline payments
- Export financial reports
- Generate monthly summaries

## 🔧 Admin Functions Available

### User Management
- View all registered users
- Approve membership applications
- Set user roles and permissions
- Manage member profiles

### Content Management
- Create/edit projects
- Manage events calendar
- Upload and organize media
- Update organization information

### Financial Management
- Process payment verifications
- Generate financial reports
- Export transaction data
- Monitor dues and donations

## 🚨 Important Notes

1. **Environment Setup**: Ensure `.env.local` has all required Firebase credentials
2. **Security**: Admin access is role-based and secure
3. **Limitations**: Some features require server-side functions
4. **Database**: Firestore collections must exist for full functionality

## 📞 Need Help?

If you need assistance setting up admin access:
1. Check Firebase Console for user management
2. Verify environment variables are correct
3. Ensure Firebase project permissions are set
4. Contact technical support if needed

---

**Admin Email**: habmfk@gmail.com  
**Project**: mdpu-website  
**Dashboard**: https://mdpu-website.web.app/admin


