import { Suspense } from 'react';
import AccountSection from '@/components/features/admin/account/AccountSection';
import AccountMainSkeleton from '@/components/features/admin/account/AccountMainSkeleton';

export default function Page() {
  return (
    <Suspense fallback={<AccountMainSkeleton />}>
      <AccountSection />
    </Suspense>
  );
}
