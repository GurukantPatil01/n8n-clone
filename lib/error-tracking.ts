import * as Sentry from '@sentry/nextjs';

/**
 * CUSTOM ERROR TRACKING UTILITIES
 * 
 * Learning: Wrapper functions for consistent error logging
 * - Centralized error handling
 * - Consistent context
 * - Easy to use throughout app
 * - Works with or without Sentry
 */

/**
 * Log an error to Sentry with context
 */
export function logError(
    error: Error | string,
    context?: Record<string, any>
) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Always log to console
    console.error('[Error]', errorObj, context);

    // Send to Sentry
    Sentry.captureException(errorObj, {
        extra: context,
    });
}

/**
 * Log a message to Sentry
 */
export function logMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: Record<string, any>
) {
    console.log(`[${level.toUpperCase()}]`, message, context);

    Sentry.captureMessage(message, {
        level,
        extra: context,
    });
}

/**
 * Set user context for error tracking
 * Call this after user logs in
 */
export function setUserContext(user: {
    id: string;
    email?: string;
    name?: string;
}) {
    Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name,
    });
}

/**
 * Clear user context
 * Call this when user logs out
 */
export function clearUserContext() {
    Sentry.setUser(null);
}

/**
 * Add breadcrumb (trail of actions before error)
 */
export function addBreadcrumb(
    message: string,
    data?: Record<string, any>,
    category?: string
) {
    Sentry.addBreadcrumb({
        message,
        data,
        category: category || 'custom',
        level: 'info',
        timestamp: Date.now() / 1000,
    });
}

/**
 * Track a custom event
 */
export function trackEvent(
    eventName: string,
    properties?: Record<string, any>
) {
    addBreadcrumb(eventName, properties, 'event');
}

/**
 * Wrap async function with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: Record<string, any>
): T {
    return (async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            logError(error as Error, {
                ...context,
                args,
            });
            throw error;
        }
    }) as T;
}

/**
 * Check if Sentry is configured
 */
export function isSentryConfigured(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_SENTRY_DSN ||
        process.env.SENTRY_DSN
    );
}

/**
 * LEARNING NOTES:
 * 
 * Error Context:
 * - Always add relevant context to errors
 * - Include user ID, workflow ID, action, etc.
 * - Helps debug issues faster
 * 
 * Breadcrumbs:
 * - Trail of actions before error
 * - Automatic: navigation, clicks, API calls
 * - Manual: custom events
 * - Max 100 breadcrumbs per event
 * 
 * User Context:
 * - Attach user info to errors
 * - See which users are affected
 * - Filter errors by user
 * - Privacy: don't include sensitive data
 * 
 * Example Usage:
 * 
 * // Log error with context
 * try {
 *   await executeWorkflow(id);
 * } catch (error) {
 *   logError(error, { workflowId: id });
 * }
 * 
 * // Set user on login
 * setUserContext({
 *   id: user.id,
 *   email: user.email,
 * });
 * 
 * // Add breadcrumb
 * addBreadcrumb('Workflow started', { workflowId: id });
 * 
 * // Wrap function
 * const safeExecute = withErrorTracking(executeWorkflow);
 */
