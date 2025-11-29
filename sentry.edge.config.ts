import * as Sentry from '@sentry/nextjs';
/**
 * SENTRY EDGE CONFIGURATION
 * 
 * Learning: This runs in Edge Runtime (Vercel Edge Functions, Middleware)
 * - Middleware errors
 * - Edge API routes
 * - Edge runtime functions
 */
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    debug: false,
});
