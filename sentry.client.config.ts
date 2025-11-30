import * as Sentry from '@sentry/nextjs';

/**
 * SENTRY CLIENT CONFIGURATION
 * 
 * Learning: This runs in the browser to track frontend errors
 * - Catches unhandled errors
 * - Tracks user interactions (breadcrumbs)
 * - Records session replays (optional)
 * - Monitors performance
 * 
 * Setup:
 * 1. Create account at https://sentry.io
 * 2. Create Next.js project
 * 3. Copy DSN to .env.local as NEXT_PUBLIC_SENTRY_DSN
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Send user IP and request headers (helps identify users)
    sendDefaultPii: true,

    // Session Replay (optional - captures user sessions)
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    replaysSessionSampleRate: 0.1, // 10% of normal sessions

    // Debug mode (only in development)
    debug: process.env.NODE_ENV === 'development',

    // Integrations - commented out to avoid build errors
    // Uncomment when Sentry is properly configured with compatible version
    // integrations: [
    //     new Sentry.Replay({
    //         maskAllText: true,
    //         blockAllMedia: true,
    //     }),
    // ],

    // Filter out noise
    ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // React hydration mismatches (common in dev)
        'Hydration failed',
        'Text content does not match',
    ],

    // Before sending to Sentry
    beforeSend(event, hint) {
        // Don't send if no DSN configured
        if (!SENTRY_DSN) {
            console.log('[Sentry] Event captured (DSN not configured):', event);
            return null;
        }

        return event;
    },
});

/**
 * LEARNING NOTES:
 * 
 * Sentry Concepts:
 * - DSN: Data Source Name - your project's unique identifier
 * - Environment: development, staging, production
 * - Sample Rate: % of events to track (save quota)
 * - Breadcrumbs: Trail of user actions before error
 * - Session Replay: Video-like recording of user session
 * 
 * Privacy Considerations:
 * - maskAllText: Hides all text content
 * - blockAllMedia: Hides images/videos
 * - beforeSend: Filter sensitive data
 * - Remove cookies and headers
 * 
 * Performance Impact:
 * - Minimal: ~10KB gzipped
 * - Async: Doesn't block rendering
 * - Sample Rate: Control data volume
 */
