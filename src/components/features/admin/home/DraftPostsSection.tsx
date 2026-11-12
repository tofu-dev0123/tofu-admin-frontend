'use client';

import DraftPostsArea from '@/components/features/admin/home/DraftPostsArea';
import SectionError from '@/components/features/admin/common/SectionError';
import usePostsQuery from '@/hooks/admin/posts/usePostsQuery';

function DraftPostsSection() {
  const { data, isError } = usePostsQuery({
    limit: 3,
    status: 'DRAFT',
  });

  // 表示できるデータが無いときだけスケルトン / エラーにする（再取得失敗では取得済みデータを表示し続ける）
  if (!data) {
    return isError ? (
      <SectionError />
    ) : (
      <DraftPostsArea draftPostList={[]} isLoading />
    );
  }

  return <DraftPostsArea draftPostList={data.posts} />;
}

export default DraftPostsSection;
