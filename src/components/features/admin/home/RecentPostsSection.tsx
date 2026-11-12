'use client';

import RecentPostsArea from '@/components/features/admin/home/RecentPostsArea';
import SectionError from '@/components/features/admin/common/SectionError';
import usePostsQuery from '@/hooks/admin/posts/usePostsQuery';

function RecentPostsSection() {
  const { data, isError } = usePostsQuery({
    limit: 3,
    status: 'PUBLISHED',
  });

  // 表示できるデータが無いときだけスケルトン / エラーにする（再取得失敗では取得済みデータを表示し続ける）
  if (!data) {
    return isError ? (
      <SectionError />
    ) : (
      <RecentPostsArea postList={[]} isLoading />
    );
  }

  return <RecentPostsArea postList={data.posts} />;
}

export default RecentPostsSection;
