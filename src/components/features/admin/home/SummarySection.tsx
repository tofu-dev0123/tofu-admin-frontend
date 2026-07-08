import SummaryArea from '@/components/features/admin/home/SummaryArea';
import SectionError from '@/components/features/admin/common/SectionError';
import { serverGet } from '@/lib/api/server';
import type { SummaryResponse } from '@/types/api/summary';

async function SummarySection() {
  let summary: SummaryResponse;
  try {
    summary = await serverGet<SummaryResponse>(
      '/admin/posts/summary',
      undefined,
      '投稿サマリ取得'
    );
  } catch {
    return <SectionError />;
  }

  return (
    <SummaryArea
      totalPosts={summary.total_count}
      publishedPosts={summary.published_count}
      draftPosts={summary.draft_count}
    />
  );
}

export default SummarySection;
