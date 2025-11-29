import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createTRPCContext } from '@/server/trpc';

/**
 * NEXT.JS API ROUTE HANDLER FOR TRPC
 * 
 * Learning: This single route handles ALL tRPC API requests
 * 
 * How it works:
 * 1. Client calls: trpc.workflows.list.query()
 * 2. Request goes to: /api/trpc/workflows.list
 * 3. This handler routes it to the correct procedure
 * 4. Response is sent back with full type safety
 * 
 * The [trpc] folder name is a Next.js catch-all route
 * It matches any path like /api/trpc/workflows.list or /api/trpc/workflows.create
 */

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => createTRPCContext({ headers: req.headers }),
    });

// Export as GET and POST handlers for Next.js App Router
export { handler as GET, handler as POST };

/**
 * LEARNING NOTES
 * 
 * Why one route for everything?
 * - tRPC uses the URL path to determine which procedure to call
 * - Example: /api/trpc/workflows.list → appRouter.workflows.list
 * - This is different from REST where you'd have /api/workflows, /api/workflows/:id, etc.
 * 
 * Benefits:
 * - Single configuration point
 * - Automatic routing based on procedure names
 * - Type safety across the entire stack
 */
