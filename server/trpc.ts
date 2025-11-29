import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '@/db';
import superjson from 'superjson';
import { auth } from '@/lib/auth';

/**
 * TRPC INITIALIZATION
 * 
 * Learning: This file sets up the core tRPC configuration
 * - Context: Data available to all API routes (like database)
 * - Transformer: Handles complex types (Dates, Maps, etc.)
 * - Procedures: Building blocks for API endpoints
 * 
 * Phase 3 Update: Using NextAuth for authentication
 */

/**
 * Context Creation
 * 
 * This function runs for every API request and provides:
 * - Database instance
 * - User session (from NextAuth)
 * - Request headers
 * 
 * Learning: The session tells us if a user is logged in
 * - If session exists: User is authenticated
 * - If session is null: User is not logged in
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
    // Get session from NextAuth
    const session = await auth();

    return {
        db,
        headers: opts.headers,
        session,
        user: session?.user, // null if not logged in
    };
};

// Infer the context type for use in routers
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC with SuperJSON transformer
 * 
 * SuperJSON allows us to send complex types (Dates, Maps, Sets, etc.)
 * without manual serialization. It automatically handles conversion.
 */
const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 * 
 * - router: Create a new router (group of procedures)
 * - publicProcedure: A procedure anyone can call (no auth required)
 * - protectedProcedure: A procedure that requires authentication (Phase 3)
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * PROTECTED PROCEDURE (Phase 3)
 * 
 * Learning: Middleware that runs before your procedure code
 * - Checks if user is authenticated
 * - Throws error if not logged in
 * - Passes user to procedure if authenticated
 * 
 * Usage:
 * create: protectedProcedure.mutation(async ({ ctx }) => {
 *   // ctx.user is guaranteed to exist here
 *   const userId = ctx.user.id;
 * });
 */
export const protectedProcedure = t.procedure.use(async (opts) => {
    if (!opts.ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to perform this action',
        });
    }

    return opts.next({
        ctx: {
            ...opts.ctx,
            // user is now guaranteed to be non-null
            user: opts.ctx.user,
        },
    });
});

/**
 * HOW PROTECTED PROCEDURES WORK
 * 
 * 1. Client makes request with session cookie
 * 2. createTRPCContext runs, gets session from cookie
 * 3. protectedProcedure middleware checks if user exists
 * 4. If no user: Throws UNAUTHORIZED error
 * 5. If user exists: Continues to your procedure code
 * 6. Your code can safely use ctx.user (TypeScript knows it exists!)
 * 
 * This pattern is called "middleware" - code that runs before your main logic
 */
