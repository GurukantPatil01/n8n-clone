import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * EXECUTIONS PAGE
 * 
 * Learning: View workflow execution history
 * - List all executions
 * - Filter by workflow
 * - View execution details
 * - Retry failed executions
 */

export default async function ExecutionsPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Executions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and manage workflow execution history
                    </p>
                </div>

                {/* Coming Soon */}
                <div className="card text-center py-16">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">📋</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Executions Coming Soon
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        This page will show your workflow execution history, including success/failure status, execution time, and detailed logs.
                    </p>
                </div>
            </div>
        </div>
    );
}
