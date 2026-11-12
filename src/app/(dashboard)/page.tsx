import AccountSection from '@/components/features/admin/home/AccountSection';
import SummarySection from '@/components/features/admin/home/SummarySection';
import RecentPostsSection from '@/components/features/admin/home/RecentPostsSection';
import DraftPostsSection from '@/components/features/admin/home/DraftPostsSection';
import HomeActions from '@/components/features/admin/home/HomeActions';

// 領域ごとにクライアントで取得する（TanStack Query）。
// 取得中は各 Section が Area の isLoading スケルトンを出し、2 回目以降はキャッシュを即表示する。
export default function Page() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 lg:px-20">
      {/* 上段: アカウントカード + 主要導線 */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AccountSection />
        <HomeActions />
      </div>

      {/* サマリ（KPIカード） */}
      <div className="mb-6">
        <SummarySection />
      </div>

      {/* 最近の投稿 / 下書き（横2カラム） */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentPostsSection />
        <DraftPostsSection />
      </div>
    </div>
  );
}
