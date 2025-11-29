'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './client';
import superjson from 'superjson';

/**
 * TRPC PROVIDER
 * 
 * Learning: This component wraps your app to enable tRPC hooks
 * 
 * What it does:
 * 1. Creates a QueryClient (manages caching and refetching)
 * 2. Creates a tRPC client (handles API communication)
 * 3. Provides both to your app via React Context
 * 
 * After wrapping your app, you can use tRPC hooks anywhere!
 */

export function TRPCProvider({ children }: { children: React.ReactNode }) {
    /**
     * QueryClient Configuration
     * 
     * Learning: React Query manages server state (data from APIs)
     * - Automatic caching: Same query = cached result
     * - Automatic refetching: Refetch when window regains focus
     * - Stale time: How long data is considered fresh
     */
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // Data is fresh for 1 minute
                        refetchOnWindowFocus: false, // Don't refetch when switching tabs
                    },
                },
            })
    );

    /**
     * tRPC Client Configuration
     * 
     * Learning: The client needs to know:
     * - url: Where your API is (Next.js API route)
     * - transformer: How to handle complex types (SuperJSON)
     * - batch: Combine multiple requests into one (performance optimization)
     */
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    transformer: superjson,
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
}

/**
 * Helper function to get the base URL
 * 
 * Learning: Different URLs for different environments:
 * - Browser: Use relative URL (same domain)
 * - Server: Use absolute URL (for SSR)
 */
function getBaseUrl() {
    if (typeof window !== 'undefined') {
        // Browser: Use relative URL
        return '';
    }

    // Server: Use localhost
    if (process.env.VERCEL_URL) {
        // Vercel deployment
        return `https://${process.env.VERCEL_URL}`;
    }

    // Local development
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * LEARNING SUMMARY
 * 
 * This provider enables:
 * 1. tRPC hooks throughout your app
 * 2. Automatic caching of API responses
 * 3. Automatic refetching when data is stale
 * 4. Request batching for better performance
 * 5. SuperJSON for complex type serialization
 * 
 * Next: Wrap your app with this provider in layout.tsx
 */
