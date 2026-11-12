'use client';

import AccountArea from '@/components/features/admin/home/AccountArea';
import SectionError from '@/components/features/admin/common/SectionError';
import useMeQuery from '@/hooks/admin/account/useMeQuery';

function AccountSection() {
  const { data, isPending, isError } = useMeQuery();

  if (isPending) return <AccountArea accountName="" username="" isLoading />;
  if (isError) return <SectionError />;

  return (
    <AccountArea accountName={data.account_name} username={data.username} />
  );
}

export default AccountSection;
