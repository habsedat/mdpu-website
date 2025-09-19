# MDPU CMS - API Keys and Configuration Guide

This guide outlines all the API keys and configuration needed to enable full functionality of the MDPU CMS application.

## 🔑 Required API Keys and Configuration

### 1. Firebase Configuration (CRITICAL - Core Functionality)

#### Client-Side Firebase Config (Public)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

**How to get these:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `mdpu-website`
3. Go to Project Settings → General → Your apps
4. Copy the config values from the Firebase SDK snippet

#### Server-Side Firebase Admin Config (Private)
```env
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

**How to get these:**
1. Firebase Console → Project Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values: `project_id`, `client_email`, `private_key`

**What this enables:**
- User authentication and registration
- Membership applications
- Admin dashboard functionality
- File uploads
- Database operations
- Role-based access control

---

### 2. Stripe Payment Processing (HIGH PRIORITY)

```env
STRIPE_SECRET_KEY=sk_test_51xxxxx_or_sk_live_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_DUES_PRICE_ID=price_xxxxx (optional for subscriptions)
PUBLIC_URL=https://your-domain.com
```

**How to get these:**
1. Create Stripe account: https://dashboard.stripe.com
2. Get API keys from Developers → API keys
3. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Get webhook secret from Webhooks section
5. Create recurring price for dues (optional): Products → Create product

**What this enables:**
- International credit card payments
- Apple Pay and Google Pay
- Recurring membership dues
- One-time donations
- Automatic payment verification
- Financial reporting

---

### 3. Sierra Leone Payment Rails (MEDIUM PRIORITY)

#### Orange Money API (Sierra Leone)
```env
ORANGE_API_KEY=your_orange_api_key
ORANGE_MERCHANT_ID=your_orange_merchant_id
ORANGE_TOKEN_URL=https://api.orange.com/oauth/v3/token
ORANGE_PAYMENT_URL=https://api.orange.com/orange-money-webpay/dev/v1
```

**How to get these:**
1. Visit Orange Developer Portal: https://developer.orange.com
2. Register as a developer
3. Apply for Orange Money Web Payment API access
4. Get merchant credentials from Orange Sierra Leone

**What this enables:**
- Direct Orange Money payments
- Automatic payment verification
- Real-time payment status updates
- Reduced manual verification workload

#### AfriMoney API (Africell Sierra Leone)
```env
AFRIMONEY_API_KEY=your_afrimoney_api_key
AFRIMONEY_MERCHANT_ID=your_afrimoney_merchant_id
AFRIMONEY_BASE_URL=https://api.africell.sl/afrimoney
```

**How to get these:**
1. Contact Africell Sierra Leone business team
2. Apply for merchant API access
3. Get GSMA-standard merchant API credentials

**What this enables:**
- Direct AfriMoney payments
- USSD integration
- Automatic payment verification
- Mobile money reconciliation

---

### 4. Admin Configuration

```env
ADMIN_EMAILS=habmfk@gmail.com,admin@mdpu.org,president@mdpu.org,treasurer@mdpu.org
ADMIN_INIT_KEY=mdpu-admin-init-2024
```

**What this does:**
- Automatically grants admin privileges to these email addresses
- Allows access to admin dashboard
- Enables application approval workflow
- Grants content management permissions
- Provides secure initialization for first admin user

---

## 🚀 Deployment Phases

### Phase 1: Basic Functionality (CURRENT)
**Status:** ✅ Completed - Frontend deployed
**Requires:** No API keys
**Features Available:**
- Static website with all pages
- UI components and layouts
- Basic navigation
- Responsive design

### Phase 2: Core CMS (NEXT PRIORITY)
**Requires:** Firebase keys only
**Features Enabled:**
- User authentication and registration
- Membership application system
- Admin dashboard for approvals
- Profile management
- Content management (members, events, projects)
- File uploads and media management

### Phase 3: International Payments
**Requires:** Firebase + Stripe keys
**Features Enabled:**
- Credit card payments (Visa, Mastercard, etc.)
- Apple Pay and Google Pay
- Recurring membership dues
- One-time donations
- Automatic payment processing
- Financial reporting and CSV exports

### Phase 4: Sierra Leone Local Payments
**Requires:** Firebase + Stripe + Orange Money + AfriMoney keys
**Features Enabled:**
- Orange Money direct payments
- AfriMoney direct payments
- Reduced manual verification
- Complete payment ecosystem for Sierra Leone

---

## 📋 Implementation Priority

### Immediate (Required for basic CMS):
1. **Firebase Configuration** - Enable user accounts and admin functionality
2. **Admin Emails** - Set up initial administrators (habmfk@gmail.com already configured)
3. **Admin Initialization** - Use the init endpoint to create first admin user

### High Priority (Revenue generation):
4. **Stripe Integration** - Enable international payments and donations

### Medium Priority (Local market):
5. **Orange Money API** - Serve Sierra Leone diaspora
6. **AfriMoney API** - Complete local payment options

---

## 🔒 Security Notes

### Environment Variables Setup:
1. **Never commit API keys to Git**
2. **Use different keys for development/production**
3. **Store production keys in Firebase Hosting environment**
4. **Regularly rotate sensitive keys**

### Firebase Security:
- Firestore rules are already configured for role-based access
- Storage rules prevent unauthorized uploads
- Admin operations require custom claims
- Personal data (phone/email) is kept private

### Stripe Security:
- Webhook signature verification implemented
- Customer data stored securely
- PCI compliance through Stripe
- No card data stored locally

---

## 🛠️ Current Implementation Status

### ✅ Completed:
- All frontend components and pages
- Firebase configuration structure
- Stripe payment integration code
- Sierra Leone payment UI and workflows
- Admin dashboard
- Security rules and data models
- Cloud Functions for reporting

### 🔧 Needs API Keys:
- Firebase: Authentication, database, storage
- Stripe: Payment processing
- Orange Money: Direct API integration (optional)
- AfriMoney: Direct API integration (optional)

### 📦 Ready to Deploy:
- Frontend is fully functional
- Backend code is complete
- Security is implemented
- Documentation is comprehensive

---

## 🚀 Next Steps

1. **Get Firebase keys** → Enable core CMS functionality
2. **Initialize first admin** → Create habmfk@gmail.com as admin
3. **Deploy with Firebase keys** → Full member management system
4. **Add Stripe keys** → Enable international payments
5. **Test payment flows** → Ensure smooth user experience
6. **Add local payment APIs** → Complete Sierra Leone integration

### Quick Start for Admin Setup:
See `FIREBASE-ADMIN-SETUP.md` for detailed instructions on configuring Firebase and making habmfk@gmail.com the first administrator.

The application is architecturally complete and ready for production use once the API keys are configured!

