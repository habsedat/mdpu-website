import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import { serverTimestamp } from 'firebase/firestore';

// Required for static export
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' }, 
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized');
      return;
    }

    const uid = session.metadata?.uid;
    const type = session.metadata?.type;

    if (!uid || !type) {
      console.error('Missing metadata in session:', session.id);
      return;
    }

    // Create payment record
    const paymentData = {
      uid: uid,
      amount: (session.amount_total || 0) / 100, // Convert from cents
      currency: session.currency || 'usd',
      method: 'stripe',
      type: type,
      status: 'succeeded',
      createdAt: serverTimestamp(),
      stripe: {
        sessionId: session.id,
        paymentIntentId: session.payment_intent as string,
        customerId: session.customer as string,
      },
    };

    // Use session ID as document ID to prevent duplicates
    await adminDb.collection('payments').doc(session.id).set(paymentData);

    // Update user's total contributions
    const profileRef = adminDb.collection('profiles').doc(uid);
    const profileDoc = await profileRef.get();
    
    if (profileDoc.exists) {
      const currentTotals = profileDoc.data()?.totals?.contributions || 0;
      await profileRef.update({
        'totals.contributions': currentTotals + paymentData.amount,
      });
    }

    console.log(`Payment recorded for user ${uid}: $${paymentData.amount}`);

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized');
      return;
    }

    const customerId = invoice.customer as string;
    
    // Get customer to find uid
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return;
    
    const uid = customer.metadata?.uid;
    if (!uid) {
      console.error('No uid found in customer metadata:', customerId);
      return;
    }

    // Create payment record for subscription payment
    const paymentData = {
      uid: uid,
      amount: (invoice.amount_paid || 0) / 100,
      currency: invoice.currency || 'usd',
      method: 'stripe',
      type: 'dues', // Subscription payments are typically dues
      status: 'succeeded',
      createdAt: serverTimestamp(),
      stripe: {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription as string,
        customerId: customerId,
      },
    };

    // Use invoice ID as document ID to prevent duplicates
    await adminDb.collection('payments').doc(invoice.id).set(paymentData);

    // Update user's total contributions
    const profileRef = adminDb.collection('profiles').doc(uid);
    const profileDoc = await profileRef.get();
    
    if (profileDoc.exists) {
      const currentTotals = profileDoc.data()?.totals?.contributions || 0;
      await profileRef.update({
        'totals.contributions': currentTotals + paymentData.amount,
      });
    }

    console.log(`Subscription payment recorded for user ${uid}: $${paymentData.amount}`);

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized');
      return;
    }

    const customerId = invoice.customer as string;
    
    // Get customer to find uid
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return;
    
    const uid = customer.metadata?.uid;
    if (!uid) return;

    // Create failed payment record
    const paymentData = {
      uid: uid,
      amount: (invoice.amount_due || 0) / 100,
      currency: invoice.currency || 'usd',
      method: 'stripe',
      type: 'dues',
      status: 'failed',
      createdAt: serverTimestamp(),
      stripe: {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription as string,
        customerId: customerId,
      },
    };

    await adminDb.collection('payments').doc(`${invoice.id}_failed`).set(paymentData);

    console.log(`Failed payment recorded for user ${uid}: $${paymentData.amount}`);

  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}
