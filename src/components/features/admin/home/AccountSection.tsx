'use client';

import AccountArea from '@/components/features/admin/home/AccountArea';
import SectionError from '@/components/features/admin/common/SectionError';
import useMeQuery from '@/hooks/admin/account/useMeQuery';

function AccountSection() {
  const { data, isError } = useMeQuery();

  // 表示できるデータが無いときだけスケルトン / エラーにする（再取得失敗では取得済みデータを表示し続ける）
  if (!data) {
    return isError ? (
      <SectionError />
    ) : (
      <AccountArea accountName="" username="" isLoading />
    );
  }

  return (
    <AccountArea accountName={data.account_name} username={data.username} />
  );
}

export default AccountSection;
