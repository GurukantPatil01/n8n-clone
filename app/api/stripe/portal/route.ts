import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

/**
 * STRIPE CUSTOMER PORTAL API
 * 
 * Learning: Create Stripe customer portal sessions
 * - Allows customers to manage their subscriptions
 * - Update payment methods
 * - View invoices
 * - Cancel subscriptions
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

        // Get customer ID from request (in production, this would come from your database)
        const { customerId } = await request.json();

        if (!customerId) {
            return NextResponse.json(
                { error: 'No Stripe customer found. Please subscribe to a plan first.' },
                { status: 400 }
            );
        }

        // Get the origin for redirect URL
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        // Create customer portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/billing`,
        });

        // Return the portal URL
        return NextResponse.json({
            url: portalSession.url,
        });

    } catch (error) {
        console.error('Customer portal error:', error);
        return NextResponse.json(
            { error: 'Failed to create customer portal session' },
            { status: 500 }
        );
    }
}

/**
 * LEARNING NOTES:
 * 
 * Customer Portal:
 * - Hosted by Stripe
 * - Fully managed subscription management
 * - No custom UI needed
 * - Secure and PCI compliant
 * 
 * Features:
 * - Update payment methods
 * - View invoices
 * - Cancel subscriptions
 * - Update billing info
 * 
 * Setup Required:
 * - Enable in Stripe Dashboard
 * - Configure branding
 * - Set allowed actions
 */
