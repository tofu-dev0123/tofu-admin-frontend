import AccountArea from '@/components/features/admin/home/AccountArea';
import SectionError from '@/components/features/admin/common/SectionError';
import { serverFetch } from '@/lib/api/server';
import type { MeResponse } from '@/types/api/account';

async function AccountSection() {
  let me: MeResponse;
  try {
    me = await serverFetch<MeResponse>('/admin/auth/me', {
      method: 'POST',
      label: 'アカウント情報取得',
    });
  } catch {
    return <SectionError />;
  }

  return <AccountArea accountName={me.account_name} username={me.username} />;
}

export default AccountSection;
