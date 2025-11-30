import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function CredentialsPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Credentials</h1>
                        <p className="text-gray-600">Manage API keys and authentication credentials</p>
                    </div>
                    <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Credential
                    </button>
                </div>

                {/* Empty State */}
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No credentials stored</h3>
                    <p className="text-gray-600 mb-6">
                        Add API keys and credentials to connect your workflows with external services.
                    </p>
                    <button className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                        Add Your First Credential
                    </button>
                </div>
            </div>
        </div>
    );
}
