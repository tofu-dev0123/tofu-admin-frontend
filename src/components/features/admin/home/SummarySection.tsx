'use client';

import SummaryArea from '@/components/features/admin/home/SummaryArea';
import SectionError from '@/components/features/admin/common/SectionError';
import usePostSummaryQuery from '@/hooks/admin/posts/usePostSummaryQuery';

function SummarySection() {
  const { data, isPending, isError } = usePostSummaryQuery();

  if (isPending) return <SummaryArea isLoading />;
  if (isError) return <SectionError />;

  return (
    <SummaryArea
      totalPosts={data.total_count}
      publishedPosts={data.published_count}
      draftPosts={data.draft_count}
    />
  );
}

export default SummarySection;
