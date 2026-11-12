'use client';

import SummaryArea from '@/components/features/admin/home/SummaryArea';
import SectionError from '@/components/features/admin/common/SectionError';
import usePostSummaryQuery from '@/hooks/admin/posts/usePostSummaryQuery';

function SummarySection() {
  const { data, isError } = usePostSummaryQuery();

  // 表示できるデータが無いときだけスケルトン / エラーにする（再取得失敗では取得済みデータを表示し続ける）
  if (!data) return isError ? <SectionError /> : <SummaryArea isLoading />;

  return (
    <SummaryArea
      totalPosts={data.total_count}
      publishedPosts={data.published_count}
      draftPosts={data.draft_count}
    />
  );
}

export default SummarySection;
