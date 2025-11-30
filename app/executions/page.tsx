import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function ExecutionsPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Executions</h1>
                    <p className="text-gray-600">View and manage workflow execution history</p>
                </div>

                {/* Empty State */}
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No executions yet</h3>
                    <p className="text-gray-600 mb-6">
                        Workflow executions will appear here once you run your workflows.
                    </p>
                </div>
            </div>
        </div>
    );
}
