'use client';

import AccountMain from '@/components/features/admin/account/AccountMain';
import AccountMainSkeleton from '@/components/features/admin/account/AccountMainSkeleton';
import SectionError from '@/components/features/admin/common/SectionError';
import useMeQuery from '@/hooks/admin/account/useMeQuery';

function AccountSection() {
  const { data, isPending, isError } = useMeQuery();

  if (isPending) return <AccountMainSkeleton />;
  if (isError) return <SectionError className="m-4" />;

  return <AccountMain account={data} />;
}

export default AccountSection;
