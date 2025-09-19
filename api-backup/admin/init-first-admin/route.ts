import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Required for static export
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ 
        error: 'Firebase Admin not initialized. Please check your environment variables.' 
      }, { status: 500 });
    }

    // Get the request body
    const { email, initKey } = await request.json();

    // Simple security check - you should change this key in production
    const expectedInitKey = process.env.ADMIN_INIT_KEY || 'mdpu-admin-init-2024';
    
    if (initKey !== expectedInitKey) {
      return NextResponse.json({ 
        error: 'Invalid initialization key' 
      }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    // Find user by email
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error) {
      // If user doesn't exist, create them
      try {
        userRecord = await adminAuth.createUser({
          email: email,
          emailVerified: true,
          disabled: false,
        });
        console.log(`Created new user: ${email}`);
      } catch (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ 
          error: 'Failed to create user account' 
        }, { status: 500 });
      }
    }

    // Set admin custom claims
    await adminAuth.setCustomUserClaims(userRecord.uid, { 
      role: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'init-script'
    });

    // Create admin profile in Firestore
    const adminProfile = {
      uid: userRecord.uid,
      fullName: 'Admin User',
      email: email,
      role: 'admin',
      status: 'active',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection('profiles').doc(userRecord.uid).set(adminProfile);

    // Create member record for admin
    const memberData = {
      fullName: 'Admin User',
      email: email,
      chapter: 'Administration',
      role: 'Administrator',
      term: '2024-Present',
      bio: 'System Administrator',
      location: 'Global',
      avatarUrl: '',
      uid: userRecord.uid,
      isAdmin: true,
    };

    await adminDb.collection('members').doc(userRecord.uid).set(memberData);

    console.log(`✅ Successfully set admin privileges for: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: `Admin privileges granted to ${email}`,
      uid: userRecord.uid,
      customClaims: { role: 'admin' }
    });

  } catch (error) {
    console.error('Error initializing first admin:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

