import AccountSection from '@/components/features/admin/account/AccountSection';

// 取得はクライアントで行う（TanStack Query）。取得中のスケルトンは AccountSection が出す
export default function Page() {
  return <AccountSection />;
}
