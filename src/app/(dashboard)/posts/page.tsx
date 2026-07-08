import { Suspense } from 'react';
import PostsSection from '@/components/features/admin/posts/PostsSection';
import PostListSkeleton from '@/components/features/admin/posts/PostListSkeleton';

type SearchParams = { [key: string]: string | string[] | undefined };

export default function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostsSection searchParamsPromise={searchParams} />
    </Suspense>
  );
}
