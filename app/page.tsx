import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    // Redirect to workflows page (dashboard = workflows list)
    redirect('/workflows');
}
