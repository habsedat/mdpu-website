import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

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
    
    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const { type } = await request.json();

    if (!type || !['dues', 'donation'].includes(type)) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    // Get user profile to check for existing Stripe customer
    let customerId: string | undefined;
    try {
      const profileDoc = await adminDb.collection('profiles').doc(uid).get();
      if (profileDoc.exists) {
        const profileData = profileDoc.data();
        customerId = profileData?.stripeCustomerId;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          uid: uid,
        },
      });
      customerId = customer.id;

      // Update profile with Stripe customer ID
      try {
        await adminDb.collection('profiles').doc(uid).update({
          stripeCustomerId: customerId,
        });
      } catch (error) {
        console.error('Error updating profile with Stripe customer ID:', error);
      }
    }

    // Determine price and mode based on type
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    let mode: Stripe.Checkout.SessionCreateParams.Mode;

    if (type === 'dues') {
      // Use price ID from environment or create price on the fly
      const priceId = process.env.STRIPE_DUES_PRICE_ID;
      
      if (priceId) {
        lineItems = [{ price: priceId, quantity: 1 }];
        mode = 'subscription';
      } else {
        // Create one-time payment for dues
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MDPU Annual Membership Dues',
              description: 'Annual membership dues for Mathamba Descendants Progressive Union',
            },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        }];
        mode = 'payment';
      }
    } else {
      // Donation - let user choose amount
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'MDPU Donation',
            description: 'Support the Mathamba Descendants Progressive Union',
          },
          unit_amount: 2500, // Default $25.00, user can adjust
        },
        quantity: 1,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 100,
        },
      }];
      mode = 'payment';
    }

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: mode,
      success_url: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/profile?success=true`,
      cancel_url: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/profile?canceled=true`,
      metadata: {
        uid: uid,
        type: type,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      payment_method_types: ['card'],
      // Enable Apple Pay and Google Pay
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' }, 
      { status: 500 }
    );
  }
}
