import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "N8N Clone - Workflow Automation",
    description: "Learn to build a workflow automation tool like n8n",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ErrorBoundary>
                    <Providers>
                        <TRPCProvider>
                            <div className="flex min-h-screen bg-white">
                                <Sidebar />
                                <main className="flex-1 ml-60">
                                    {children}
                                </main>
                            </div>
                        </TRPCProvider>
                    </Providers>
                </ErrorBoundary>
            </body>
        </html>
    );
}
