import AccountMain from '@/components/features/admin/account/AccountMain';
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
    return <SectionError className="m-4" />;
  }

  return <AccountMain initialAccount={me} />;
}

export default AccountSection;
