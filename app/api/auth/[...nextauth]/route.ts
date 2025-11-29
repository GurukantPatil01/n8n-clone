import { handlers } from '@/lib/auth';

/**
 * NEXTAUTH API ROUTE
 * 
 * Learning: This catch-all route handles ALL NextAuth endpoints
 * 
 * Routes handled automatically:
 * - GET/POST /api/auth/signin - Sign in page and submission
 * - GET/POST /api/auth/signout - Sign out
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/csrf - CSRF token
 * - GET /api/auth/providers - List available providers
 * - POST /api/auth/callback/:provider - OAuth callbacks
 * 
 * The [...nextauth] folder name is a Next.js catch-all route
 * It matches any path like /api/auth/signin, /api/auth/signout, etc.
 */

export const { GET, POST } = handlers;

/**
 * HOW IT WORKS
 * 
 * When a user tries to log in:
 * 1. Frontend calls: POST /api/auth/callback/credentials
 * 2. This route receives the request
 * 3. NextAuth calls the authorize() function in lib/auth.ts
 * 4. If valid, creates JWT and sets cookie
 * 5. Returns session data to frontend
 * 
 * NextAuth automatically handles:
 * - JWT creation and encryption
 * - Cookie management (HTTP-only, secure)
 * - CSRF protection
 * - Session refresh
 * - Error responses
 */
