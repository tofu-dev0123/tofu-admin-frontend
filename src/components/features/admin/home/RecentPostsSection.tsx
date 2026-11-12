'use client';

import RecentPostsArea from '@/components/features/admin/home/RecentPostsArea';
import SectionError from '@/components/features/admin/common/SectionError';
import usePostsQuery from '@/hooks/admin/posts/usePostsQuery';

function RecentPostsSection() {
  const { data, isPending, isError } = usePostsQuery({
    limit: 3,
    status: 'PUBLISHED',
  });

  if (isPending) return <RecentPostsArea postList={[]} isLoading />;
  if (isError) return <SectionError />;

  return <RecentPostsArea postList={data.posts} />;
}

export default RecentPostsSection;
