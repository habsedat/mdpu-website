import { Timestamp } from 'firebase/firestore';

// Application types
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id?: string;
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  chapter: string;
  notes?: string;
  status: ApplicationStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Profile types
export type ProfileStatus = 'active' | 'suspended' | 'inactive';

export interface Profile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  chapter: string;
  status: ProfileStatus;
  stripeCustomerId?: string;
  joinDate: Timestamp;
  totals: {
    contributions: number;
  };
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Public member card
export interface Member {
  id?: string; // Firestore document ID
  uid: string;
  fullName: string;
  email: string; // Add email field
  role?: string;
  chapter: string;
  avatarUrl?: string;
  term?: string;
  bio?: string;
  location?: string;
  position?: string;
  image?: string;
  status?: string; // Add status field
  authUID?: string; // Firebase Auth UID if account exists
  accountCreated?: boolean; // Whether Firebase Auth account was created
  joinDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Project types
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface Project {
  id?: string;
  title: string;
  summary: string;
  body: string;
  coverUrl?: string;
  gallery: string[];
  status: ProjectStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Event types
export interface Event {
  id?: string;
  title: string;
  dateStart: Timestamp;
  dateEnd?: Timestamp;
  location: string;
  details: string;
  coverUrl?: string;
  gallery: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Payment types
export type PaymentMethod = 'stripe' | 'bank' | 'orange' | 'afrimoney';
export type PaymentType = 'dues' | 'donation';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'verified';

export interface Payment {
  id?: string;
  uid: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Timestamp;
  evidenceUrl?: string;
  refs?: {
    transactionId?: string;
    reference?: string;
    phoneNumber?: string;
  };
  stripe?: {
    sessionId?: string;
    paymentIntentId?: string;
    customerId?: string;
  };
  verifiedAt?: Timestamp;
  verifiedBy?: string;
}

// Monthly report types
export interface MonthlyReport {
  id: string; // YYYY-MM format
  totalAmount: number;
  byCurrency: Record<string, number>;
  byMethod: Record<PaymentMethod, number>;
  count: number;
  updatedAt: Timestamp;
}

// Media types
export interface Media {
  id?: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Timestamp;
  folder?: string;
}

// User roles
export type UserRole = 'member' | 'admin' | 'superadmin';

export interface UserClaims {
  role?: UserRole;
  email?: string;
  name?: string;
}

// Role management types
export interface Role {
  uid: string;
  email: string;
  role: 'admin' | 'superadmin';
  assignedBy: string;
  assignedAt: Timestamp;
  expiresAt?: Timestamp;
  isActive: boolean;
}

// Admin invite types
export interface AdminInvite {
  id?: string;
  role: 'admin';
  email?: string;
  createdBy: string;
  createdAt: Timestamp;
  expiresAt: Timestamp; // Always now + 1 hour
  adminExpiresAt?: Timestamp; // When the granted admin role expires
  used: boolean;
  usedBy?: string;
  approvals: string[];
  requiredApprovals: number;
}

// Admin audit types
export type AdminAuditAction = 
  | 'invite_created' 
  | 'invite_approved' 
  | 'invite_claimed' 
  | 'invite_expired'
  | 'role_revoked' 
  | 'role_extended' 
  | 'claims_refreshed'
  | 'role_expired';

export interface AdminAudit {
  id?: string;
  action: AdminAuditAction;
  actorUid: string;
  targetUid?: string;
  inviteId?: string;
  timestamp: Timestamp;
  meta?: Record<string, unknown>;
}


