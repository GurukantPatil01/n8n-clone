import { router } from '../trpc';
import { workflowRouter } from './workflow';
import { jobsRouter } from './jobs';

/**
 * APP ROUTER
 * 
 * Learning: This is the root router that combines all feature routers
 * 
 * Structure:
 * - workflows: All workflow-related operations
 * - jobs: Background job management (Phase 6)
 * - users: (Phase 3) User management
 * - nodes: (Future) Node operations
 * - executions: (Future) Execution history
 * 
 * How it works:
 * When you call `trpc.workflows.list.query()`, tRPC routes to:
 * appRouter → workflows → list
 */
export const appRouter = router({
    workflows: workflowRouter,
    jobs: jobsRouter,
    // Future routers will be added here:
    // users: userRouter,
    // nodes: nodeRouter,
    // executions: executionRouter,
});

/**
 * Export the router type
 * 
 * Learning: This type is used by the client to get full type safety
 * The client will know all available routes and their types automatically!
 * 
 * This is the "magic" of tRPC - one type definition powers everything
 */
export type AppRouter = typeof appRouter;
