import { FilePenLine } from 'lucide-react';
import PostListCard from '@/components/features/admin/home/PostListCard';
import type { Post as PostType } from '@/types/api/post';

interface DraftPostsAreaProps {
  draftPostList: PostType[];
  handleClickPost: (postId: number) => void;
  handleClickViewAll: () => void;
  isLoading?: boolean;
}

function DraftPostsArea({
  draftPostList,
  handleClickPost,
  handleClickViewAll,
  isLoading,
}: DraftPostsAreaProps) {
  return (
    <PostListCard
      title="下書き"
      icon={FilePenLine}
      postList={draftPostList}
      handleClickPost={handleClickPost}
      handleClickViewAll={handleClickViewAll}
      isLoading={isLoading}
    />
  );
}

export default DraftPostsArea;
