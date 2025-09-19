import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { beforeUserSignedIn } from 'firebase-functions/v2/identity';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Admin initialization key from Firebase config
const ADMIN_INIT_KEY = functions.config().admin?.init_key || 'mdpu-admin-init-2024';

/**
 * Scheduled function to generate monthly financial reports
 * Runs on the 1st of each month at 9:00 AM Africa/Freetown time
 */
export const generateMonthlyReport = onSchedule(
  {
    schedule: '0 9 1 * *',
    timeZone: 'Africa/Freetown',
  },
  async (event) => {
    try {
      console.log('Starting monthly report generation...');

      // Get the previous month
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const reportId = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

      // Check if report already exists
      const existingReport = await db.collection('reports').doc('monthly').collection('reports').doc(reportId).get();
      if (existingReport.exists) {
        console.log(`Report for ${reportId} already exists`);
        return;
      }

      // Query payments for the previous month
      const paymentsQuery = db.collection('payments')
        .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(lastMonth))
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(thisMonth))
        .where('status', 'in', ['succeeded', 'verified']);

      const paymentsSnapshot = await paymentsQuery.get();
      
      let totalAmount = 0;
      const byCurrency: Record<string, number> = {};
      const byMethod: Record<string, number> = {};
      const byType: Record<string, number> = {};
      
      paymentsSnapshot.forEach((doc) => {
        const payment = doc.data();
        const amount = payment.amount || 0;
        const currency = payment.currency || 'USD';
        const method = payment.method || 'unknown';
        const type = payment.type || 'unknown';

        // Convert all amounts to USD for total (simplified conversion)
        let usdAmount = amount;
        if (currency === 'SLL') {
          // Approximate conversion rate (in production, use real exchange rates)
          usdAmount = amount / 20000; // 1 USD ≈ 20,000 SLL
        }

        totalAmount += usdAmount;
        
        byCurrency[currency] = (byCurrency[currency] || 0) + amount;
        byMethod[method] = (byMethod[method] || 0) + usdAmount;
        byType[type] = (byType[type] || 0) + usdAmount;
      });

      // Create the report
      const reportData = {
        id: reportId,
        period: {
          start: admin.firestore.Timestamp.fromDate(lastMonth),
          end: admin.firestore.Timestamp.fromDate(thisMonth),
        },
        totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
        byCurrency,
        byMethod,
        byType,
        count: paymentsSnapshot.size,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Save the report
      await db.collection('reports').doc('monthly').collection('reports').doc(reportId).set(reportData);

      console.log(`Monthly report generated for ${reportId}:`, {
        totalAmount: reportData.totalAmount,
        count: reportData.count,
        byCurrency,
        byMethod,
        byType,
      });

      return;

    } catch (error) {
      console.error('Error generating monthly report:', error);
      throw error;
    }
  });

/**
 * HTTP function to manually trigger monthly report generation
 * Useful for testing or generating reports for specific months
 */
