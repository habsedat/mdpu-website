import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, adminStorage } from '@/lib/firebase-admin';
import { serverTimestamp } from 'firebase/firestore';

// Required for static export
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb || !adminStorage) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const formData = await request.formData();
    const method = formData.get('method') as string;
    const type = formData.get('type') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = formData.get('currency') as string || 'SLL'; // Sierra Leone Leone
    const reference = formData.get('reference') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const evidence = formData.get('evidence') as File;

    // Validate required fields
    if (!method || !['bank', 'orange', 'afrimoney'].includes(method)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    if (!type || !['dues', 'donation'].includes(type)) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!reference) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
    }

    let evidenceUrl = '';

    // Upload evidence file if provided
    if (evidence && evidence.size > 0) {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(evidence.type)) {
          return NextResponse.json({ 
            error: 'Invalid file type. Only JPG, PNG, and PDF files are allowed.' 
          }, { status: 400 });
        }

        // Validate file size (5MB max)
        if (evidence.size > 5 * 1024 * 1024) {
          return NextResponse.json({ 
            error: 'File size too large. Maximum 5MB allowed.' 
          }, { status: 400 });
        }

        // Create unique filename
        const timestamp = Date.now();
        const fileExtension = evidence.name.split('.').pop();
        const filename = `user-uploads/${uid}/${timestamp}_${reference}.${fileExtension}`;

        // Convert File to Buffer
        const bytes = await evidence.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Firebase Storage
        const bucket = adminStorage.bucket();
        const file = bucket.file(filename);
        
        await file.save(buffer, {
          metadata: {
            contentType: evidence.type,
          },
        });

        // Make file publicly readable
        await file.makePublic();

        // Get download URL
        evidenceUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

      } catch (error) {
        console.error('Error uploading evidence:', error);
        return NextResponse.json({ 
          error: 'Failed to upload evidence file' 
        }, { status: 500 });
      }
    }

    // Create payment record
    const paymentData = {
      uid: uid,
      amount: amount,
      currency: currency.toUpperCase(),
      method: method,
      type: type,
      status: 'pending', // Requires admin verification
      createdAt: serverTimestamp(),
      evidenceUrl: evidenceUrl,
      refs: {
        reference: reference,
        phoneNumber: phoneNumber || '',
        transactionId: reference, // Use reference as transaction ID for now
      },
    };

    // Create new payment document
    const paymentRef = await adminDb.collection('payments').add(paymentData);

    return NextResponse.json({ 
      success: true, 
      paymentId: paymentRef.id,
      message: 'Payment submitted successfully. It will be verified by an administrator.' 
    });

  } catch (error) {
    console.error('Error submitting offline payment:', error);
    return NextResponse.json(
      { error: 'Failed to submit payment' }, 
      { status: 500 }
    );
  }
}

// Handle GET requests to provide payment instructions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const method = searchParams.get('method');

  const instructions = {
    bank: {
      title: 'Bank Transfer Instructions',
      details: {
        bankName: 'Sierra Leone Commercial Bank',
        accountName: 'Mathamba Descendants Progressive Union',
        accountNumber: '1234567890',
        sortCode: '010203',
        swift: 'SLCBSLSL',
      },
      steps: [
        'Transfer the amount to the account details above',
        'Take a screenshot or photo of the transfer receipt',
        'Enter the transaction reference number from your receipt',
        'Upload the receipt image as evidence',
        'Submit for verification'
      ],
      note: 'Bank transfers typically take 1-3 business days to process. Please keep your receipt until the payment is verified.'
    },
    orange: {
      title: 'Orange Money Instructions',
      details: {
        merchantCode: 'MDPU001',
        merchantName: 'MDPU Payments',
        phoneNumber: '+23276123456',
      },
      steps: [
        'Dial *144# on your Orange SL phone',
        'Select option 1 (Send Money)',
        'Enter merchant number: +23276123456',
        'Enter the amount you want to pay',
        'Enter your Orange Money PIN',
        'Confirm the transaction',
        'Save the transaction reference number',
        'Upload screenshot of confirmation SMS'
      ],
      note: 'Orange Money transactions are processed instantly. Make sure to save your transaction reference.',
      helpUrl: 'https://www.orange.sl/orange-money'
    },
    afrimoney: {
      title: 'AfriMoney Instructions',
      details: {
        merchantCode: 'MDPU',
        ussdCode: '*161#',
        merchantNumber: '+23277654321',
      },
      steps: [
        'Dial *161# on your Africell phone',
        'Select option 4 (Pay Merchant)',
        'Enter merchant code: MDPU',
        'Enter the amount you want to pay',
        'Enter your AfriMoney PIN',
        'Confirm the transaction',
        'Save the transaction reference number',
        'Upload screenshot of confirmation SMS'
      ],
      note: 'AfriMoney transactions are processed instantly. Keep your transaction reference safe.',
      helpUrl: 'https://africell.sl/afrimoney'
    }
  };

  if (method && instructions[method as keyof typeof instructions]) {
    return NextResponse.json(instructions[method as keyof typeof instructions]);
  }

  return NextResponse.json(instructions);
}
