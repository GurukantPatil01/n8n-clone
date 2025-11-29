'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * SESSION PROVIDER WRAPPER
 * 
 * Learning: NextAuth requires SessionProvider to be a client component
 * We wrap it here so layout.tsx can remain a server component
 */

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
