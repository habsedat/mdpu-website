# Firebase Admin Setup Guide - MDPU Website

This guide walks you through setting up Firebase Admin for the MDPU website, including making `habmfk@gmail.com` the first administrator.

## 🔑 Required API Keys

### 1. Firebase Project Setup

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Create or select your project**: `mdpu-website`
3. **Enable required services**:
   - Authentication
   - Firestore Database
   - Storage
   - Functions (optional)

### 2. Get Client-Side Configuration

1. Go to **Project Settings** → **General** → **Your apps**
2. If no web app exists, click **Add app** → **Web**
3. Copy the configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Get Admin SDK Configuration

1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract these values from the JSON:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

**⚠️ Important**: The private key must include the quotes and newlines (`\n`)

## 🛠️ Environment Setup

### 1. Create `.env.local` file

Copy `env.template` to `.env.local` and fill in your values:

```bash
cp env.template .env.local
```

### 2. Required Environment Variables

```env
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Private)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Admin Configuration
ADMIN_EMAILS=habmfk@gmail.com,admin@mdpu.org,president@mdpu.org
ADMIN_INIT_KEY=mdpu-admin-init-2024
```

## 🚀 Initialize First Admin

### Method 1: Using the Init API (Recommended)

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Call the initialization endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/init-first-admin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "habmfk@gmail.com",
       "initKey": "mdpu-admin-init-2024"
     }'
   ```

   Or use this JavaScript in your browser console:
   ```javascript
   fetch('/api/admin/init-first-admin', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       email: 'habmfk@gmail.com',
       initKey: 'mdpu-admin-init-2024'
     })
   }).then(res => res.json()).then(console.log);
   ```

3. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "Admin privileges granted to habmfk@gmail.com",
     "uid": "firebase-user-id",
     "customClaims": { "role": "admin" }
   }
   ```

### Method 2: Manual Firebase Console Setup

1. **Go to Firebase Console** → **Authentication** → **Users**
2. **Find or create user** with email `habmfk@gmail.com`
3. **Set custom claims** using Firebase CLI:
   ```bash
   firebase functions:shell
   # In the shell:
   admin.auth().setCustomUserClaims('USER_UID', { role: 'admin' })
   ```

## 🔐 Access Admin Dashboard

1. **Sign up/Sign in** to the website with `habmfk@gmail.com`
2. **Navigate to**: `http://localhost:3000/admin`
3. **You should see** the full admin dashboard with:
   - Applications management
   - Content management
   - Finance overview

## 🧪 Testing Admin Functions

### 1. Test Authentication
```javascript
// In browser console after signing in
firebase.auth().currentUser.getIdTokenResult()
  .then(result => console.log('Claims:', result.claims));
```

### 2. Test Admin API Access
```javascript
// Test admin API endpoint
fetch('/api/admin/approve', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await firebase.auth().currentUser.getIdToken()}`
  },
  body: JSON.stringify({ applicationId: 'test-id' })
}).then(res => res.json()).then(console.log);
```

## 🔧 Firestore Database Setup

### 1. Initialize Collections

The admin dashboard expects these Firestore collections:
- `applications` - Membership applications
- `members` - Public member profiles
- `profiles` - Private user profiles
- `projects` - Organization projects
- `events` - Events and meetings
- `payments` - Payment records
- `reports` - Financial reports

### 2. Security Rules

The Firestore rules are already configured in `firestore.rules`. Deploy them:

```bash
firebase deploy --only firestore:rules
```

## 🚨 Security Considerations

### 1. Change Default Keys
- Change `ADMIN_INIT_KEY` to something unique
- Use different keys for development/production

### 2. Environment Variables
- Never commit `.env.local` to Git
- Use Firebase Hosting environment config for production
- Rotate service account keys regularly

### 3. Admin Access
- Remove the init endpoint after setup
- Use Firebase Console for additional admin management
- Monitor admin activities through Firebase logs

## 🐛 Troubleshooting

### Common Issues:

1. **"Firebase Admin not initialized"**
   - Check all environment variables are set
   - Verify private key formatting (includes quotes and \n)
   - Check Firebase project permissions

2. **"Insufficient permissions"**
   - Verify custom claims are set correctly
   - Check Firestore rules are deployed
   - Ensure user is signed in

3. **"Invalid initialization key"**
   - Check `ADMIN_INIT_KEY` matches in request and environment
   - Verify environment file is loaded

### Debug Commands:

```bash
# Check environment variables
npm run dev | grep Firebase

# Test Firebase connection
node -e "console.log(require('./src/lib/firebase-admin.ts'))"

# Check Firestore rules
firebase firestore:rules:get
```

## ✅ Success Checklist

- [ ] Firebase project created and configured
- [ ] All environment variables set in `.env.local`
- [ ] Admin user initialized successfully
- [ ] Can access `/admin` dashboard
- [ ] Admin functions working (approve applications, etc.)
- [ ] Firestore rules deployed
- [ ] Security keys changed from defaults

---

**Next Steps**: Once admin access is working, you can proceed to set up Stripe for payments or deploy to production.







