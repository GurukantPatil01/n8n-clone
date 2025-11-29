import Stripe from 'stripe';

/**
 * STRIPE CONFIGURATION
 * 
 * Learning: Stripe setup for payments and subscriptions
 * - Server-side SDK for secure operations
 * - Test mode for development
 * - TypeScript support
 * 
 * Setup:
 * 1. Create account at https://stripe.com
 * 2. Get API keys from Dashboard
 * 3. Add to .env.local
 */

// Initialize Stripe (only if API key is provided)
export const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover',
        typescript: true,
    })
    : null;

// Price IDs for subscription plans
export const STRIPE_PRICES = {
    PRO_MONTHLY: process.env.STRIPE_PRO_PRICE_ID || '',
    ENTERPRISE_MONTHLY: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
};

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
    return !!(
        process.env.STRIPE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
}

/**
 * LEARNING NOTES:
 * 
 * Stripe API Versions:
 * - Locked to specific version for stability
 * - Breaking changes announced in advance
 * - Can upgrade when ready
 * 
 * Test vs Live Mode:
 * - Test keys start with sk_test_ / pk_test_
 * - Live keys start with sk_live_ / pk_live_
 * - Separate data for each mode
 * 
 * Security:
 * - Secret key NEVER goes to client
 * - Publishable key is safe for client
 * - Always verify webhook signatures
 */
