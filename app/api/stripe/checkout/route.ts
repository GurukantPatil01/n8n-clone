import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';

/**
 * STRIPE CHECKOUT API
 * 
 * Learning: Create Stripe checkout sessions
 * - Server-side only (uses secret key)
 * - Creates checkout session
 * - Redirects to Stripe-hosted checkout
 * - Returns to success/cancel URLs
 */

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if Stripe is configured
        if (!stripe) {
            return NextResponse.json(
                { error: 'Stripe is not configured. Please add your Stripe keys to .env.local' },
                { status: 500 }
            );
        }

        // Get price ID from request
        const { priceId } = await request.json();

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID is required' },
                { status: 400 }
            );
        }

        // Validate price ID
        const validPriceIds = Object.values(STRIPE_PRICES);
        if (!validPriceIds.includes(priceId)) {
            return NextResponse.json(
                { error: 'Invalid price ID' },
                { status: 400 }
            );
        }

        // Get the origin for redirect URLs
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${origin}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/pricing?canceled=true`,
            customer_email: session.user.email,
            metadata: {
                userId: session.user.id || session.user.email,
            },
            // Enable customer portal access
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
        });

        // Return the checkout URL
        return NextResponse.json({
            url: checkoutSession.url,
            sessionId: checkoutSession.id,
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}

/**
 * LEARNING NOTES:
 * 
 * Checkout Session:
 * - Temporary session for payment
 * - Expires after 24 hours
 * - Hosted by Stripe (secure, PCI compliant)
 * 
 * Success/Cancel URLs:
 * - User redirected after payment
 * - Can include session_id for verification
 * - Use query params to show messages
 * 
 * Metadata:
 * - Custom data attached to session
 * - Received in webhooks
 * - Used to link Stripe customer to your user
 */
