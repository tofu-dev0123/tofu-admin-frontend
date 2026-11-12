'use client';

import DraftPostsArea from '@/components/features/admin/home/DraftPostsArea';
import SectionError from '@/components/features/admin/common/SectionError';
import usePostsQuery from '@/hooks/admin/posts/usePostsQuery';

function DraftPostsSection() {
  const { data, isPending, isError } = usePostsQuery({
    limit: 3,
    status: 'DRAFT',
  });

  if (isPending) return <DraftPostsArea draftPostList={[]} isLoading />;
  if (isError) return <SectionError />;

  return <DraftPostsArea draftPostList={data.posts} />;
}

export default DraftPostsSection;