export const triggerMonthlyReport = onRequest(async (req, res) => {
    try {
      // Verify admin access (in production, add proper authentication)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Check if user is admin
      if (decodedToken.role !== 'admin') {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      const { year, month } = req.body;
      
      if (!year || !month) {
        res.status(400).json({ error: 'Year and month are required' });
        return;
      }

      // Generate report for specified month
      const reportMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      const nextMonth = new Date(parseInt(year), parseInt(month), 1);
      const reportId = `${year}-${String(month).padStart(2, '0')}`;

      console.log(`Generating manual report for ${reportId}...`);

      // Query payments for the specified month
      const paymentsQuery = db.collection('payments')
        .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(reportMonth))
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(nextMonth))
        .where('status', 'in', ['succeeded', 'verified']);

      const paymentsSnapshot = await paymentsQuery.get();
      
      let totalAmount = 0;
      const byCurrency: Record<string, number> = {};
      const byMethod: Record<string, number> = {};
      const byType: Record<string, number> = {};
      
      paymentsSnapshot.forEach((doc) => {
        const payment = doc.data();
        const amount = payment.amount || 0;
        const currency = payment.currency || 'USD';
        const method = payment.method || 'unknown';
        const type = payment.type || 'unknown';

        // Convert all amounts to USD for total
        let usdAmount = amount;
        if (currency === 'SLL') {
          usdAmount = amount / 20000;
        }

        totalAmount += usdAmount;
        
        byCurrency[currency] = (byCurrency[currency] || 0) + amount;
        byMethod[method] = (byMethod[method] || 0) + usdAmount;
        byType[type] = (byType[type] || 0) + usdAmount;
      });

      // Create the report
      const reportData = {
        id: reportId,
        period: {
          start: admin.firestore.Timestamp.fromDate(reportMonth),
          end: admin.firestore.Timestamp.fromDate(nextMonth),
        },
        totalAmount: Math.round(totalAmount * 100) / 100,
        byCurrency,
        byMethod,
        byType,
        count: paymentsSnapshot.size,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Save the report (overwrite if exists)
      await db.collection('reports').doc('monthly').collection('reports').doc(reportId).set(reportData);

      res.json({
        success: true,
        reportId,
        data: reportData,
      });

    } catch (error) {
      console.error('Error triggering monthly report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
 * HTTP function to export monthly report as CSV
 */
export const exportMonthlyReport = onRequest(async (req, res) => {
    try {
      // Verify admin access
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      if (decodedToken.role !== 'admin') {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      const reportId = req.query.reportId as string;
      if (!reportId) {
        res.status(400).json({ error: 'Report ID is required' });
        return;
      }

      // Get the report
      const reportDoc = await db.collection('reports').doc('monthly').collection('reports').doc(reportId).get();
      
      if (!reportDoc.exists) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }

      const report = reportDoc.data()!;

      // Get detailed payments for the report period
      const paymentsQuery = db.collection('payments')
        .where('createdAt', '>=', report.period.start)
        .where('createdAt', '<', report.period.end)
        .where('status', 'in', ['succeeded', 'verified'])
        .orderBy('createdAt', 'desc');

      const paymentsSnapshot = await paymentsQuery.get();

      // Generate CSV content
      const csvHeaders = 'Date,Amount,Currency,Method,Type,Status,Reference,User ID\n';
      const csvRows = paymentsSnapshot.docs.map(doc => {
        const payment = doc.data();
        const date = payment.createdAt.toDate().toISOString().split('T')[0];
        const reference = payment.refs?.reference || '';
        
        return [
          date,
          payment.amount,
          payment.currency,
          payment.method,
          payment.type,
          payment.status,
          reference,
          payment.uid
        ].join(',');
      }).join('\n');

      const csvContent = csvHeaders + csvRows;

      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="mdpu-report-${reportId}.csv"`);
      res.send(csvContent);

    } catch (error) {
      console.error('Error exporting monthly report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
 * Callable function to assign admin roles
 * Supports bootstrap with ADMIN_INIT_KEY or requires superadmin permissions
 */
export const createMemberAccount = onCall(async (request) => {
  try {
    const { applicationId } = request.data;
    const { auth } = request;

    // Check if user is admin
    if (!auth || !auth.token.role || (auth.token.role !== 'admin' && auth.token.role !== 'superadmin')) {
      throw new HttpsError('permission-denied', 'Only admins can create member accounts');
    }

    // Get application data
    const applicationDoc = await db.collection('applications').doc(applicationId).get();
    if (!applicationDoc.exists) {
      throw new HttpsError('not-found', 'Application not found');
    }

    const applicationData = applicationDoc.data()!;
    
    if (applicationData.status !== 'approved') {
      throw new HttpsError('failed-precondition', 'Application must be approved first');
    }

    if (applicationData.accountCreated) {
      throw new HttpsError('already-exists', 'Account already created for this application');
    }

    // Create Firebase Auth user with application ID as UID
    const userRecord = await admin.auth().createUser({
      uid: applicationId, // Use application ID as UID
      email: applicationData.email,
      password: applicationData.password,
      displayName: applicationData.fullName,
      emailVerified: false, // Will be verified via email
    });

    // Update application to mark account as created
    await db.collection('applications').doc(applicationId).update({
      accountCreated: true,
      authUID: userRecord.uid,
      accountCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
      accountCreatedBy: auth.uid,
    });

    // Generate activation link
    const activationLink = await admin.auth().generateEmailVerificationLink(applicationData.email);
    
    // TODO: Send email with activation link (you can integrate with SendGrid, Nodemailer, etc.)
    console.log(`Account created for ${applicationData.email}`);
    console.log(`Activation link: ${activationLink}`);
    
    await logAdminAction('account_created', auth.uid, userRecord.uid, applicationId, { 
      email: applicationData.email,
      fullName: applicationData.fullName
    });

    return { 
      success: true, 
      message: `Account created for ${applicationData.fullName}`,
      uid: userRecord.uid,
      activationLink, // Return link for now (later send via email)
    };
  } catch (error: any) {
    console.error('Error creating member account:', error);
    throw new HttpsError('internal', `Failed to create account: ${error.message}`);
  }
});

export const assignRole = onCall(async (request) => {
  try {
    const { email, role, expiresAt, initKey } = request.data;
    const { auth } = request;

    if (!email || !role) {
      throw new Error('Email and role are required');
    }

    if (!['admin', 'superadmin'].includes(role)) {
      throw new Error('Invalid role. Must be admin or superadmin');
    }

    // Check authorization
    let isBootstrap = false;
    if (initKey === ADMIN_INIT_KEY) {
      // Bootstrap mode - first superadmin setup
      isBootstrap = true;
      console.log('Bootstrap mode: Creating first superadmin');
    } else if (!auth || auth.token.role !== 'superadmin') {
      throw new Error('Only superadmin can assign roles');
    }

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // Create role document
    const roleData = {
      uid,
      email,
      role,
      assignedBy: isBootstrap ? 'system' : auth!.uid,
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: expiresAt ? admin.firestore.Timestamp.fromDate(new Date(expiresAt)) : null,
      isActive: true,
    };

    await db.collection('roles').doc(uid).set(roleData);

    // Set custom claims immediately
    await admin.auth().setCustomUserClaims(uid, { role });

    console.log(`Role ${role} assigned to ${email} (${uid})`);

    return {
      success: true,
      message: `Role ${role} assigned to ${email}`,
      uid,
      role,
    };
  } catch (error: any) {
    console.error('Error assigning role:', error);
    throw new Error(`Failed to assign role: ${error.message}`);
  }
});

/**
 * Callable function to refresh user claims based on roles collection
 * Superadmin only
 */
export const refreshClaims = onCall(async (request) => {
  try {
    const { uid } = request.data;
    const { auth } = request;

    if (!auth || auth.token.role !== 'superadmin') {
      throw new Error('Only superadmin can refresh claims');
    }

    if (!uid) {
      throw new Error('UID is required');
    }

    // Get role document
    const roleDoc = await db.collection('roles').doc(uid).get();
    
    if (!roleDoc.exists) {
      // No role - clear claims
      await admin.auth().setCustomUserClaims(uid, { role: null });
      return { success: true, message: 'Claims cleared - no active role' };
    }

    const roleData = roleDoc.data()!;

    // Check if role is expired
    if (roleData.expiresAt && roleData.expiresAt.toDate() < new Date()) {
      // Expired - remove role and clear claims
      await db.collection('roles').doc(uid).delete();
      await admin.auth().setCustomUserClaims(uid, { role: null });
      return { success: true, message: 'Role expired and removed' };
    }

    // Set claims based on role
    await admin.auth().setCustomUserClaims(uid, { role: roleData.role });

    return {
      success: true,
      message: `Claims refreshed for ${roleData.role}`,
      role: roleData.role,
    };
  } catch (error: any) {
    console.error('Error refreshing claims:', error);
    throw new Error(`Failed to refresh claims: ${error.message}`);
  }
});

/**
 * Callable function to revoke a role
 * Superadmin only
 */
export const revokeRole = onCall(async (request) => {
  try {
    const { uid } = request.data;
    const { auth } = request;

    if (!auth || auth.token.role !== 'superadmin') {
      throw new Error('Only superadmin can revoke roles');
    }

    if (!uid) {
      throw new Error('UID is required');
    }

    // Remove role document
    await db.collection('roles').doc(uid).delete();

    // Clear custom claims
    await admin.auth().setCustomUserClaims(uid, { role: null });

    console.log(`Role revoked for user ${uid}`);

    return {
      success: true,
      message: 'Role revoked successfully',
      uid,
    };
  } catch (error: any) {
    console.error('Error revoking role:', error);
    throw new Error(`Failed to revoke role: ${error.message}`);
  }
});

/**
 * Auth trigger to sync roles on user sign-in
 */
export const syncRolesOnSignIn = beforeUserSignedIn(async (event) => {
  if (!event.data) return;
  
  const uid = event.data.uid;

  try {
    // Get role document
    const roleDoc = await db.collection('roles').doc(uid).get();
    
    if (!roleDoc.exists) {
      // No role - ensure claims are cleared
      if (event.data.customClaims?.role) {
        await admin.auth().setCustomUserClaims(uid, { role: null });
      }
      return;
    }

    const roleData = roleDoc.data()!;

    // Check if role is expired
    if (roleData.expiresAt && roleData.expiresAt.toDate() < new Date()) {
      // Expired - remove role and clear claims
      await db.collection('roles').doc(uid).delete();
      await admin.auth().setCustomUserClaims(uid, { role: null });
      console.log(`Expired role removed for user ${uid}`);
      return;
    }

    // Set claims if not already set or different
    const currentRole = event.data.customClaims?.role;
    if (currentRole !== roleData.role) {
      await admin.auth().setCustomUserClaims(uid, { role: roleData.role });
      console.log(`Claims synced for user ${uid}: ${roleData.role}`);
    }
  } catch (error) {
    console.error('Error syncing roles on sign-in:', error);
    // Don't throw - allow sign-in to continue
  }
});

/**
 * Scheduled function to clean up expired roles
 * Runs hourly
 */
export const cleanupExpiredRoles = onSchedule(
  {
    schedule: '0 * * * *', // Every hour
    timeZone: 'Africa/Freetown',
  },
  async (event) => {
    try {
      console.log('Starting expired roles cleanup...');

      const now = new Date();
      const expiredQuery = db.collection('roles')
        .where('expiresAt', '<=', admin.firestore.Timestamp.fromDate(now))
        .where('isActive', '==', true);

      const expiredSnapshot = await expiredQuery.get();

      if (expiredSnapshot.empty) {
        console.log('No expired roles found');
        return;
      }

      const batch = db.batch();
      const uidsToUpdate: string[] = [];

      expiredSnapshot.forEach((doc) => {
        const roleData = doc.data();
        batch.delete(doc.ref);
        uidsToUpdate.push(roleData.uid);
        console.log(`Marking role for cleanup: ${roleData.email} (${roleData.role})`);
      });

      // Delete expired role documents
      await batch.commit();

      // Clear custom claims for expired users
      for (const uid of uidsToUpdate) {
        try {
          await admin.auth().setCustomUserClaims(uid, { role: null });
          console.log(`Claims cleared for expired user: ${uid}`);
        } catch (error) {
          console.error(`Failed to clear claims for ${uid}:`, error);
        }
      }

      console.log(`Cleaned up ${expiredSnapshot.size} expired roles`);
    } catch (error) {
      console.error('Error during expired roles cleanup:', error);
    }
  }
);

/**
 * Helper function to log admin actions for audit trail
 */
async function logAdminAction(
  action: string,
  actorUid: string,
  targetUid?: string,
  inviteId?: string,
  meta?: Record<string, any>
) {
  try {
    await db.collection('adminAudit').add({
      action,
      actorUid,
      targetUid: targetUid || null,
      inviteId: inviteId || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      meta: meta || {},
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

/**
 * Callable function to create admin invites
 * Superadmin only, 1-hour expiry, single-use
 */
export const createAdminInvite = onCall(async (request) => {
  try {
    const { role = 'admin', email, requiredApprovals = 0, adminExpiresAt } = request.data;
    const { auth } = request;

    if (!auth || auth.token.role !== 'superadmin') {
      throw new Error('Only superadmin can create admin invites');
    }

    if (role !== 'admin') {
      throw new Error('Can only create admin role invites');
    }

    if (requiredApprovals < 0 || requiredApprovals > 5) {
      throw new Error('Required approvals must be between 0 and 5');
    }

    // Create invite with 1-hour expiry (hard rule)
    const now = new Date();
    const inviteExpiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour

    const inviteData = {
      role,
      email: email || null,
      createdBy: auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(inviteExpiresAt),
      adminExpiresAt: adminExpiresAt ? admin.firestore.Timestamp.fromDate(new Date(adminExpiresAt)) : null,
      used: false,
      usedBy: null,
      approvals: [],
      requiredApprovals,
    };

    // Create invite document
    const inviteRef = await db.collection('adminInvites').add(inviteData);
    const inviteId = inviteRef.id;

    // Log action
    await logAdminAction('invite_created', auth.uid, undefined, inviteId, {
      role,
      email,
      requiredApprovals,
      adminExpiresAt: adminExpiresAt || null,
    });

    const claimUrl = `${process.env.PUBLIC_URL || 'https://mdpu-website.web.app'}/admin/invite/${inviteId}`;

    console.log(`Admin invite created: ${inviteId} by ${auth.uid}`);

    return {
      success: true,
      inviteId,
      claimUrl,
      expiresAt: inviteExpiresAt.toISOString(),
      message: 'Admin invite created successfully',
    };
  } catch (error: any) {
    console.error('Error creating admin invite:', error);
    throw new Error(`Failed to create admin invite: ${error.message}`);
  }
});

/**
 * Callable function to approve admin invites
 * Superadmin only, adds approval to invite
 */
export const approveInvite = onCall(async (request) => {
  try {
    const { inviteId } = request.data;
    const { auth } = request;

    if (!auth || auth.token.role !== 'superadmin') {
      throw new Error('Only superadmin can approve invites');
    }

    if (!inviteId) {
      throw new Error('Invite ID is required');
    }

    // Use transaction to ensure consistency
    const result = await db.runTransaction(async (transaction) => {
      const inviteRef = db.collection('adminInvites').doc(inviteId);
      const inviteDoc = await transaction.get(inviteRef);

      if (!inviteDoc.exists) {
        throw new Error('Invite not found');
      }

      const inviteData = inviteDoc.data()!;

      // Validate invite
      if (inviteData.used) {
        throw new Error('Invite already used');
      }

      if (inviteData.expiresAt.toDate() < new Date()) {
        throw new Error('Invite expired');
      }

      // Check if already approved by this user
      if (inviteData.approvals.includes(auth.uid)) {
        throw new Error('You have already approved this invite');
      }

      // Add approval
      const newApprovals = [...inviteData.approvals, auth.uid];
      transaction.update(inviteRef, {
        approvals: newApprovals,
      });

      return {
        approvals: newApprovals,
        requiredApprovals: inviteData.requiredApprovals,
      };
    });

    // Log action
    await logAdminAction('invite_approved', auth.uid, undefined, inviteId, {
      approvalsCount: result.approvals.length,
      requiredApprovals: result.requiredApprovals,
    });

    console.log(`Invite ${inviteId} approved by ${auth.uid}`);

    return {
      success: true,
      message: 'Invite approved successfully',
      approvals: result.approvals.length,
      requiredApprovals: result.requiredApprovals,
    };
  } catch (error: any) {
    console.error('Error approving invite:', error);
    throw new Error(`Failed to approve invite: ${error.message}`);
  }
});

/**
 * Callable function to claim admin invites
 * Authenticated user, single-use with transaction
 */
export const claimAdminInvite = onCall(async (request) => {
  try {
    const { inviteId } = request.data;
    const { auth } = request;

    if (!auth) {
      throw new Error('Must be authenticated to claim invite');
    }

    if (!inviteId) {
      throw new Error('Invite ID is required');
    }

    // Use transaction for single-use guarantee
    const result = await db.runTransaction(async (transaction) => {
      const inviteRef = db.collection('adminInvites').doc(inviteId);
      const inviteDoc = await transaction.get(inviteRef);

      if (!inviteDoc.exists) {
        throw new Error('Invite not found');
      }

      const inviteData = inviteDoc.data()!;

      // Validate invite
      if (inviteData.used) {
        throw new Error('Invite already used');
      }

      if (inviteData.expiresAt.toDate() < new Date()) {
        throw new Error('Invite expired (1-hour limit)');
      }

      if (inviteData.approvals.length < inviteData.requiredApprovals) {
        throw new Error(`Invite requires ${inviteData.requiredApprovals} approvals, only has ${inviteData.approvals.length}`);
      }

      // Check email match if specified
      if (inviteData.email) {
        const userRecord = await admin.auth().getUser(auth.uid);
        if (userRecord.email !== inviteData.email) {
          throw new Error('This invite is for a different email address');
        }
      }

      // Mark invite as used (single-use enforcement)
      transaction.update(inviteRef, {
        used: true,
        usedBy: auth.uid,
      });

      // Create/update role document
      const roleRef = db.collection('roles').doc(auth.uid);
      const roleData = {
        uid: auth.uid,
        email: (await admin.auth().getUser(auth.uid)).email || '',
        role: inviteData.role,
        assignedBy: inviteData.createdBy,
        assignedAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: inviteData.adminExpiresAt || null,
        isActive: true,
      };

      transaction.set(roleRef, roleData);

      return {
        role: inviteData.role,
        expiresAt: inviteData.adminExpiresAt,
        createdBy: inviteData.createdBy,
      };
    });

    // Set custom claims immediately
    await admin.auth().setCustomUserClaims(auth.uid, { role: result.role });

    // Log action
    await logAdminAction('invite_claimed', auth.uid, auth.uid, inviteId, {
      role: result.role,
      expiresAt: result.expiresAt?.toDate?.()?.toISOString?.() || null,
    });

    console.log(`Invite ${inviteId} claimed by ${auth.uid}`);

    return {
      success: true,
      message: 'Admin invite claimed successfully',
      role: result.role,
      expiresAt: result.expiresAt?.toDate?.()?.toISOString?.() || null,
    };
  } catch (error: any) {
    console.error('Error claiming invite:', error);
    throw new Error(`Failed to claim invite: ${error.message}`);
  }
});

/**
 * Extend admin role expiry
 * Superadmin only
 */
export const extendAdminRole = onCall(async (request) => {
  try {
    const { uid, newExpiresAt } = request.data;
    const { auth } = request;

    if (!auth || auth.token.role !== 'superadmin') {
      throw new Error('Only superadmin can extend roles');
    }

    if (!uid || !newExpiresAt) {
      throw new Error('UID and new expiry date are required');
    }

    // Update role document
    const roleRef = db.collection('roles').doc(uid);
    const roleDoc = await roleRef.get();

    if (!roleDoc.exists) {
      throw new Error('Role not found');
    }

    await roleRef.update({
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(newExpiresAt)),
    });

    // Refresh claims
    const roleData = roleDoc.data()!;
    await admin.auth().setCustomUserClaims(uid, { role: roleData.role });

    // Log action
    await logAdminAction('role_extended', auth.uid, uid, undefined, {
      newExpiresAt,
      role: roleData.role,
    });

    console.log(`Role extended for ${uid} until ${newExpiresAt}`);

    return {
      success: true,
      message: 'Role extended successfully',
      newExpiresAt,
    };
  } catch (error: any) {
    console.error('Error extending role:', error);
    throw new Error(`Failed to extend role: ${error.message}`);
  }
});

/**
 * Callable function to delete a Firebase Auth user
 * Only admins can delete users
 */
export const deleteUser = onCall(async (request) => {
  try {
    const { uid } = request.data;
    const { auth } = request;

    // Check if user is admin
    if (!auth || !auth.token.role || (auth.token.role !== 'admin' && auth.token.role !== 'superadmin')) {
      throw new HttpsError('permission-denied', 'Only admins can delete users');
    }

    if (!uid) {
      throw new HttpsError('invalid-argument', 'User UID is required');
    }

    // Delete the Firebase Auth user
    await admin.auth().deleteUser(uid);

    await logAdminAction('user_deleted', auth.uid, uid, undefined, { 
      deletedBy: auth.uid
    });

    console.log(`Firebase Auth user deleted: ${uid} by ${auth.uid}`);

    return { 
      success: true, 
      message: 'User deleted successfully',
      deletedUID: uid
    };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new HttpsError('internal', `Failed to delete user: ${error.message}`);
  }
});
