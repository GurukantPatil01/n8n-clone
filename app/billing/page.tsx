import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import BillingContent from '@/components/billing/BillingContent';

/**
 * BILLING PAGE
 * 
 * Learning: Manage subscriptions and billing
 * - View current plan
 * - Manage subscription
 * - View usage
 * - Access customer portal
 */

export default async function BillingPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    // Mock subscription data (will be replaced with real data from database)
    const subscription = {
        plan: 'Free',
        status: 'active',
        executionsUsed: 45,
        executionsLimit: 100,
        workflowsUsed: 2,
        workflowsLimit: 3,
    };

    return <BillingContent subscription={subscription} />;
}
