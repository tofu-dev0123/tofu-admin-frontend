'use client';

import AccountMain from '@/components/features/admin/account/AccountMain';
import AccountMainSkeleton from '@/components/features/admin/account/AccountMainSkeleton';
import SectionError from '@/components/features/admin/common/SectionError';
import useMeQuery from '@/hooks/admin/account/useMeQuery';

function AccountSection() {
  const { data, isError } = useMeQuery();

  // 表示できるデータが無いときだけスケルトン / エラーにする（再取得失敗では取得済みデータを表示し続ける）
  if (!data) {
    return isError ? <SectionError className="m-4" /> : <AccountMainSkeleton />;
  }

  return <AccountMain account={data} />;
}

export default AccountSection;
