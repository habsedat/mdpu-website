import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token and check admin role
    const decodedToken = await adminAuth.verifyIdToken(token);
    const customClaims = decodedToken.role;
    
    if (customClaims !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Get the application
    const applicationRef = adminDb.collection('applications').doc(applicationId);
    const applicationDoc = await applicationRef.get();

    if (!applicationDoc.exists) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const applicationData = applicationDoc.data();
    
    if (!applicationData) {
      return NextResponse.json({ error: 'Invalid application data' }, { status: 400 });
    }

    // Create profile document
    const profileData = {
      uid: applicationData.uid,
      fullName: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      chapter: applicationData.chapter,
      status: 'active',
      joinDate: serverTimestamp(),
      totals: {
        contributions: 0,
      },
      createdAt: serverTimestamp(),
    };

    await adminDb.collection('profiles').doc(applicationData.uid).set(profileData);

    // Optionally create public member card (with safe fields only)
    const memberData = {
      fullName: applicationData.fullName,
      chapter: applicationData.chapter,
      role: '', // Can be set later
      term: '',
      bio: '',
      location: applicationData.chapter,
      avatarUrl: '',
    };

    await adminDb.collection('members').doc(applicationData.uid).set(memberData);

    // Update application status
    await applicationRef.update({
      status: 'approved',
      updatedAt: serverTimestamp(),
    });

    // Set admin custom claim if this is the first user (for development)
    // In production, you'd set admin claims through a separate process
    try {
      const userRecord = await adminAuth.getUser(applicationData.uid);
      if (!userRecord.customClaims?.role) {
        // Check if this is the first user or a specific email
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
        if (adminEmails.includes(applicationData.email)) {
          await adminAuth.setCustomUserClaims(applicationData.uid, { role: 'admin' });
        }
      }
    } catch (error) {
      console.error('Error setting custom claims:', error);
      // Don't fail the approval process if custom claims fail
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Application approved successfully' 
    });

  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
