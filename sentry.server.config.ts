import * as Sentry from '@sentry/nextjs';

/**
 * SENTRY SERVER CONFIGURATION
 * 
 * Learning: This runs on the server to track backend errors
 * - API route errors
 * - Server component errors
 * - Database errors
 * - tRPC errors
 * 
 * Setup: Add SENTRY_DSN to .env.local (can be same as client DSN)
 */

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Send user IP and request headers
    sendDefaultPii: true,

    // Debug mode
    debug: process.env.NODE_ENV === 'development',

    // Before sending
    beforeSend(event) {
        // Don't send if no DSN configured
        if (!SENTRY_DSN) {
            console.log('[Sentry Server] Event captured (DSN not configured):', event);
            return null;
        }

        return event;
    },
});

/**
 * LEARNING NOTES:
 * 
 * Server vs Client:
 * - Server: Node.js environment, API routes, server components
 * - Client: Browser environment, client components, user interactions
 * 
 * Both configs needed for full coverage!
 */
