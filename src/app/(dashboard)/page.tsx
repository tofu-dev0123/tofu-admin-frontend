import { Suspense } from 'react';
import AccountArea from '@/components/features/admin/home/AccountArea';
import SummaryArea from '@/components/features/admin/home/SummaryArea';
import RecentPostsArea from '@/components/features/admin/home/RecentPostsArea';
import DraftPostsArea from '@/components/features/admin/home/DraftPostsArea';
import AccountSection from '@/components/features/admin/home/AccountSection';
import SummarySection from '@/components/features/admin/home/SummarySection';
import RecentPostsSection from '@/components/features/admin/home/RecentPostsSection';
import DraftPostsSection from '@/components/features/admin/home/DraftPostsSection';
import HomeActions from '@/components/features/admin/home/HomeActions';

// 領域ごとにサーバーで取得し、準備でき次第 Suspense でストリーム表示する。
// ローディングは各 Area の isLoading スケルトンを fallback として再利用する。
export default function Page() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 lg:px-20">
      {/* 上段: アカウントカード + 主要導線 */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense
          fallback={<AccountArea accountName="" username="" isLoading />}
        >
          <AccountSection />
        </Suspense>
        <HomeActions />
      </div>

      {/* サマリ（KPIカード） */}
      <div className="mb-6">
        <Suspense fallback={<SummaryArea isLoading />}>
          <SummarySection />
        </Suspense>
      </div>

      {/* 最近の投稿 / 下書き（横2カラム） */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Suspense fallback={<RecentPostsArea postList={[]} isLoading />}>
          <RecentPostsSection />
        </Suspense>
        <Suspense fallback={<DraftPostsArea draftPostList={[]} isLoading />}>
          <DraftPostsSection />
        </Suspense>
      </div>
    </div>
  );
}
