import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * SETTINGS PAGE
 * 
 * Learning: App and user settings
 * - Profile settings
 * - Notification preferences
 * - API keys
 * - Theme settings
 */

export default async function SettingsPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account and application preferences
                    </p>
                </div>

                {/* Profile Section */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        Profile
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={session.user?.name || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={session.user?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Coming Soon Sections */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        More Settings Coming Soon
                    </h2>
                    <div className="space-y-3 text-gray-600 dark:text-gray-400">
                        <p>• Notification preferences</p>
                        <p>• API key management</p>
                        <p>• Theme customization</p>
                        <p>• Workflow defaults</p>
                        <p>• Security settings</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
