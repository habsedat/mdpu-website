import { Timestamp } from 'firebase/firestore';

// Contact Information types
export interface ContactInfo {
  id?: string;
  email: string;
  phone: string;
  address: string;
  officeHours?: string;
  updatedAt: Timestamp;
  updatedBy: string; // Admin user ID who made the change
}

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
  profilePictureURL?: string; // New profile picture field
  term?: string;
  bio?: string;
  location?: string;
  position?: string;
  image?: string;
  phone?: string; // Add phone field
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
  timeStart: string; // Format: "HH:MM"
  timeEnd?: string; // Format: "HH:MM"
  location: string;
  description: string; // Short description for cards
  details: string; // Full detailed description
  thumbnailUrl?: string; // Event thumbnail/cover image
  gallery: string[];
  category?: string; // e.g., "Community", "Educational", "Cultural", "Fundraising"
  isPublic: boolean; // Whether to show on public events page
  maxAttendees?: number; // Optional capacity limit
  registrationRequired: boolean; // Whether registration is needed
  contactEmail?: string; // Contact for more info
  createdBy: string; // Admin who created the event
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

// News/Blog post types
export type NewsCategory = 'development' | 'events' | 'entertainment' | 'community' | 'announcements' | 'culture' | 'education' | 'health' | 'agriculture' | 'general';
export type NewsStatus = 'draft' | 'published' | 'archived';

export interface NewsPost {
  id?: string;
  title: string;
  summary: string; // Brief description for cards
  content: string; // Full article content
  category: NewsCategory;
  status: NewsStatus;
  featuredImage?: string; // Main image for the post
  images: string[]; // Additional images
  videos: string[]; // Video URLs
  tags: string[]; // Keywords for search
  author: string; // Admin who created it
  authorName: string; // Display name of author
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  views: number; // Track popularity
  likes: number; // Like count
  dislikes: number; // Dislike count
  loves: number; // Love/Heart count
  likedBy: string[]; // User IDs who liked
  dislikedBy: string[]; // User IDs who disliked
  lovedBy: string[]; // User IDs who loved
  isUrgent: boolean; // For urgent news/announcements
  location?: string; // For location-specific news
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

// Document types
export interface Document {
  id?: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadURL: string;
  uploadedBy: string;
  uploadedAt: Timestamp;
  isPublic: boolean;
  category?: string;
  updatedAt?: Timestamp;
}

// Leadership types
export type LeadershipCategory = 'executive' | 'board' | 'chapter';

export interface LeadershipPosition {
  id?: string;
  title: string; // e.g., "Chairman", "Vice President", "Secretary General"
  category: LeadershipCategory;
  order: number; // For display ordering
  description?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface LeadershipAssignment {
  id?: string;
  positionId: string; // Reference to LeadershipPosition
  memberId: string; // Reference to Member document ID
  memberUID: string; // Firebase Auth UID of the member
  startDate: Timestamp;
  endDate?: Timestamp; // Optional end date for terms
  isActive: boolean;
  assignedBy: string; // UID of admin who assigned
  assignedAt: Timestamp;
  notes?: string;
  updatedAt?: Timestamp;
}


