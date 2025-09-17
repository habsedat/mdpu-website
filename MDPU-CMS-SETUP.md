# MDPU CMS Implementation Guide

This document outlines the complete conversion of the MDPU website from a static Next.js site to a full-featured CMS application with Firebase backend, admin dashboard, and dual payment rails.

## 🚀 Overview

The MDPU website has been transformed into a comprehensive CMS application featuring:

- **Authentication System**: Firebase Auth with admin role management
- **Membership Applications**: `/apply` page with approval workflow
- **Private Member Profiles**: `/profile` page for approved members
- **Admin Dashboard**: `/admin` with Applications, Content, and Finance management
- **Dual Payment Rails**: 
  - International: Stripe Checkout (card, Apple/Google Pay)
  - Sierra Leone: Bank transfers, Orange Money, AfriMoney
- **Monthly Financial Reports**: Automated generation and CSV export
- **Dynamic Content**: All pages now read from Firestore
- **Media Management**: Upload and organize images/videos
- **Security**: Comprehensive Firestore rules and role-based access

## 📁 Project Structure

```
mdpu-website/
├── src/
│   ├── app/
│   │   ├── admin/page.tsx              # Admin dashboard
│   │   ├── apply/page.tsx              # Membership application
│   │   ├── profile/page.tsx            # Member profile
│   │   ├── leadership/
│   │   │   ├── page.tsx                # Dynamic leadership page
│   │   │   └── dynamic-leadership.tsx  # Firestore-driven component
│   │   └── api/
│   │       ├── admin/approve/route.ts  # Application approval
│   │       ├── checkout/route.ts       # Stripe checkout
│   │       ├── stripe/webhook/route.ts # Stripe webhook
│   │       └── offline/submit/route.ts # Local payment submission
│   ├── components/ui/
│   │   ├── dialog.tsx                  # Modal dialogs
│   │   ├── tabs.tsx                    # Tab navigation
│   │   └── toast.tsx                   # Notifications
│   ├── contexts/
│   │   └── AuthContext.tsx             # Authentication context
│   ├── lib/
│   │   ├── firebase.ts                 # Client Firebase config
│   │   └── firebase-admin.ts           # Server Firebase config
│   └── types/
│       └── firestore.ts                # TypeScript types
├── functions/
│   ├── src/index.ts                    # Cloud Functions
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules                     # Security rules
├── firestore.indexes.json              # Database indexes
├── storage.rules                       # Storage security rules
├── firebase.json                       # Firebase configuration
└── env.template                        # Environment variables template
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd mdpu-website
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication, Firestore, Storage, and Functions
3. Generate service account key for Firebase Admin SDK
4. Copy `env.template` to `.env.local` and fill in your Firebase configuration

### 3. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Add Stripe keys to your environment variables

### 4. Deploy Firebase Rules and Functions

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage

# Deploy Cloud Functions
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### 5. Initialize Admin User

1. Create your first user account through the application
2. Add your email to the `ADMIN_EMAILS` environment variable
3. Apply for membership through the `/apply` page
4. The approval process will automatically set admin role

## 🏗️ Architecture

### Data Models

#### Applications (`applications/{appId}`)
```typescript
{
  uid: string;
  fullName: string;
  email: string;
  chapter: string;
  phone: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
}
```

#### Profiles (`profiles/{uid}`) - Private
```typescript
{
  uid: string;
  fullName: string;
  email: string;
  chapter: string;
  status: "active" | "suspended" | "inactive";
  stripeCustomerId?: string;
  joinDate: Timestamp;
  totals: { contributions: number };
}
```

#### Members (`members/{uid}`) - Public
```typescript
{
  fullName: string;
  role?: string;
  chapter: string;
  avatarUrl?: string;
  term?: string;
  bio?: string;
}
```

#### Payments (`payments/{id}`)
```typescript
{
  uid: string;
  amount: number;
  currency: string;
  method: "stripe" | "bank" | "orange" | "afrimoney";
  type: "dues" | "donation";
  status: "pending" | "succeeded" | "failed" | "verified";
  createdAt: Timestamp;
  evidenceUrl?: string;
  refs?: { reference: string; phoneNumber?: string };
}
```

### Security Rules

- **Default**: Public read access for content
- **Applications**: Owner create/read, admin read/write
- **Profiles**: Owner+admin access only
- **Payments**: Owner+admin read, no client writes
- **Storage**: Public read, admin-only write

### Payment Flows

#### International Payments (Stripe)
1. User clicks "Pay Dues" or "Make Donation"
2. API creates Stripe Checkout session
3. User completes payment
4. Webhook records payment in Firestore
5. User's contribution total is updated

#### Sierra Leone Local Payments
1. **Bank Transfer**: User uploads receipt + reference
2. **Orange Money**: User enters transaction reference + uploads SMS
3. **AfriMoney**: User enters transaction reference + uploads SMS
4. Admin verifies and marks as paid
5. Payment status updated to "verified"

## 🔐 Security Features

### Authentication
- Firebase Auth with email/password
- Custom claims for admin roles
- Protected routes and API endpoints

### Data Privacy
- Personal info (phone/email) stored only in applications/profiles
- Public member cards contain safe fields only
- Private profiles accessible only to owner + admins

### Admin Access
- Role-based permissions via custom claims
- Admin dashboard gated by role check
- All admin operations require authentication

## 📊 Admin Dashboard Features

### Applications Tab
- View pending membership applications
- Approve/reject applications with one click
- Approval creates profile and optional public member card

### Content Tab
- Manage public member profiles
- CRUD operations for projects and events
- Media library for uploads

### Finance Tab
- View all payments with filtering
- Verify offline payments
- Export monthly reports as CSV
- Real-time financial overview

## 🌍 Sierra Leone Payment Integration

### Current Implementation
- **Display + Reconcile** mode for all local methods
- Manual verification by administrators
- Support for bank transfers, Orange Money, and AfriMoney

### Future Enhancement (Optional)
When API credentials are available:
- Orange Money Web Payment API integration
- AfriMoney merchant API integration
- Automatic payment verification
- Real-time status updates

## 📱 Mobile Responsiveness

All components are built with mobile-first design:
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized forms for mobile input
- Progressive Web App capabilities

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
firebase deploy
```

