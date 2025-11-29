import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/**
 * NEXTAUTH CONFIGURATION
 * 
 * Learning: NextAuth provides authentication for Next.js apps
 * - Providers: How users can sign in (credentials, OAuth, etc.)
 * - Adapter: Connects NextAuth to your database
 * - Session: How authentication state is managed
 * 
 * We use:
 * - Credentials provider for email/password login
 * - Drizzle adapter for database integration
 * - JWT strategy for sessions (no database sessions needed)
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
    /**
     * Database Adapter
     * 
     * Learning: The adapter tells NextAuth how to:
     * - Store users, sessions, accounts in your database
     * - Query user data
     * - Handle OAuth providers (if added later)
     */
    adapter: DrizzleAdapter(db),

    /**
     * Authentication Providers
     * 
     * Learning: Providers define how users can sign in
     * - Credentials: Traditional email/password
     * - OAuth: Google, GitHub, etc. (can add later)
     * - Magic Links: Passwordless email links
     */
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            /**
             * Authorize Function
             * 
             * Learning: This runs when a user tries to log in
             * 1. Look up user by email
             * 2. Verify password hash
             * 3. Return user object if valid, null if invalid
             */
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Find user in database
                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentials.email as string),
                });

                if (!user) {
                    return null;
                }

                // Verify password
                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isValid) {
                    return null;
                }

                // Return user object (will be stored in JWT)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],

    /**
     * Session Configuration
     * 
     * Learning: Two session strategies:
     * 1. JWT (default): Session data stored in encrypted cookie
     *    - No database lookup needed
     *    - Faster
     *    - Can't be revoked until expiry
     * 
     * 2. Database: Session stored in database
     *    - Requires database lookup
     *    - Can be revoked immediately
     *    - Better for sensitive apps
     * 
     * We use JWT for simplicity and performance
     */
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },

    /**
     * Custom Pages
     * 
     * Learning: Override default NextAuth pages
     * - signIn: Custom login page
     * - signOut: Custom logout page
     * - error: Custom error page
     */
    pages: {
        signIn: '/login',
    },

    /**
     * Callbacks
     * 
     * Learning: Callbacks let you customize NextAuth behavior
     * - jwt: Modify the JWT token
     * - session: Modify the session object
     */
    callbacks: {
        /**
         * JWT Callback
         * 
         * Runs when JWT is created or updated
         * Add custom data to the token here
         */
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        /**
         * Session Callback
         * 
         * Runs when session is accessed
         * Add custom data to the session here
         */
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});

/**
 * LEARNING SUMMARY
 * 
 * NextAuth Flow:
 * 1. User submits credentials
 * 2. authorize() function validates them
 * 3. If valid, JWT token is created
 * 4. Token stored in HTTP-only cookie
 * 5. On subsequent requests, token is verified
 * 6. User data available via auth() function
 * 
 * Security Features:
 * - Passwords hashed with bcrypt
 * - JWT tokens encrypted
 * - HTTP-only cookies (JavaScript can't access)
 * - CSRF protection built-in
 * - Secure by default
 */
