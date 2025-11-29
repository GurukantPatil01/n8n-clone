import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

/**
 * TRPC REACT CLIENT
 * 
 * Learning: This creates React hooks for calling your API
 * 
 * The magic: TypeScript knows all your API routes and types!
 * - trpc.workflows.list.useQuery() - TypeScript knows the return type
 * - trpc.workflows.create.useMutation() - TypeScript knows the input type
 * 
 * No manual type definitions needed!
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * HOW TO USE
 * 
 * In any React component:
 * 
 * // Fetch data (automatically cached and refetched)
 * const { data, isLoading } = trpc.workflows.list.useQuery();
 * 
 * // Mutate data (create, update, delete)
 * const createMutation = trpc.workflows.create.useMutation();
 * await createMutation.mutateAsync({ name: "New Workflow", userId: 1 });
 * 
 * TypeScript will autocomplete everything and catch errors!
 */