### Environment Variables
Copy `env.template` to `.env.local` and configure:

- Firebase client and admin configuration
- Stripe API keys and webhook secret
- Admin email addresses
- Optional: Orange Money and AfriMoney API credentials

## 🔄 Data Migration

For existing MDPU data:
1. Export current member data to JSON
2. Use Firebase Admin SDK to bulk import
3. Set appropriate roles and permissions
4. Verify data integrity

## 📈 Analytics and Monitoring

- Firebase Analytics for user behavior
- Cloud Functions logs for server operations
- Stripe dashboard for payment analytics
- Custom admin reports for membership metrics

## 🛠️ Maintenance

### Regular Tasks
- Monitor payment webhooks
- Review monthly financial reports
- Update member profiles and roles
- Backup Firestore data

### Updates
- Keep dependencies updated
- Monitor Firebase quotas
- Review security rules periodically
- Update payment method configurations

## 🆘 Support

For technical issues:
1. Check Firebase console for errors
2. Review Cloud Functions logs
3. Verify environment variables
4. Check Firestore security rules

For payment issues:
1. Check Stripe dashboard
2. Verify webhook configuration
3. Review payment status in admin dashboard
4. Contact payment providers if needed

## 📝 License

This implementation is part of the MDPU website project and follows the organization's guidelines for community development and transparency.

---

**Note**: This is a complete CMS transformation that maintains the original design while adding powerful backend functionality. All features are production-ready and follow best practices for security, scalability, and user experience.
