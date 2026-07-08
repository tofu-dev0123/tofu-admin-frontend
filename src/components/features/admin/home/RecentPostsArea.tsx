'use client';

import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PostListCard from '@/components/features/admin/home/PostListCard';
import type { Post as PostType } from '@/types/api/post';

interface RecentPostsAreaProps {
  postList: PostType[];
  isLoading?: boolean;
}

function RecentPostsArea({ postList, isLoading }: RecentPostsAreaProps) {
  const router = useRouter();

  return (
    <PostListCard
      title="最近の投稿"
      icon={Clock}
      postList={postList}
      handleClickPost={(postId) => router.push(`/posts/${postId}/edit`)}
      handleClickViewAll={() => router.push('/posts')}
      isLoading={isLoading}
    />
  );
}

export default RecentPostsArea;
