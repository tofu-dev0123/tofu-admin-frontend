'use client';

import { FilePenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PostListCard from '@/components/features/admin/home/PostListCard';
import type { Post as PostType } from '@/types/api/post';

interface DraftPostsAreaProps {
  draftPostList: PostType[];
  isLoading?: boolean;
}

function DraftPostsArea({ draftPostList, isLoading }: DraftPostsAreaProps) {
  const router = useRouter();

  return (
    <PostListCard
      title="下書き"
      icon={FilePenLine}
      postList={draftPostList}
      handleClickPost={(postId) => router.push(`/posts/${postId}/edit`)}
      handleClickViewAll={() => router.push('/posts')}
      isLoading={isLoading}
    />
  );
}

export default DraftPostsArea;
