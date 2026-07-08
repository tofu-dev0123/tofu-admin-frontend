import { Clock } from 'lucide-react';
import PostListCard from '@/components/features/admin/home/PostListCard';
import type { Post as PostType } from '@/types/api/post';

interface RecentPostsAreaProps {
  postList: PostType[];
  handleClickPost: (postId: number) => void;
  handleClickViewAll: () => void;
  isLoading?: boolean;
}

function RecentPostsArea({
  postList,
  handleClickPost,
  handleClickViewAll,
  isLoading,
}: RecentPostsAreaProps) {
  return (
    <PostListCard
      title="最近の投稿"
      icon={Clock}
      postList={postList}
      handleClickPost={handleClickPost}
      handleClickViewAll={handleClickViewAll}
      isLoading={isLoading}
    />
  );
}

export default RecentPostsArea;
