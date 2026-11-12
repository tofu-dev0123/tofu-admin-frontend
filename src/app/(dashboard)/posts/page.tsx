import { Suspense } from 'react';
import PostListMain from '@/components/features/admin/posts/PostListMain';
import PostListSkeleton from '@/components/features/admin/posts/PostListSkeleton';

// 一覧はクライアントで取得する（TanStack Query）。useSearchParams を使うため Suspense で包む
export default function Page() {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostListMain />
    </Suspense>
  );
}
